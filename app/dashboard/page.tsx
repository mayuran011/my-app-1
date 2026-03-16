import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03080c] font-sans text-white">
      {/* Same gradient treatment as home */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(14,165,233,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(6,78,59,0.08),transparent_45%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80">
            Dashboard
          </p>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            Welcome to your dashboard
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-white/65 md:text-base">
            This is your new dashboard. You can build dashboard cards, analytics,
            and settings here.
          </p>
          <Link
            href="/"
            className="inline-flex rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:border-white/20"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
