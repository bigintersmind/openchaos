import type { PullRequest, MergedPullRequest } from "./github";
import type { EventWindow } from "./agent-event";

export interface LeaderboardContributor {
  author: string;
  prs: number;
  votes: number;
}

export interface LeaderboardSide {
  prCount: number;
  voteCount: number;
  topContributors: LeaderboardContributor[];
}

export interface ToolBreakdownEntry {
  tool: string;
  count: number;
}

export interface LeaderboardData {
  humans: LeaderboardSide;
  agents: LeaderboardSide;
  toolBreakdown: ToolBreakdownEntry[];
}

interface BuildArgs {
  openPRs: PullRequest[];
  merged: MergedPullRequest[];
  window: EventWindow;
}

const UNSPECIFIED_TOOL = "(unspecified)";
const TOP_CONTRIBUTOR_COUNT = 3;

/**
 * Build the Humans vs Agents leaderboard from organized PRs.
 *
 * Open PRs are filtered to the window by createdAt; merged PRs by mergedAt.
 * Vote counts use only open-PR current vote totals — merged PR vote data
 * isn't tracked. PR counts include both.
 */
export function buildLeaderboard({ openPRs, merged, window }: BuildArgs): LeaderboardData {
  const startMs = window.start.getTime();
  const endMs = window.end.getTime();
  const inWindow = (iso: string) => {
    const t = new Date(iso).getTime();
    return !Number.isNaN(t) && t >= startMs && t < endMs;
  };

  const eventOpen = openPRs.filter((pr) => inWindow(pr.createdAt));
  const eventMerged = merged.filter((pr) => inWindow(pr.mergedAt));

  function side(matchesSide: (pr: { isAgent: boolean }) => boolean): LeaderboardSide {
    const openMatches = eventOpen.filter(matchesSide);
    const mergedMatches = eventMerged.filter(matchesSide);

    const tally = new Map<string, LeaderboardContributor>();
    function bump(author: string, deltaPrs: number, deltaVotes: number) {
      const entry = tally.get(author) ?? { author, prs: 0, votes: 0 };
      entry.prs += deltaPrs;
      entry.votes += deltaVotes;
      tally.set(author, entry);
    }
    for (const pr of openMatches) bump(pr.author, 1, pr.votes);
    for (const pr of mergedMatches) bump(pr.author, 1, 0);

    const topContributors = [...tally.values()]
      .sort(
        (a, b) =>
          b.votes - a.votes ||
          b.prs - a.prs ||
          a.author.localeCompare(b.author),
      )
      .slice(0, TOP_CONTRIBUTOR_COUNT);

    return {
      prCount: openMatches.length + mergedMatches.length,
      voteCount: openMatches.reduce((sum, pr) => sum + pr.votes, 0),
      topContributors,
    };
  }

  const toolTally = new Map<string, number>();
  for (const pr of [...eventOpen, ...eventMerged]) {
    if (!pr.isAgent) continue;
    const key = pr.agentTool ?? UNSPECIFIED_TOOL;
    toolTally.set(key, (toolTally.get(key) ?? 0) + 1);
  }
  const toolBreakdown: ToolBreakdownEntry[] = [...toolTally.entries()]
    .map(([tool, count]) => ({ tool, count }))
    .sort((a, b) => b.count - a.count || a.tool.localeCompare(b.tool));

  return {
    humans: side((pr) => !pr.isAgent),
    agents: side((pr) => pr.isAgent),
    toolBreakdown,
  };
}
