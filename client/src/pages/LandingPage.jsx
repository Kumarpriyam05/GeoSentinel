import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "@/components/common/Button";
import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

const featureCards = [
  {
    title: "Realtime Precision",
    description: "Track multiple assets live with smooth marker transitions and low-latency updates.",
  },
  {
    title: "Secure By Design",
    description: "JWT auth, protected routes, device keys, validation, and rate limits ready for production.",
  },
  {
    title: "Enterprise Dashboard",
    description: "Minimal, premium interface with analytics, activity streams, and responsive layout.",
  },
];

const LandingPage = () => (
  <div className="min-h-screen">
    <PublicHeader />

    <section className="mx-auto mt-5 w-full max-w-7xl px-5 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-hero px-6 py-14 text-base-50 shadow-soft lg:px-10 lg:py-20">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <motion.div
          animate={{ x: [-30, 30, -30], y: [0, 14, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-16 top-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 bottom-8 h-52 w-52 rounded-full bg-blue-300/20 blur-3xl"
        />

        <div className="relative z-10 max-w-3xl">
          <p className="mb-3 inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
            Real-Time Intelligence Platform
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            GeoSentinel brings mission-critical tracking clarity to every moving asset.
          </h1>
          <p className="mt-5 max-w-2xl text-sm text-base-200 sm:text-base">
            Build live geospatial awareness with a modern platform engineered for secure data streams,
            high-frequency telemetry, and clean decision-ready visuals.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/register">
              <Button className="!bg-white !text-slate-900 hover:!bg-slate-100 dark:!bg-cyan-600 dark:!text-white dark:hover:!bg-cyan-700">
                Get Started
              </Button>
            </Link>
            <a href="#features">
              <Button
                variant="secondary"
                className="!border-white/40 !bg-white/5 !text-white hover:!bg-white/15 dark:!border-slate-400/70 dark:!bg-white/65 dark:!text-slate-800 dark:hover:!bg-white/80"
              >
                Explore Features
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section id="features" className="mx-auto mt-8 w-full max-w-7xl px-5 pb-14 lg:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {featureCards.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="card-base"
          >
            <h3 className="text-lg font-semibold text-base-800">{feature.title}</h3>
            <p className="mt-2 text-sm text-base-500">{feature.description}</p>
          </motion.article>
        ))}
      </div>
    </section>

    <PublicFooter />
  </div>
);

export default LandingPage;
