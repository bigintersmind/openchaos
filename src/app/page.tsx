import { Suspense } from "react";
import { Countdown } from "@/components/Countdown";
import { PRList } from "@/components/PRList";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Web2Layout } from "@/components/Web2Layout";
import { HallOfChaos } from "@/components/HallOfChaos";
import { Web2LoadingSpinner } from "@/components/Web2LoadingSpinner";

export default function Home() {
  return (
    <Web2Layout>
      <Countdown />
      <div className="absolute top-8 right-4">
        <ThemeToggle />
      </div>
      <div className="page-container">
        {/* Open PRs Section */}
        <div className="web2-section">
          <div className="web2-section-header">
            <span className="web2-section-title">Open PRs — Vote to Merge</span>
          </div>
          <div className="web2-section-body">
            <div className="page-content-flex">
              <Suspense fallback={<Web2LoadingSpinner text="Loading PRs..." />}>
                <PRList />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Hall of Chaos Section */}
        <div className="web2-section">
          <div className="web2-section-header">
            <span className="web2-section-title">Hall of Chaos — Past Winners</span>
          </div>
          <div className="web2-section-body">
            <div className="page-content-flex">
              <Suspense fallback={<Web2LoadingSpinner text="Loading history..." />}>
                <HallOfChaos />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </Web2Layout>
  );
}
