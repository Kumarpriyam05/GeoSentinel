import { cn } from "@/lib/cn";

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse rounded-xl bg-base-300/45 dark:bg-base-300/25", className)} />
);

export default Skeleton;

