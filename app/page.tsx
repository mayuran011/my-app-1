import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#03080c] font-sans text-white">
      {/* Layered gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(14,165,233,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(6,78,59,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        {/* Logo */}
        <p className="mb-12 text-3xl font-extrabold tracking-tight text-white/95 md:text-4xl">
          NIA APP
        </p>

        {/* Eyebrow */}
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-cyan-300/70 md:text-xs">
          Create Amazing
        </p>

        {/* Hero headline */}
        <h1 className="mb-5 max-w-4xl bg-gradient-to-r from-[#f472b6] via-[#fb7185] to-[#f97316] bg-clip-text text-4xl font-extrabold leading-[1.1] tracking-tight text-transparent md:text-7xl lg:text-8xl">
          Web Apps
        </h1>

        {/* Subheadline with badge */}
        <p className="mb-3 flex flex-wrap items-center justify-center gap-2 text-base font-bold tracking-wide text-white/95 md:text-xl lg:text-2xl">
          <span>Chat and Create with AI in 40+ Languages</span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/90 text-xs shadow-lg shadow-emerald-500/25">
            ✓
          </span>
        </p>

        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
          Built to make you extraordinarily productive, NIA APP is the best way to
          code with AI.
        </p>

        {/* CTA chip */}
        <div className="mb-10 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-6 py-3.5 shadow-[0_0_40px_-8px_rgba(34,211,238,0.35)] backdrop-blur-sm">
          <span className="text-sm font-semibold text-cyan-100 md:text-base">
            ✨ Click to See Free AI Options: 100 Chats/Day
          </span>
        </div>

        {/* Primary actions */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">
          <button
            type="button"
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-8 py-4 text-sm font-bold tracking-wide text-[#022c22] shadow-[0_12px_32px_-8px_rgba(34,211,238,0.45)] transition hover:shadow-[0_16px_40px_-8px_rgba(34,211,238,0.5)] active:scale-[0.98] sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              GET STARTED
              <span className="transition group-hover:translate-y-0.5">↓</span>
            </span>
          </button>
          <Link
            href="/dashboard"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:border-white/20 active:scale-[0.98] sm:w-auto"
          >
            Dashboard
          </Link>
        </div>

        {/* Platform badge */}
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50">
          Fully compatible with Windows
        </div>
      </section>
    </main>
  );
}
