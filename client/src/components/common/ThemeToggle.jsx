import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/cn";

const modes = ["system", "light", "dark"];

const ThemeToggle = ({ className }) => {
  const { themeMode, setTheme } = useTheme();

  return (
    <div className={cn("inline-flex rounded-xl border border-base-300/70 bg-base-100/80 p-1", className)}>
      {modes.map((mode) => (
        <button
          key={mode}
          type="button"
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition",
            themeMode === mode
              ? "bg-accent-500 text-white shadow-glow"
              : "text-base-600 hover:bg-base-100 dark:hover:bg-base-100/30",
          )}
          onClick={() => setTheme(mode)}
        >
          {mode}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;

