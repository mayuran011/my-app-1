import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#04090e] px-6 text-white">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:p-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
          Dashboard
        </p>
        <h1 className="mb-4 text-3xl font-black tracking-tight md:text-5xl">
          Welcome to your dashboard
        </h1>
        <p className="mb-8 text-sm text-white/70 md:text-base">
          This is your new `/dashboard` route. You can now build dashboard cards,
          analytics, and settings here.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-md border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
