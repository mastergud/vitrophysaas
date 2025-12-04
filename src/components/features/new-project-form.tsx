"use client"

import { useFormState } from "react-dom"
import { useEffect } from "react"
import { createProject } from "@/app/(admin)/admin/projects/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const initialState = { error: null as string | null }

export function NewProjectForm() {
  const [state, formAction] = useFormState(createProject, initialState)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <Card className="rounded-3xl border border-white/10 bg-white/5 text-white shadow-2xl shadow-black/20 backdrop-blur">
      <CardHeader>
        <CardTitle>Informations principales</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField id="reference" label="Référence" placeholder="VIT-25-012" required />
            <FormField id="title" label="Titre" placeholder="Tournoi FC Progrès" required />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField id="client_name" label="Client" placeholder="FC Progrès" required />
            <FormField id="deadline" label="Deadline" type="date" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField id="tray_number" label="Bac" placeholder="Bac 12" />
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                name="status"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                defaultValue="draft"
              >
                <option value="draft">Draft</option>
                <option value="prepress">Prepress</option>
                <option value="production">Production</option>
                <option value="finished">Finished</option>
                <option value="delivered">Delivered</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes internes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Brief client, contraintes, BAC..."
              className="min-h-[120px] border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          <Button type="submit" className="w-full rounded-full bg-white text-black hover:bg-white/90">
            Créer le projet
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function FormField({
  id,
  label,
  placeholder,
  required,
  type = "text",
}: {
  id: string
  label: string
  placeholder?: string
  required?: boolean
  type?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        placeholder={placeholder}
        required={required}
        type={type}
        className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
      />
    </div>
  )
}

