import { Console } from "console";

export interface PullRequest {
  number: number;
  title: string;
  author: string;
  url: string;
  votes: number;
  upvotes: number;
  downvotes: number;
  comments: number;
  createdAt: string;
  isMergeable: boolean;
  checksPassed: boolean;
  hotScore: number;
  risingScore: number;
}

/**
 * Calculate a "hot score" for ranking PRs, inspired by Reddit's algorithm.
 * Combines vote count (logarithmic) with recency (linear) so newer PRs
 * with fewer votes can compete with older PRs that have more votes.
 */
function calculateHotScore(votes: number, createdAt: string): number {
  const voteScore = Math.log10(Math.max(votes, 1) + 1);
  const createdSeconds = new Date(createdAt).getTime() / 1000;
  const referenceTime = new Date("2024-01-01").getTime() / 1000;
  const ageSeconds = createdSeconds - referenceTime;
  const decayConstant = 45000; // ~12.5 hours
  return voteScore + ageSeconds / decayConstant;
}

export interface MergedPullRequest {
  number: number;
  title: string;
  author: string;
  url: string;
  mergedAt: string;
}

interface GitHubPR {
  number: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
  created_at: string;
  comments: number;
  head: {
    sha: string;
  };
}

interface GitHubReaction {
  content: string;
  created_at: string;
}

interface GitHubPRDetail {
  mergeable: boolean | null;
}

interface GitHubCheckRunsResponse {
  total_count: number;
  check_runs: {
    status: string;
    conclusion: string | null;
  }[];
}

const GITHUB_REPO = "skridlevsky/openchaos";

function getHeaders(accept: string): Record<string, string> {
  const headers: Record<string, string> = { Accept: accept };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function getOpenPRs(): Promise<PullRequest[]> {
  const [owner, repo] = GITHUB_REPO.split("/");

  let allPRs: GitHubPR[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=100&page=${page}`,
      {
        headers: getHeaders("application/vnd.github.v3+json"),
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Rate limited by GitHub API");
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const prs: GitHubPR[] = await response.json();

    if (prs.length === 0) {
      break;
    }

    allPRs = allPRs.concat(prs);

    if (prs.length < 100) {
      break;
    }

    page++;
  }

  const prs = allPRs;

  // Fetch reactions and status for each PR
  const prsWithVotes = await Promise.all(
    prs.map(async (pr) => {
      const reactions = await getPRReactions(owner, repo, pr.number);
      const isMergeable = await getPRMergeStatus(owner, repo, pr.number);
      const checksPassed = await getCommitStatus(owner, repo, pr.head.sha);

      return {
        number: pr.number,
        title: pr.title,
        author: pr.user.login,
        url: pr.html_url,
        votes: reactions.votes,
        upvotes: reactions.upvotes,
        downvotes: reactions.downvotes,
        comments: pr.comments ?? 0,
        createdAt: pr.created_at,
        isMergeable,
        checksPassed,
        hotScore: calculateHotScore(reactions.votes, pr.created_at),
        risingScore: reactions.weeklyVotes,
      };
    }),
  );

  // Sort: mergeable PRs first, then by votes descending, ties by newest
  return prsWithVotes.sort((a, b) => {
    // PRs with conflicts go to the bottom (they can't win anyway)
    if (a.isMergeable !== b.isMergeable) {
      return a.isMergeable ? -1 : 1;
    }
    // Within same mergeability, sort by votes
    if (b.votes !== a.votes) {
      return b.votes - a.votes;
    }
    // Ties broken by newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export interface OrganizedPRs {
  topByVotes: PullRequest[];
  rising: PullRequest[];
  newest: PullRequest[];
  discussed: PullRequest[];
  controversial: PullRequest[];
}

export async function getOrganizedPRs(): Promise<OrganizedPRs> {
  const allPRs = await getOpenPRs();

  // Top 10 by votes (already sorted by getOpenPRs)
  const topByVotes = allPRs.slice(0, 10);

  // Rising: sorted by time-weighted votes (recent votes count more)
  const rising = [...allPRs]
    .sort((a, b) => b.risingScore - a.risingScore)
    .slice(0, 10);

  // Newest: sorted by creation date, limited to 10
  const newest = [...allPRs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Discussed: sorted by comment count, limited to 10
  const discussed = [...allPRs]
    .sort((a, b) => b.comments - a.comments)
    .slice(0, 10);

  // Controversial: PRs with both upvotes and downvotes, sorted by min(up, down)
  const controversial = [...allPRs]
    .filter((pr) => pr.upvotes > 0 && pr.downvotes > 0)
    .sort((a, b) => Math.min(b.upvotes, b.downvotes) - Math.min(a.upvotes, a.downvotes))
    .slice(0, 10);

  return { topByVotes, rising, newest, discussed, controversial };
}

interface ReactionCounts {
  upvotes: number;
  downvotes: number;
  votes: number;
  weeklyVotes: number;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

async function getPRReactions(owner: string, repo: string, prNumber: number): Promise<ReactionCounts> {
  let allReactions: GitHubReaction[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/reactions?per_page=100&page=${page}`,
      {
        headers: getHeaders("application/vnd.github.squirrel-girl-preview+json"),
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      break;
    }

    const reactions: GitHubReaction[] = await response.json();

    if (reactions.length === 0) {
      break;
    }

    allReactions = allReactions.concat(reactions);

    if (reactions.length < 100) {
      break;
    }

    page++;
  }

  const upvotes = allReactions.filter((r) => r.content === "+1").length;
  const downvotes = allReactions.filter((r) => r.content === "-1").length;

  // Count only votes from the last 7 days for Rising
  const now = Date.now();
  const recentReactions = allReactions.filter(
    (r) => now - new Date(r.created_at).getTime() <= SEVEN_DAYS_MS
  );
  const weeklyUpvotes = recentReactions.filter((r) => r.content === "+1").length;
  const weeklyDownvotes = recentReactions.filter((r) => r.content === "-1").length;

  return {
    upvotes,
    downvotes,
    votes: upvotes - downvotes,
    weeklyVotes: weeklyUpvotes - weeklyDownvotes,
  };
}

async function getPRMergeStatus(
  owner: string,
  repo: string,
  prNumber: number
): Promise<boolean> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    {
      headers: getHeaders("application/vnd.github.v3+json"),
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    // Rate limited or other error — assume mergeable rather than showing
    // false conflicts. The next ISR cycle will get the real value.
    return true;
  }

  const data: GitHubPRDetail = await response.json();

  // GitHub computes mergeability lazily — null means "not yet computed", not
  // "has conflicts". Default to true and let the next ISR cycle pick up the
  // real value.
  return data.mergeable ?? true;
}

