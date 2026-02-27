import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "@/components/common/ThemeToggle";
import Button from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/cn";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const PublicHeader = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 border-b border-base-200/40 bg-base-50/70 backdrop-blur-xl dark:bg-base-50/50"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link className="text-lg font-bold tracking-tight text-base-800" to="/">
          Geo<span className="text-accent-500">Sentinel</span>
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-base-600 transition hover:text-accent-600",
                location.pathname === link.to ? "bg-base-100/70 text-accent-600 dark:bg-base-100/20" : "",
              )}
              to={link.to}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Link to={isAuthenticated ? "/dashboard" : "/login"}>
            <Button>{isAuthenticated ? "Open Dashboard" : "Sign In"}</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default PublicHeader;

