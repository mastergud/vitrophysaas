import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { Badge } from "@/components/ui/badge"
import { getDeadlineMeta } from "@/lib/deadlines"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

export async function RecentProjects() {
  const supabase = createClient()
  const { data } = await supabase
    .from("projects")
    .select("id, reference, title, status, deadline, updated_at, tray_number")
    .order("updated_at", { ascending: false })
    .limit(5)

  if (!data?.length) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-white/60">
        Aucun projet récent
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {data.map((project) => {
        const deadlineMeta = getDeadlineMeta(project.deadline)
        return (
          <Link
            key={project.id}
            href={`/admin/projects/${project.id}`}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/80 transition hover:border-white/30"
          >
            <div>
              <p className="font-semibold">{project.reference}</p>
              <p className="text-xs text-white/60">{project.title}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                <Badge className={deadlineMeta.className}>{deadlineMeta.label}</Badge>
                <Badge className="rounded-full bg-white/10 text-white/80">
                  {project.tray_number ? `Bac ${project.tray_number}` : "Bac ?"}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-white/60">
              {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true, locale: fr })}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
