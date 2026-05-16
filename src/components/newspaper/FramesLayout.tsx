"use client";

import { useMemo } from "react";
import type { PullRequest } from "@/lib/github";
import type { LeaderboardData } from "@/lib/leaderboard";
import { FramesLayout as SharedFramesLayout } from "@/components/shared/FramesLayout";
import { ExpandablePRSection } from "@/components/shared/ExpandablePRSection";
import { VoteStatusProvider } from "@/contexts/VoteStatusContext";
import { PRCard } from "./PRCard";
import { Showdown } from "./Showdown";

const NEWSPAPER_TABS = [
  { id: "votes" as const, label: "FRONT PAGE" },
  { id: "rising" as const, label: "BREAKING NEWS" },
  { id: "controversial" as const, label: "LETTERS TO THE EDITOR" },
  { id: "discussed" as const, label: "TOWN HALL" },
  { id: "new" as const, label: "LATE EDITION" },
  { id: "showdown" as const, label: "SHOWDOWN" },
];

function NewspaperExpandable({ prs, allowDistinguish = false, scoreLabel }: { prs: PullRequest[]; allowDistinguish?: boolean; scoreLabel?: string }) {
  return (
    <ExpandablePRSection
      prs={prs}
      PRCardComponent={PRCard}
      allowDistinguish={allowDistinguish}
      scoreLabel={scoreLabel}
      emptyMessage={<div className="np-section-empty">No stories filed in this section.</div>}
      expandLabel={(count) => `Continue Reading (${count} articles)`}
      collapseLabel="Return to Front Page"
      buttonClassName="np-expand-btn"
    />
  );
}

interface Props {
  topByVotes: PullRequest[];
  rising: PullRequest[];
  newest: PullRequest[];
  discussed: PullRequest[];
  controversial: PullRequest[];
  leaderboard: LeaderboardData;
}

export function FramesLayout(props: Props) {
  const prNumbers = useMemo(
    () => [...new Set([...props.topByVotes, ...props.rising, ...props.newest, ...props.discussed, ...props.controversial].map(pr => pr.number))],
    [props.topByVotes, props.rising, props.newest, props.discussed, props.controversial],
  );

  const { leaderboard, ...sharedProps } = props;

  return (
    <VoteStatusProvider prNumbers={prNumbers}>
      <SharedFramesLayout
        {...sharedProps}
        tabs={NEWSPAPER_TABS}
        ExpandableSection={NewspaperExpandable}
        customSections={{ showdown: <Showdown leaderboard={leaderboard} /> }}
        renderBanner={(pr) => <PRCard pr={pr} isBanner />}
        separator={<hr className="np-rule-double" />}
        renderTabs={(tabs, activeSection, setActiveSection) => (
          <nav className="np-section-nav">
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`np-section-tab ${activeSection === item.id ? "np-section-tab-active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      />
    </VoteStatusProvider>
  );
}
