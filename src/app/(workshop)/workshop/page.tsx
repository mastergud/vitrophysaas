import { createClient } from "@/utils/supabase/server"
import { WorkshopTaskCard } from "@/components/features/workshop-task-card"

export default async function WorkshopPage() {
  const supabase = createClient()
  const { data: projects } = await supabase
    .from("projects")
    .select("id, reference, tray_number, project_items(*)")
    .eq("status", "production")

  const tasks =
    projects?.flatMap((project) =>
      (project.project_items || []).map((item) => ({
        project,
        item,
      }))
    ) ?? []

  if (!tasks.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-white/60">
        Aucun item à produire. Dès qu&apos;un projet passe en production, il apparaît ici.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {tasks.map(({ project, item }) => (
        <WorkshopTaskCard key={item.id} item={item} project={project} />
      ))}
    </div>
  )
}