async function getCommitStatus(
  owner: string,
  repo: string,
  sha: string
): Promise<boolean> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits/${sha}/check-runs`,
    {
      headers: getHeaders("application/vnd.github.v3+json"),
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    // Rate limited or other error — assume checks pass rather than showing
    // false failures. The next ISR cycle will get the real value.
    return true;
  }

  const data: GitHubCheckRunsResponse = await response.json();

  // No check runs means nothing to fail
  if (data.total_count === 0) {
    return true;
  }

  // All check runs must be completed and successful
  return data.check_runs.every(
    (run) => run.status === "completed" && run.conclusion === "success"
  );
}

interface GitHubMergedPR {
  number: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
  merged_at: string | null;
}

export async function getMergedPRs(): Promise<MergedPullRequest[]> {
  const [owner, repo] = GITHUB_REPO.split("/");

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&sort=updated&direction=desc&per_page=20`,
    {
      headers: getHeaders("application/vnd.github.v3+json"),
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Rate limited by GitHub API");
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const prs: GitHubMergedPR[] = await response.json();

  // Filter to only merged PRs (not just closed), exclude repo owner's maintenance PRs
  // Sort by merge time (newest first) since sort=updated may not reflect merge order
  const REPO_OWNER = owner;
  return prs
    .filter((pr) => pr.merged_at !== null && pr.user.login !== REPO_OWNER)
    .sort((a, b) => new Date(b.merged_at!).getTime() - new Date(a.merged_at!).getTime())
    .map((pr) => ({
      number: pr.number,
      title: pr.title,
      author: pr.user.login,
      url: pr.html_url,
      mergedAt: pr.merged_at!,
    }));
}
