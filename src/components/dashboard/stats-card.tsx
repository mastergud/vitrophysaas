import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const accents = {
  zinc: "from-zinc-900/70 via-zinc-900/40 to-zinc-900/20 border-zinc-700 text-white",
  emerald: "from-emerald-500/30 via-emerald-500/20 to-emerald-400/10 border-emerald-400/40 text-white",
  amber: "from-amber-500/30 via-amber-500/10 to-yellow-400/10 border-amber-300/40 text-white",
  rose: "from-rose-500/30 via-rose-500/10 to-pink-400/5 border-rose-300/40 text-white",
}

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  accent?: keyof typeof accents
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  accent = "zinc",
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border p-5 shadow-2xl shadow-black/20 backdrop-blur",
        "before:pointer-events-none before:absolute before:-right-6 before:-top-6 before:h-24 before:w-24 before:rounded-full before:bg-white/10",
        accents[accent],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-wide text-white/70">{title}</p>
          <p className="text-3xl font-semibold">{value}</p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/10 p-3 text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {description && (
        <p className="mt-4 text-sm text-white/70">{description}</p>
      )}
    </div>
  )
}

