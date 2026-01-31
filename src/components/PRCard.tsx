import type { PullRequest } from "@/lib/github";
import { TimeAgo } from "./TimeAgo";

interface PRCardProps {
  pr: PullRequest;
  rank: number;
}

function chooseURL(url: string) {
  // 10% chance to Rickroll
  if (Math.random() <= 0.10) {
    // Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)
    return "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  } else {
    return url;
  }
}

export function PRCard({ pr, rank }: PRCardProps) {
  const url = chooseURL(pr.url);

  const isSixtySeven = pr.votes === 67 || pr.votes === -67;
  const isLeading = rank === 1;

  const hasConflicts = !pr.isMergeable;
  const checksOnly = pr.isMergeable && !pr.checksPassed;

  const statusTitle = pr.isMergeable && pr.checksPassed
    ? "All checks passed & no conflicts"
    : hasConflicts && !pr.checksPassed
      ? "Merge conflicts & checks failed — will not merge"
      : hasConflicts
        ? "Has merge conflicts — will not merge"
        : "Checks pending — will still merge";

  return (
    <div
      className={`pr-card ${isLeading ? 'pr-card-leading' : 'pr-card-normal'}
        ${isSixtySeven ? "sixseven-shake" : ""}
        ${isLeading ? 'pr-card-featured' : ''}
      `}
    >
      <div className="pr-card-inner">
        {/* Fixed-width number column */}
        <div className={`pr-card-number-section ${isLeading ? 'pr-card-number-leading' : 'pr-card-number-normal'}`}>
          <span className="pr-card-number-text">
            #{pr.number}
          </span>
          {/* Leading indicator: crown icon with tooltip instead of text badge */}
          {isLeading && (
            <div className="pr-card-leading-icon" title="Currently leading — will be merged next!">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
              </svg>
            </div>
          )}
        </div>

        {/* Flexible content column */}
        <div className="pr-card-content-section">
          <div className="pr-card-title">
            {pr.title}
          </div>
          <div className="pr-card-meta">
            by{" "}
            <a
              href={`https://github.com/${pr.author}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pr-card-author-link"
            >
              @{pr.author}
            </a>
            {" · "}
            <TimeAgo isoDate={pr.createdAt} />
          </div>
          <a
            href={pr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pr-card-link"
          >
            View &amp; Vote on GitHub →
          </a>
        </div>

        {/* Fixed-width votes column */}
        <div className={`pr-card-votes-section ${isLeading ? 'pr-card-votes-leading' : 'pr-card-votes-normal'}`}>
          <span className="pr-card-votes-emoji">
            👍
          </span>
          <span className="pr-card-votes-count">
            {pr.votes}
          </span>
          {/* Status: icon-only with tooltip */}
          <div
            className="pr-card-status-icon"
            title={statusTitle}
          >
            {pr.isMergeable && pr.checksPassed ? (
              /* Green checkmark — all clear */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#28a745"
                width="16"
                height="16"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : hasConflicts ? (
              /* Red X — merge conflicts, will not merge */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#e74c3c"
                width="16"
                height="16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              /* Amber warning — checks failed but will still merge */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#e6a817"
                width="16"
                height="16"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
