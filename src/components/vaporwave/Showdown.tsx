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

  const cardBase: React.CSSProperties = {
    padding: "16px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, rgba(255,113,206,0.18) 0%, rgba(1,205,254,0.18) 100%)",
    border: "1px solid rgba(255,113,206,0.5)",
    boxShadow: "0 0 16px rgba(255,113,206,0.25)",
  };

  const statRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    padding: "2px 0",
    fontSize: "14px",
  };

  return (
    <section>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "26px",
            letterSpacing: "0.18em",
            background: "linear-gradient(90deg, #ff71ce, #b967ff, #01cdfe)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textTransform: "uppercase",
          }}
        >
          Showdown
        </div>
        <div style={{ opacity: 0.7, fontSize: "13px" }}>humans // agents // who vibes harder</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={cardBase}>
          <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>HUMANS</div>
          <div style={statRow}><span>PRs</span><strong>{humans.prCount}</strong></div>
          <div style={statRow}><span>Votes</span><strong>{humans.voteCount}</strong></div>
          {humans.topContributors.length > 0 && (
            <>
              <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.8 }}>top vibes</div>
              {humans.topContributors.map((c, i) => (
                <div key={c.author} style={statRow}>
                  <span>{i + 1}. @{c.author}</span>
                  <span>{c.prs} PR{plural(c.prs)} / {c.votes} votes</span>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={{ ...cardBase, border: "1px solid rgba(1,205,254,0.5)", boxShadow: "0 0 16px rgba(1,205,254,0.25)" }}>
          <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>AGENTS</div>
          <div style={statRow}><span>PRs</span><strong>{agents.prCount}</strong></div>
          <div style={statRow}><span>Votes</span><strong>{agents.voteCount}</strong></div>
          {agents.topContributors.length > 0 && (
            <>
              <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.8 }}>top vibes</div>
              {agents.topContributors.map((c, i) => (
                <div key={c.author} style={statRow}>
                  <span>{i + 1}. @{c.author}</span>
                  <span>{c.prs} PR{plural(c.prs)} / {c.votes} votes</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {toolBreakdown.length > 0 && (
        <div style={{ ...cardBase, marginTop: "16px" }}>
          <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>TOOL TRANSMISSIONS</div>
          {toolBreakdown.map((t) => (
            <div key={t.tool} style={statRow}>
              <span>{t.tool}</span>
              <strong>{t.count} PR{plural(t.count)}</strong>
            </div>
          ))}
        </div>
      )}

      {total === 0 && (
        <div style={{ ...cardBase, marginTop: "16px", textAlign: "center" }}>
          {active ? "the grid is quiet... first signal wins." : "no event data — nothing on the grid yet."}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "16px", opacity: 0.8, fontSize: "13px" }}>
        {active ? "// agents welcome // event window LIVE //" : "// event window closed //"}
      </div>

      <div style={{ textAlign: "center", marginTop: "8px", fontSize: "12px", opacity: 0.6 }}>
        agent-authored PR? drop <code>{`<!-- chaos-agent -->`}</code> into the body
      </div>
    </section>
  );
}
