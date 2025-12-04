import Link from "next/link"
import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { ProjectStatusBadge } from "@/components/features/project-status-badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getDeadlineMeta } from "@/lib/deadlines"
import type { Database } from "@/types/database.types"

export default function ProjectsPage() {
  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Pipeline</p>
          <h1 className="text-3xl font-semibold">Projets Vitrophy</h1>
          <p className="text-sm text-white/60">
            Filtrez par statut, deadline ou bac pour piloter la production.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            variant="secondary"
            className="rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <Link href="/admin/projects/kanban">Vue Kanban</Link>
          </Button>
          <Button asChild className="rounded-full bg-white text-black hover:bg-white/90">
            <Link href="/admin/projects/new">Nouveau projet</Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsTable />
      </Suspense>
    </div>
  )
}

type ProjectWithClient = Database["public"]["Tables"]["projects"]["Row"] & {
  clients: { name: string | null } | null
}

async function ProjectsTable() {
  const supabase = createClient()
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, reference, title, status, deadline, tray_number, clients:clients(name)")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
        Impossible de charger les projets. Vérifiez Supabase.
      </div>
    )
  }

  if (!projects?.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
        Aucun projet pour l’instant. Créez votre premier projet pour alimenter le dashboard.
      </div>
    )
  }

  const typedProjects = projects as ProjectWithClient[]

  const sortedProjects = [...typedProjects].sort((a, b) => {
    const metaA = getDeadlineMeta(a.deadline)
    const metaB = getDeadlineMeta(b.deadline)
    const urgencyOrder = { past: 0, danger: 1, warning: 2, safe: 3 }
    const diff = urgencyOrder[metaA.urgency] - urgencyOrder[metaB.urgency]
    if (diff !== 0) return diff
    if (metaA.daysLeft === null) return 1
    if (metaB.daysLeft === null) return -1
    return metaA.daysLeft - metaB.daysLeft
  })

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <Table>
        <TableHeader>
          <TableRow className="border-white/5 text-xs uppercase tracking-wide text-white/60">
            <TableHead>Référence</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Bac</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project) => {
            const deadlineMeta = getDeadlineMeta(project.deadline)
            return (
            <TableRow
              key={project.id}
              className="border-white/5 text-white/80 transition hover:bg-white/5"
            >
              <TableCell className="font-medium">
                <div>
                  <p>{project.reference}</p>
                  <p className="text-xs text-white/50">{project.title}</p>
                </div>
              </TableCell>
              <TableCell>{project.clients?.name || "–"}</TableCell>
              <TableCell>
                <ProjectStatusBadge status={project.status} />
              </TableCell>
              <TableCell>
                <Badge className={cn("rounded-full px-3 py-1 text-xs", project.tray_number ? "bg-white/10" : "bg-white/5 text-white/40")}>
                  {project.tray_number ? `Bac ${project.tray_number}` : "Non assigné"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p>
                    {project.deadline
                      ? format(new Date(project.deadline), "dd MMM yyyy", { locale: fr })
                      : "—"}
                  </p>
                  <Badge className={cn("rounded-full text-[11px]", deadlineMeta.className)}>
                    {deadlineMeta.label}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  asChild
                  variant="secondary"
                  className="rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  <Link href={`/admin/projects/${project.id}`}>Ouvrir</Link>
                </Button>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  )
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6">
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="h-12 rounded-2xl bg-white/10" />
      ))}
    </div>
  )
}

