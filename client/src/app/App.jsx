import { Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Skeleton from "@/components/common/Skeleton";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.28, ease: "easeOut" },
};

const PageTransition = ({ children }) => <motion.div {...pageMotion}>{children}</motion.div>;

const FullScreenFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-base-50 p-8 dark:bg-base-50">
    <div className="w-full max-w-lg space-y-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullScreenFallback />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <FullScreenFallback />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <FullScreenFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === "admin" ? children : <Navigate to="/dashboard" replace />;
};

const App = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<FullScreenFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <PageTransition>
                  <RegisterPage />
                </PageTransition>
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <PageTransition>
                  <AdminPage />
                </PageTransition>
              </AdminRoute>
            }
          />
          <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default App;

