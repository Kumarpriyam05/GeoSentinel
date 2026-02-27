import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import ConnectionStatus from "@/components/common/ConnectionStatus";
import ThemeToggle from "@/components/common/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const AppLayout = ({ title, sidebar, children }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-transparent p-3 sm:p-4">
      <div className="mx-auto flex max-w-[1600px] gap-4">
        {sidebar ? (
          <motion.aside
            animate={{ width: collapsed ? 92 : 320 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hidden h-[calc(100vh-2rem)] shrink-0 overflow-hidden rounded-2xl border border-base-200/60 bg-base-50/70 backdrop-blur-xl md:block"
          >
            {sidebar({ collapsed, setCollapsed })}
          </motion.aside>
        ) : null}

        <div className="min-w-0 flex-1">
          <header className="mb-4 flex flex-col gap-3 rounded-2xl border border-base-200/60 bg-base-50/70 p-4 shadow-soft backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-base-800">{title}</h1>
              <p className="text-sm text-base-500">
                Welcome back, <span className="font-medium text-base-700">{user?.name}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1 rounded-xl border border-base-200/70 bg-base-100/60 p-1 dark:bg-base-100/20">
                {publicLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      location.pathname === link.to
                        ? "bg-accent-500/15 text-accent-600"
                        : "text-base-500 hover:text-base-700 dark:hover:text-base-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <ConnectionStatus />
              <ThemeToggle />
              {user?.role === "admin" ? (
                <Button variant="secondary" onClick={() => navigate("/admin")}>
                  Admin Panel
                </Button>
              ) : null}
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
