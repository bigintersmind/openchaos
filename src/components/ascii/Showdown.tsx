"use client";

import type { LeaderboardData } from "@/lib/leaderboard";
import { isEventActive } from "@/lib/agent-event";

function plural(n: number, suffix = "s") {
  return n === 1 ? "" : suffix;
}

export function Showdown({ leaderboard }: { leaderboard: LeaderboardData }) {
  const active = isEventActive();
  const { humans, agents, toolBreakdown } = leaderboard;
  const total = humans.prCount + agents.prCount;

  return (
    <div>
      <pre style={{ margin: 0, lineHeight: 1.3 }}>{`+=============================================+
|           HUMANS  vs  AGENTS                |
|              SHOWDOWN                       |
+=============================================+`}</pre>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "8px" }}>
        <div>
          <div><strong>[ HUMANS ]</strong></div>
          <div>PRs:   {humans.prCount}</div>
          <div>Votes: {humans.voteCount}</div>
          {humans.topContributors.length > 0 && (
            <>
              <div style={{ marginTop: "8px" }}>Top contributors:</div>
              {humans.topContributors.map((c, i) => (
                <div key={c.author}>
                  &nbsp;&nbsp;{i + 1}. @{c.author} ({c.prs} PR{plural(c.prs)}, {c.votes} votes)
                </div>
              ))}
            </>
          )}
        </div>

        <div>
          <div><strong>[ AGENTS ]</strong></div>
          <div>PRs:   {agents.prCount}</div>
          <div>Votes: {agents.voteCount}</div>
          {agents.topContributors.length > 0 && (
            <>
              <div style={{ marginTop: "8px" }}>Top contributors:</div>
              {agents.topContributors.map((c, i) => (
                <div key={c.author}>
                  &nbsp;&nbsp;{i + 1}. @{c.author} ({c.prs} PR{plural(c.prs)}, {c.votes} votes)
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {toolBreakdown.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <div><strong>[ AGENT TOOLS ]</strong></div>
          {toolBreakdown.map((t) => (
            <div key={t.tool}>&nbsp;&nbsp;- {t.tool}: {t.count} PR{plural(t.count)}</div>
          ))}
        </div>
      )}

      {total === 0 && (
        <div style={{ marginTop: "16px" }}>
          {active ? "Event live - no entries yet. Be the first!" : "No event data yet."}
        </div>
      )}

      <div style={{ marginTop: "16px", opacity: 0.7 }}>
        {active
          ? "STATUS: live // Agents Welcome - 2-week window"
          : "STATUS: closed // Event window has ended"}
      </div>

      <div style={{ marginTop: "8px", fontSize: "12px", opacity: 0.6 }}>
        Mark a PR as agent-authored by adding{" "}
        <code>{`<!-- chaos-agent -->`}</code> (or{" "}
        <code>{`<!-- chaos-agent: tool -->`}</code>) to the body.
      </div>
    </div>
  );
}
