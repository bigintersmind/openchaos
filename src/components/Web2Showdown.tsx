"use client";

import type { LeaderboardData, LeaderboardSide } from "@/lib/leaderboard";
import { isEventActive } from "@/lib/agent-event";

function plural(n: number, suffix = "s") {
  return n === 1 ? "" : suffix;
}

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: "Tahoma, Verdana, Arial, sans-serif",
  fontSize: "13px",
};
const thStyle: React.CSSProperties = {
  background: "linear-gradient(180deg, #0058e6 0%, #0040a0 100%)",
  color: "#fff",
  fontWeight: 700,
  padding: "6px 8px",
  border: "1px solid #003070",
  textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  padding: "4px 8px",
  border: "1px solid #c0c0c0",
  background: "#fff",
};
const tdRightStyle: React.CSSProperties = { ...tdStyle, textAlign: "right" };

function PanelTable({ label, side }: { label: string; side: LeaderboardSide }) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr><th colSpan={2} style={thStyle}>{label}</th></tr>
      </thead>
      <tbody>
        <tr><td style={tdStyle}>PRs</td><td style={tdRightStyle}><strong>{side.prCount}</strong></td></tr>
        <tr><td style={tdStyle}>Votes</td><td style={tdRightStyle}><strong>{side.voteCount}</strong></td></tr>
        {side.topContributors.map((c, i) => (
          <tr key={c.author}>
            <td style={tdStyle}>{i + 1}. @{c.author}</td>
            <td style={tdRightStyle}>{c.prs} PR{plural(c.prs)}, {c.votes} votes</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Web2Showdown({ leaderboard }: { leaderboard: LeaderboardData }) {
  const active = isEventActive();
  const { humans, agents, toolBreakdown } = leaderboard;
  const total = humans.prCount + agents.prCount;

  return (
    <div className="web2-section-body" style={{ padding: "16px" }}>
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2 style={{ fontFamily: "Tahoma, Verdana, sans-serif", fontSize: "20px", margin: "0 0 4px" }}>
          ★ Humans vs Agents — Showdown ★
        </h2>
        <div style={{ fontSize: "12px", color: "#666" }}>
          {active ? "Event is LIVE — Agents Welcome 2-week window" : "Event window has ended"}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <PanelTable label="HUMANS" side={humans} />
        <PanelTable label="AGENTS" side={agents} />
      </div>

      {toolBreakdown.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <table style={tableStyle}>
            <thead>
              <tr><th colSpan={2} style={thStyle}>AGENT TOOLS</th></tr>
            </thead>
            <tbody>
              {toolBreakdown.map((t) => (
                <tr key={t.tool}>
                  <td style={tdStyle}>{t.tool}</td>
                  <td style={tdRightStyle}><strong>{t.count} PR{plural(t.count)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total === 0 && (
        <div style={{ marginTop: "16px", textAlign: "center", padding: "12px", border: "1px dashed #999", background: "#fafafa", color: "#666" }}>
          {active ? "No entries yet — be the first to file a PR this fortnight!" : "No event data."}
        </div>
      )}

      <div style={{ marginTop: "12px", textAlign: "center", fontSize: "11px", color: "#666" }}>
        Tip: declare an agent-authored PR with <code>{`<!-- chaos-agent -->`}</code>{" "}
        (or <code>{`<!-- chaos-agent: tool-name -->`}</code>) in the body.
      </div>
    </div>
  );
}
