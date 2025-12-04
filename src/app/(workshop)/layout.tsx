import { ClipboardList, QrCode, Clock3, type LucideIcon } from "lucide-react"

export default function WorkshopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white">
      <header className="px-5 pb-4 pt-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-inner shadow-black/30 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">
            Atelier
          </p>
          <p className="text-2xl font-semibold">Tâches du jour</p>
          <p className="text-sm text-white/60">
            Concentré sur la prochaine action à réaliser.
          </p>
        </div>
      </header>
      <main className="flex-1 px-4 pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

const navItems: { label: string; icon: LucideIcon }[] = [
  { label: "Projets", icon: ClipboardList },
  { label: "Scan", icon: QrCode },
  { label: "Temps", icon: Clock3 },
]

function BottomNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-black/60 backdrop-blur-md">
      <nav className="mx-auto flex max-w-md items-center justify-between px-6 py-4 text-xs uppercase tracking-wide text-white/70">
        {navItems.map((item) => (
          <button
            key={item.label}
            className="flex flex-col items-center gap-1 rounded-2xl px-3 py-2 hover:bg-white/10"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

