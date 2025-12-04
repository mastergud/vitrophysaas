import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { NewProjectItemForm } from "@/components/features/new-project-item-form"

interface NewItemPageProps {
  params: { id: string }
}

export default async function NewItemPage({ params }: NewItemPageProps) {
  const supabase = createClient()
  const { data: project } = await supabase
    .from("projects")
    .select("id, reference")
    .eq("id", params.id)
    .single()

  if (!project) {
    return notFound()
  }

  return (
    <div className="mx-auto max-w-2xl text-white">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">Item</p>
        <h1 className="text-3xl font-semibold">Ajouter un item</h1>
        <p className="text-white/60">
          Lier au projet {project.reference}
        </p>
      </div>
      <NewProjectItemForm projectId={project.id} projectReference={project.reference} />
    </div>
  )
}

