export interface PullRequest {
  number: number;
  title: string;
  author: string;
  url: string;
  votes: number;
  createdAt: string;
}

interface GitHubPR {
  number: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
  created_at: string;
}

interface GitHubReaction {
  content: string;
}

const GITHUB_REPO = "skridlevsky/openchaos";

export async function getOpenPRs(): Promise<PullRequest[]> {
  const [owner, repo] = GITHUB_REPO.split("/");

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=open`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    }
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Rate limited by GitHub API");
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const prs: GitHubPR[] = await response.json();

  // Fetch reactions for each PR
  const prsWithVotes = await Promise.all(
    prs.map(async (pr) => {
      const votes = await getPRVotes(owner, repo, pr.number);
      return {
        number: pr.number,
        title: pr.title,
        author: pr.user.login,
        url: pr.html_url,
        votes,
        createdAt: pr.created_at,
      };
    })
  );

  // Sort by votes descending
  return prsWithVotes.sort((a, b) => b.votes - a.votes);
}

async function getPRVotes(
  owner: string,
  repo: string,
  prNumber: number
): Promise<number> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/reactions`,
    {
      headers: {
        Accept: "application/vnd.github.squirrel-girl-preview+json",
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    return 0;
  }

  const reactions: GitHubReaction[] = await response.json();
  return reactions.filter((r) => r.content === "+1").length;
}
