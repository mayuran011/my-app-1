export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04090e] px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(11,113,130,0.35),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(7,59,76,0.35),transparent_55%)]" />

      <section className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <p className="mb-14 text-4xl font-black tracking-tight md:text-5xl">elmony.</p>

        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.45em] text-white/60 md:text-xs">
          Create Amazing
        </p>

        <h1 className="mb-6 bg-gradient-to-r from-[#ff4b70] via-[#ff4d66] to-[#ff5a44] bg-clip-text text-5xl font-black uppercase leading-none tracking-wide text-transparent md:text-8xl">
          Mobile Apps
        </h1>

        <p className="mb-4 flex flex-wrap items-center justify-center gap-2 text-lg font-black uppercase tracking-wide md:text-[2.05rem]">
          <span>Chat and Create with AI in 40+ Languages</span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-emerald-500 text-sm">
            ✅
          </span>
        </p>

        <p className="mb-8 max-w-3xl text-sm text-white/70 md:text-lg">
          Built to make you extraordinarily productive, Elmony is the best way to
          code with AI.
        </p>

        <button
          type="button"
          className="mb-8 rounded-full border border-cyan-300/25 bg-cyan-700/20 px-5 py-3 text-xs font-semibold text-cyan-100 shadow-[0_8px_20px_rgba(10,92,120,0.35)] transition hover:bg-cyan-600/30 md:text-sm"
        >
          ⚡ Click to See Free AI Options: 100 Chats/Day
        </button>

        <div className="mb-5 flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            className="rounded-md bg-gradient-to-r from-[#45edf0] to-[#69f9ff] px-10 py-3 text-sm font-bold tracking-wide text-[#002127] shadow-[0_10px_24px_rgba(63,231,241,0.32)] transition hover:brightness-110"
          >
            GET STARTED ↓
          </button>
          <button
            type="button"
            className="rounded-md border border-white/10 bg-white/5 px-10 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
          >
            Dashboard
          </button>
        </div>

        <div className="rounded-sm border border-white/20 bg-black/20 px-4 py-1 text-[11px] text-white/60">
          Windows
        </div>
      </section>
    </main>
  );
}
