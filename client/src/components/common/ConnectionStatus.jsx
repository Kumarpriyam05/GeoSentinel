import { useSocket } from "@/context/SocketContext";
import { cn } from "@/lib/cn";

const ConnectionStatus = ({ className }) => {
  const { connected } = useSocket();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
        connected
          ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
          : "border-amber-400/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        className,
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          connected ? "animate-pulse-soft bg-emerald-500" : "animate-pulse-soft bg-amber-500",
        )}
      />
      {connected ? "Live Connected" : "Reconnecting"}
    </div>
  );
};

export default ConnectionStatus;

