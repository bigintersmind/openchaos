import { getMergedPRs } from "@/lib/github";
import { HallOfChaosCard } from "./HallOfChaosCard";

export async function HallOfChaos() {
  let prs;
  let error = null;

  try {
    prs = await getMergedPRs();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to fetch merged PRs";
  }

  if (error) {
    return (
      <div className="w-full max-w-xl text-center py-4">
        <p className="text-zinc-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!prs || prs.length === 0) {
    return (
      <div className="w-full max-w-xl text-center py-4">
        <p className="text-zinc-400 text-sm">No merged PRs yet.</p>
        <p className="mt-1 text-xs text-zinc-500">
          The first winner will be immortalized here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-2">
      {prs.map((pr) => (
        <HallOfChaosCard key={pr.number} pr={pr} />
      ))}
    </div>
  );
}
