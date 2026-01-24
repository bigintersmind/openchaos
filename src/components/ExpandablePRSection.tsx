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
  const initialCount = prs.length;
  const [displayCount, setDisplayCount] = useState(initialCount);
  const expandablePRs = allPRs || prs;
  const totalCount = expandablePRs.length;
  const hasMore = allowExpand && totalCount > initialCount;
  const displayedPRs = expandablePRs.slice(0, displayCount);
  const canShowMore = displayCount < totalCount;
  const canShowLess = displayCount > initialCount;

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
        <div style={{ textAlign: "center", marginTop: "8px", marginBottom: "16px", display: "flex", gap: "8px", justifyContent: "center" }}>
          {canShowMore && (
            <>
              <button
                onClick={() => setDisplayCount(Math.min(displayCount + 10, totalCount))}
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "12px",
                  padding: "4px 12px",
                  cursor: "pointer",
                  border: "2px outset #ffffff",
                  backgroundColor: "#c0c0c0",
                }}
              >
                <b>Show More (10)</b>
              </button>
              <button
                onClick={() => setDisplayCount(totalCount)}
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "12px",
                  padding: "4px 12px",
                  cursor: "pointer",
                  border: "2px outset #ffffff",
                  backgroundColor: "#c0c0c0",
                }}
              >
                <b>Show All ({totalCount})</b>
              </button>
            </>
          )}
          {canShowLess && (
            <button
              onClick={() => setDisplayCount(initialCount)}
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "12px",
                padding: "4px 12px",
                cursor: "pointer",
                border: "2px outset #ffffff",
                backgroundColor: "#c0c0c0",
              }}
            >
              <b>Show Less</b>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
