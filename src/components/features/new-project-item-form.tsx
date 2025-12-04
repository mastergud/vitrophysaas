"use client"

import { useFormState } from "react-dom"
import { useEffect } from "react"
import { createProjectItem } from "@/app/(admin)/admin/projects/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const initialState = { error: null as string | null }

interface NewProjectItemFormProps {
  projectId: string
  projectReference: string
}

export function NewProjectItemForm({ projectId, projectReference }: NewProjectItemFormProps) {
  const [state, formAction] = useFormState(createProjectItem, initialState)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <Card className="rounded-3xl border border-white/10 bg-white/5 text-white shadow-2xl shadow-black/20 backdrop-blur">
      <CardHeader>
        <CardTitle>Ajouter un item à {projectReference}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="project_id" value={projectId} />
          <div className="grid gap-5 md:grid-cols-2">
            <FormField id="name" label="Nom de l&apos;item" placeholder="Trophée verre 10mm" required />
            <FormField id="quantity" label="Quantité" type="number" min={1} defaultValue={1} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <SelectField
              id="type"
              label="Type"
              options={[
                { label: "Trophée Verre", value: "glass_trophy" },
                { label: "Médaille", value: "medal" },
                { label: "Coupe", value: "cup" },
                { label: "Plexi", value: "plexiglass" },
                { label: "Autre", value: "other" },
              ]}
            />
            <SelectField
              id="complexity"
              label="Complexité"
              options={[
                { label: "Normal", value: "NORMAL" },
                { label: "Expert", value: "EXPERT" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specs">Specs JSON</Label>
            <Textarea
              id="specs"
              name="specs"
              placeholder='{"type":"glass_trophy","thickness":"10mm"}'
              className="min-h-[100px] border-white/10 bg-white/5 text-white placeholder:text-white/30"
            />
            <p className="text-xs text-white/50">
              Format JSON pour stocker les infos techniques (diamètre, couleur ruban, etc.).
            </p>
          </div>

          <Button type="submit" className="w-full rounded-full bg-white text-black hover:bg-white/90">
            Ajouter l&apos;item
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
  min,
  defaultValue,
}: {
  id: string
  label: string
  placeholder?: string
  required?: boolean
  type?: string
  min?: number
  defaultValue?: string | number
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
        min={min}
        defaultValue={defaultValue}
        className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
      />
    </div>
  )
}

function SelectField({
  id,
  label,
  options,
}: {
  id: string
  label: string
  options: { label: string; value: string }[]
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={id}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

