import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ProjectStatus } from "@/types/database.types"

const STATUS_STYLES: Record<ProjectStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-zinc-800 text-zinc-100 border border-zinc-700",
  },
  prepress: {
    label: "BAT",
    className: "bg-sky-500/15 text-sky-200 border border-sky-500/40",
  },
  production: {
    label: "Production",
    className: "bg-amber-400/15 text-amber-100 border border-amber-400/40",
  },
  finished: {
    label: "Terminé",
    className: "bg-emerald-500/15 text-emerald-100 border border-emerald-500/40",
  },
  delivered: {
    label: "Livré",
    className: "bg-blue-500/15 text-blue-100 border border-blue-500/40",
  },
  archived: {
    label: "Archivé",
    className: "bg-zinc-700/30 text-zinc-200 border border-zinc-600",
  },
}

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  className?: string
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  const style = STATUS_STYLES[status]

  return (
    <Badge className={cn("rounded-full px-3 py-1 text-xs", style.className, className)}>
      {style.label}
    </Badge>
  )
}

