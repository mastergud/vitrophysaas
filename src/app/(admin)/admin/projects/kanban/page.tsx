import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { ProjectsKanbanBoard } from "@/components/features/projects-kanban-board"
import { Button } from "@/components/ui/button"

export default async function ProjectsKanbanPage() {
  const supabase = createClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("id, reference, title, status, deadline, tray_number")
    .order("created_at", { ascending: true })

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Production</p>
          <h1 className="text-4xl font-semibold">Kanban statuts</h1>
          <p className="text-white/60">
            Glissez les cartes entre Draft → Prépress → Production → Livré.
          </p>
        </div>
        <Button asChild variant="secondary" className="rounded-full border border-white/20 bg-white/10 text-white">
          <Link href="/admin/projects">Retour liste</Link>
        </Button>
      </div>

      <ProjectsKanbanBoard projects={projects ?? []} />
    </div>
  )
}

