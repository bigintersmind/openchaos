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

  const panelStyle: React.CSSProperties = {
    border: "1px solid #2a2218",
    padding: "16px",
    background: "#f4ede4",
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
    fontWeight: 700,
    fontSize: "20px",
    margin: "0 0 12px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "2px double #2a2218",
    paddingBottom: "4px",
  };

  const statRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "15px",
    padding: "2px 0",
  };

  return (
    <section style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#2a2218" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          The Great Showdown
        </div>
        <div style={{ fontStyle: "italic", fontSize: "13px", color: "#8a7b6b" }}>
          A Special Report on Humans vs. Agents
        </div>
        <hr style={{ borderTop: "2px double #2a2218", margin: "8px auto", width: "60%" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={panelStyle}>
          <h3 style={headingStyle}>Humans</h3>
          <div style={statRowStyle}><span>Pull Requests</span><strong>{humans.prCount}</strong></div>
          <div style={statRowStyle}><span>Net Votes</span><strong>{humans.voteCount}</strong></div>
          {humans.topContributors.length > 0 && (
            <>
              <div style={{ marginTop: "12px", fontStyle: "italic", fontSize: "13px", color: "#3d3225" }}>Notable Bylines</div>
              {humans.topContributors.map((c, i) => (
                <div key={c.author} style={statRowStyle}>
                  <span>{i + 1}. @{c.author}</span>
                  <span>{c.prs} PR{plural(c.prs)}, {c.votes} votes</span>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={panelStyle}>
          <h3 style={headingStyle}>Agents</h3>
          <div style={statRowStyle}><span>Pull Requests</span><strong>{agents.prCount}</strong></div>
          <div style={statRowStyle}><span>Net Votes</span><strong>{agents.voteCount}</strong></div>
          {agents.topContributors.length > 0 && (
            <>
              <div style={{ marginTop: "12px", fontStyle: "italic", fontSize: "13px", color: "#3d3225" }}>Notable Bylines</div>
              {agents.topContributors.map((c, i) => (
                <div key={c.author} style={statRowStyle}>
                  <span>{i + 1}. @{c.author}</span>
                  <span>{c.prs} PR{plural(c.prs)}, {c.votes} votes</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {toolBreakdown.length > 0 && (
        <div style={{ ...panelStyle, marginTop: "16px" }}>
          <h3 style={headingStyle}>Tool Census</h3>
          {toolBreakdown.map((t) => (
            <div key={t.tool} style={statRowStyle}>
              <span>{t.tool}</span>
              <strong>{t.count} PR{plural(t.count)}</strong>
            </div>
          ))}
        </div>
      )}

      {total === 0 && (
        <div style={{ ...panelStyle, marginTop: "16px", textAlign: "center", fontStyle: "italic" }}>
          {active ? "The newsroom awaits its first byline of the event." : "No event has yet been printed."}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "16px", fontStyle: "italic", color: "#8a7b6b" }}>
        {active ? "Special Edition - Agents Welcome (running this fortnight)" : "Edition closed - presses cooling"}
      </div>

      <div style={{ textAlign: "center", marginTop: "8px", fontSize: "12px", color: "#8a7b6b" }}>
        Reporters: declare agent-assisted bylines with{" "}
        <code>{`<!-- chaos-agent -->`}</code> in your dispatch.
      </div>
    </section>
  );
}
