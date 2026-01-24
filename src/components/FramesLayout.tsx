"use client";

import { useState, useEffect, useMemo } from "react";
import type { PullRequest } from "@/lib/github";
import { ExpandablePRSection } from "./ExpandablePRSection";

type Section = "top" | "rising" | "new" | "discussed" | "controversial";

interface FramesLayoutProps {
  topByVotes: PullRequest[];
  rising: PullRequest[];
  newest: PullRequest[];
  discussed: PullRequest[];
  controversial: PullRequest[];
  allPRs: PullRequest[];
}

export function FramesLayout({ topByVotes, rising, newest, discussed, controversial, allPRs }: FramesLayoutProps) {
  // Pre-sort allPRs for each view
  const allByRising = useMemo(
    () => [...allPRs].sort((a, b) => b.risingScore - a.risingScore),
    [allPRs]
  );
  const allByNewest = useMemo(
    () => [...allPRs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [allPRs]
  );
  const allByDiscussed = useMemo(
    () => [...allPRs].sort((a, b) => b.comments - a.comments),
    [allPRs]
  );
  const allByControversial = useMemo(
    () => [...allPRs]
      .filter((pr) => pr.upvotes > 0 && pr.downvotes > 0)
      .sort((a, b) => Math.min(b.upvotes, b.downvotes) - Math.min(a.upvotes, a.downvotes)),
    [allPRs]
  );
  const [activeSection, setActiveSection] = useState<Section>("top");

  const validSections: Section[] = ["top", "rising", "new", "discussed", "controversial"];

  // Sync with URL hash on mount and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as Section;
      if (validSections.includes(hash)) {
        setActiveSection(hash);
      }
    };

    handleHashChange(); // Initial check
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavClick = (section: Section) => {
    setActiveSection(section);
    window.location.hash = section;
  };

  const navItems = [
    { id: "top" as Section, label: "TOP BY VOTES", icon: "⭐" },
    { id: "rising" as Section, label: "HOT THIS WEEK", icon: "🔥" },
    { id: "controversial" as Section, label: "CONTROVERSIAL", icon: "🌶️" },
    { id: "discussed" as Section, label: "DISCUSSED", icon: "💬" },
    { id: "new" as Section, label: "NEWEST", icon: "🆕" },
  ];

  return (
    <div className="frames-container">
      {/* Left Frame - Navigation */}
      <div className="frames-nav-frame">
        <div className="frames-nav-header">
          <span>📁 Navigation</span>
        </div>
        <div className="frames-nav-content">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`frames-nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="frames-nav-icon">{item.icon}</span>
              <span className="frames-nav-label">{item.label}</span>
            </div>
          ))}
        </div>
        {/* Resize Grip (decorative) */}
        <div className="frames-resize-grip" />
      </div>

      {/* Frame Border/Divider */}
      <div className="frames-divider" />

      {/* Main Frame - Content */}
      <div className="frames-content-frame">
        {activeSection === "top" && (
          <ExpandablePRSection
            title="⭐ TOP BY VOTES ⭐"
            prs={topByVotes}
            allPRs={allPRs}
            showRank
            allowExpand
          />
        )}
        {activeSection === "rising" && (
          <ExpandablePRSection
            title="🔥 HOT THIS WEEK 🔥"
            prs={rising.map((pr) => ({ ...pr, votes: pr.risingScore }))}
            allPRs={allByRising.map((pr) => ({ ...pr, votes: pr.risingScore }))}
            allowExpand
          />
        )}
        {activeSection === "new" && (
          <ExpandablePRSection
            title="🆕 NEWEST 🆕"
            prs={newest}
            allPRs={allByNewest}
            allowExpand
          />
        )}
        {activeSection === "discussed" && (
          <ExpandablePRSection
            title="💬 DISCUSSED 💬"
            prs={discussed}
            allPRs={allByDiscussed}
            allowExpand
          />
        )}
        {activeSection === "controversial" && (
          <ExpandablePRSection
            title="🌶️ CONTROVERSIAL 🌶️"
            prs={controversial}
            allPRs={allByControversial}
            allowExpand
          />
        )}
      </div>
    </div>
  );
}
