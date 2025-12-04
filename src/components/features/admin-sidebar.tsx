"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, KanbanSquare, Settings2 } from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Projets", href: "/admin/projects", icon: KanbanSquare },
  { label: "Paramètres", href: "/admin/settings", icon: Settings2 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col border-r border-white/5 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-zinc-900/90 px-4 py-6 text-white">
      <div className="mb-8 space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Vitrophy OS
        </p>
        <p className="text-2xl font-semibold">Control Tower</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-all",
                "hover:bg-white/5 hover:text-white",
                isActive
                  ? "bg-white/10 text-white shadow-lg shadow-black/30 backdrop-blur"
                  : "text-zinc-400"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-zinc-400 backdrop-blur">
        <p className="font-medium text-white">Atelier Status</p>
        <p className="mt-1">6 projets en cours • 2 urgences</p>
      </div>
    </div>
  )
}

