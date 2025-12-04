import { Sidebar } from "@/components/features/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,_#0f0f10,_#050506)] text-white">
      <div className="hidden w-64 md:block">
        <Sidebar />
      </div>
      <div className="flex-1 bg-gradient-to-br from-zinc-100/5 via-zinc-950 to-black/90">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-black/30 px-10 py-6 backdrop-blur">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">Aujourd&apos;hui</p>
            <p className="text-2xl font-semibold text-white">Vue d&apos;ensemble</p>
          </div>
          <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300">
            Session sécurisée • Admin
          </div>
        </div>
        <div className="p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

