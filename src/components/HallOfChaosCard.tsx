import type { MergedPullRequest } from "@/lib/github";

interface HallOfChaosCardProps {
  pr: MergedPullRequest;
}

export function HallOfChaosCard({ pr }: HallOfChaosCardProps) {
  const mergedDate = new Date(pr.mergedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <a
      href={pr.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full p-3 rounded-lg border border-zinc-200 hover:border-emerald-400 transition-colors bg-gradient-to-r from-transparent to-emerald-50/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-sm">#{pr.number}</span>
            <span className="px-1.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">
              MERGED
            </span>
          </div>
          <h3 className="mt-1 font-medium truncate text-sm">{pr.title}</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            by @{pr.author} · {mergedDate}
          </p>
        </div>
        <div className="text-lg">🏆</div>
      </div>
    </a>
  );
}
