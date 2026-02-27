import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const Button = ({
  children,
  className,
  variant = "primary",
  type = "button",
  loading = false,
  disabled = false,
  ...props
}) => {
  const classes =
    variant === "secondary"
      ? "btn-secondary"
      : variant === "ghost"
        ? "rounded-xl px-4 py-2.5 text-sm font-semibold text-base-600 transition hover:bg-base-100/80 hover:text-base-800 dark:hover:bg-base-100/20"
        : "btn-primary";

  return (
    <motion.button
      whileHover={{ y: -1.5 }}
      whileTap={{ y: 0 }}
      className={cn(classes, disabled || loading ? "cursor-not-allowed opacity-65" : "", className)}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? "Processing..." : children}
    </motion.button>
  );
};

export default Button;

