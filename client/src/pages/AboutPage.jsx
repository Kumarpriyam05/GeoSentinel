import PublicFooter from "@/components/layout/PublicFooter";
import PublicHeader from "@/components/layout/PublicHeader";

const AboutPage = () => (
  <div className="min-h-screen">
    <PublicHeader />
    <section className="mx-auto w-full max-w-4xl px-5 py-12 lg:px-8">
      <div className="card-base">
        <h1 className="text-3xl font-semibold text-base-800">About GeoSentinel</h1>
        <p className="mt-4 text-sm leading-7 text-base-500">
          GeoSentinel is built for organizations that need confident, real-time visibility across mobile assets.
          The platform combines performant telemetry ingestion, reliable WebSocket streaming, and a refined UI to
          help operations teams respond faster.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-base-200/70 bg-base-100/60 p-4 dark:bg-base-100/20">
            <h2 className="font-semibold text-base-700">Mission</h2>
            <p className="mt-2 text-sm text-base-500">
              Deliver enterprise tracking systems that are elegant to operate and dependable at scale.
            </p>
          </article>
          <article className="rounded-2xl border border-base-200/70 bg-base-100/60 p-4 dark:bg-base-100/20">
            <h2 className="font-semibold text-base-700">Architecture</h2>
            <p className="mt-2 text-sm text-base-500">
              Modular Node.js backend, Socket.IO real-time streams, and a React dashboard optimized for clarity.
            </p>
          </article>
        </div>
      </div>
    </section>
    <PublicFooter />
  </div>
);

export default AboutPage;

