"use client";

import { type ComponentType, type ReactNode } from "react";
import type { PullRequest } from "@/lib/github";
import { useSectionNav, type Section } from "@/hooks/useSectionNav";

interface TabItem {
  id: Section;
  label: string;
  icon?: string;
}

interface FramesLayoutProps {
  topByVotes: PullRequest[];
  rising: PullRequest[];
  newest: PullRequest[];
  discussed: PullRequest[];
  controversial: PullRequest[];
  tabs: TabItem[];
  ExpandableSection: ComponentType<{ prs: PullRequest[]; allowDistinguish?: boolean; sectionLabel?: string; scoreLabel?: string }>;
  renderBanner?: (pr: PullRequest) => ReactNode;
  separator?: ReactNode;
  renderTabs: (tabs: TabItem[], activeSection: Section, setActiveSection: (s: Section) => void) => ReactNode;
  /** Optional per-section overrides. When the active section has an entry here, that node renders instead of ExpandableSection (used by the Showdown tab). */
  customSections?: Partial<Record<Section, ReactNode>>;
  className?: string;
}

export function FramesLayout({
  topByVotes,
  rising,
  newest,
  discussed,
  controversial,
  tabs,
  ExpandableSection,
  renderBanner,
  separator,
  renderTabs,
  customSections,
  className,
}: FramesLayoutProps) {
  const { activeSection, setActiveSection } = useSectionNav();

  const customNode = customSections?.[activeSection];
  const skipFirst = !!renderBanner && activeSection === "votes" && topByVotes.length > 0;
  const leadingPR = skipFirst ? topByVotes[0] : null;

  function getSectionPRs(): PullRequest[] {
    switch (activeSection) {
      case "votes":
        return skipFirst ? topByVotes.slice(1) : topByVotes;
      case "rising":
        // Display hot score in place of net votes for the "rising" sort
        return rising.map((pr) => ({ ...pr, votes: pr.hotScore }));
      case "new":
        return newest;
      case "discussed":
        return discussed;
      case "controversial":
        return controversial;
      case "showdown":
        return [];
    }
  }

  return (
    <div className={className}>
      {renderTabs(tabs, activeSection, setActiveSection)}
      {!customNode && leadingPR && renderBanner && renderBanner(leadingPR)}
      {!customNode && leadingPR && separator}
      {customNode ?? (
        <ExpandableSection
          prs={getSectionPRs()}
          allowDistinguish={activeSection === "votes"}
          sectionLabel={tabs.find((t) => t.id === activeSection)?.label}
          scoreLabel={activeSection === "rising" ? "Hot Score" : "Net Score"}
        />
      )}
    </div>
  );
}
