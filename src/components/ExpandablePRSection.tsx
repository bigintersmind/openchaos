"use client";

import { useState } from "react";
import type { PullRequest } from "@/lib/github";
import { PRCard } from "./PRCard";

interface ExpandablePRSectionProps {
  title: string;
  prs: PullRequest[];
  allPRs?: PullRequest[];
  showRank?: boolean;
  allowExpand?: boolean;
}

export function ExpandablePRSection({
  title,
  prs,
  allPRs,
  showRank = false,
  allowExpand = false,
}: ExpandablePRSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const expandablePRs = allPRs || prs;
  const hasMore = allowExpand && expandablePRs.length > prs.length;
  const displayedPRs = expanded ? expandablePRs : prs;

  if (prs.length === 0) {
    return (
      <div className="pr-list-section">
        <table width="100%" border={2} cellPadding={8} cellSpacing={0} className="pr-list-section-header">
          <tbody>
            <tr>
              <td className="pr-list-section-header-cell">
                <b>{title}</b>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif", fontSize: "12px" }}>
          <i>No PRs in this category yet.</i>
        </div>
      </div>
    );
  }

  return (
    <div className="pr-list-section">
      <table width="100%" border={2} cellPadding={8} cellSpacing={0} className="pr-list-section-header">
        <tbody>
          <tr>
            <td className="pr-list-section-header-cell">
              <b>{title}</b>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="pr-list-container">
        {displayedPRs.map((pr, index) => (
          <PRCard
            key={pr.number}
            pr={pr}
            rank={showRank ? index + 1 : 0}
          />
        ))}
      </div>
      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "8px", marginBottom: "16px" }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "12px",
              padding: "4px 12px",
              cursor: "pointer",
              border: "2px outset #ffffff",
              backgroundColor: "#c0c0c0",
            }}
          >
            <b>{expanded ? "Show Less" : `Show All (${expandablePRs.length})`}</b>
          </button>
        </div>
      )}
    </div>
  );
}
