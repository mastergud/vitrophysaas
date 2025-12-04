import { NewProjectForm } from "@/components/features/new-project-form"

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl text-white">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">Nouveau</p>
        <h1 className="text-4xl font-semibold">Créer un projet</h1>
        <p className="text-white/60">
          Ajoutez la référence, le client et le bac pour lancer la production.
        </p>
      </div>

      <NewProjectForm />
    </div>
  )
}

