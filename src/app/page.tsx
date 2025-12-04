import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 font-[family-name:var(--font-inter)]">
      <h1 className="text-4xl font-bold">Vitrophy OS</h1>
      <div className="flex gap-4">
        <Link 
          href="/login"
          className="rounded-full bg-foreground text-background px-6 py-3 hover:opacity-90 transition-opacity"
        >
          Login
        </Link>
        <Link 
          href="/admin/dashboard"
          className="rounded-full border border-black/[.1] dark:border-white/[.1] px-6 py-3 hover:bg-black/[.05] dark:hover:bg-white/[.05] transition-colors"
        >
          Admin (Dev)
        </Link>
        <Link 
          href="/workshop"
          className="rounded-full border border-black/[.1] dark:border-white/[.1] px-6 py-3 hover:bg-black/[.05] dark:hover:bg-white/[.05] transition-colors"
        >
          Workshop (Dev)
        </Link>
      </div>
    </div>
  );
}
