import { cn } from "@/lib/cn";

const StatusBadge = ({ online }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
      online
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
        : "bg-base-200/70 text-base-500 dark:bg-base-200/50 dark:text-base-500",
    )}
  >
    <span className={cn("h-1.5 w-1.5 rounded-full", online ? "animate-pulse-soft bg-emerald-500" : "bg-base-400")} />
    {online ? "Online" : "Offline"}
  </span>
);

export default StatusBadge;

