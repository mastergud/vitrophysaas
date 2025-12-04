import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { ProjectStatusBadge } from "@/components/features/project-status-badge"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getDeadlineMeta } from "@/lib/deadlines"
import { QuickItemsTable } from "@/components/features/quick-items-table"
import { BatPanel } from "@/components/features/bat-panel"
import type { Database } from "@/types/database.types"

interface ProjectPageProps {
  params: { id: string }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProjectContent id={params.id} />
    </Suspense>
  )
}

async function ProjectContent({ id }: { id: string }) {
  const supabase = createClient()
  const { data: project } = await supabase
    .from("projects")
    .select(
      `
      *,
      clients:clients(name, contact_person),
      project_items(*),
      bat_files(*)
    `
    )
    .eq("id", id)
    .single()

  if (!project) {
    return notFound()
  }

  type ProjectWithItems = typeof project & {
    project_items: Database["public"]["Tables"]["project_items"]["Row"][] | null
  }
  const typedProject = project as ProjectWithItems

  const formattedDeadline = project.deadline
    ? format(new Date(project.deadline), "EEEE dd MMMM yyyy", { locale: fr })
    : null
  const deadlineMeta = getDeadlineMeta(project.deadline)

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Projet</p>
          <h1 className="text-4xl font-semibold">{project.reference}</h1>
          <p className="text-white/60">{project.title}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ProjectStatusBadge status={project.status} />
          <Badge className="rounded-full bg-white/10 px-3 py-1">
            {project.clients?.name ?? "Client TBC"}
          </Badge>
          <Badge className={cn("rounded-full px-3 py-1", project.tray_number ? "bg-emerald-500/20 text-emerald-100" : "bg-white/10 text-white/50")}>
            {project.tray_number ? `Bac ${project.tray_number}` : "Bac à assigner"}
          </Badge>
          <Badge className={cn("rounded-full px-3 py-1 text-xs", deadlineMeta.className)}>
            {deadlineMeta.label}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-white/80">Deadline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {formattedDeadline ?? "Non définie"}
            </p>
            <p className="text-sm text-white/60">Planifiée par Jérôme</p>
          </CardContent>
        </GlassCard>
        <GlassCard className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white/80">BAT</CardTitle>
          </CardHeader>
          <CardContent>
            <BatPanel
              projectId={project.id}
              entries={project.bat_files ?? []}
              currentStatus={project.bat_status}
            />
          </CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-white/80">Client</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {project.clients?.name ?? "Client à renseigner"}
            </p>
            <p className="text-sm text-white/60">
              {project.clients?.contact_person ?? "Contact à renseigner"}
            </p>
          </CardContent>
        </GlassCard>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">Items</p>
            <h2 className="text-2xl font-semibold">Feuille de fabrication</h2>
            <p className="text-sm text-white/60">
              Items MAKE / BUY avec étapes de production.
            </p>
          </div>
          <Link
            href={`/admin/projects/${project.id}/items/new`}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Ajouter un item
          </Link>
        </div>

        <div className="space-y-3">
          {typedProject.project_items?.length ? (
            typedProject.project_items.map((item: Database["public"]["Tables"]["project_items"]["Row"]) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-black/30 backdrop-blur"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-sm text-white/60">
                      {item.quantity} pièces • {item.type.toUpperCase()}
                    </p>
                  </div>
                  <Badge className="rounded-full bg-white/10 px-3 py-1">
                    Complexité: {item.complexity}
                  </Badge>
                </div>
                <Separator className="my-4 bg-white/10" />
                <div className="grid gap-3 text-sm text-white/70 md:grid-cols-2">
                  <p>Specs: {JSON.stringify(item.specs)}</p>
                  <p>Étapes : découpe {item.step_cut ? "✅" : "—"} • gravure {item.step_engrave ? "✅" : "—"} • assemblage {item.step_assemble ? "✅" : "—"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-white/60">
              Aucun item pour l’instant.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Saisie rapide</p>
          <h2 className="text-2xl font-semibold">Ajouter plusieurs lignes</h2>
          <p className="text-sm text-white/60">
            Interface type tableur pour les gros tournois (50 lignes en quelques minutes).
          </p>
        </div>
        <QuickItemsTable projectId={project.id} />
      </section>
    </div>
  )
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Card
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl shadow-black/20 backdrop-blur",
        className
      )}
    >
      {children}
    </Card>
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 rounded-3xl bg-white/10" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-3xl bg-white/10" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-3xl bg-white/10" />
    </div>
  )
}

