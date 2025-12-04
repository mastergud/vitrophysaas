"use client"

import { useFormState } from "react-dom"
import { updateItemStep } from "@/app/(workshop)/workshop/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"
import { Database } from "@/types/database.types"

type StepKey = "step_cut" | "step_engrave" | "step_assemble" | "step_quality_control" | "step_pack"

const stepsConfig: { key: StepKey; label: string }[] = [
  { key: "step_cut", label: "Découpe" },
  { key: "step_engrave", label: "Gravure" },
  { key: "step_assemble", label: "Assemblage" },
  { key: "step_quality_control", label: "Qualité" },
  { key: "step_pack", label: "Emballage" },
]

type ProjectItem = Database["public"]["Tables"]["project_items"]["Row"]
type ProjectInfo = Pick<Database["public"]["Tables"]["projects"]["Row"], "reference" | "tray_number">

interface WorkshopTaskCardProps {
  item: ProjectItem
  project: ProjectInfo
}

const initialState = { error: null as string | null }

export function WorkshopTaskCard({ item, project }: WorkshopTaskCardProps) {
  return (
    <Card className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-2xl shadow-black/20 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">
            {project.tray_number ? `Bac ${project.tray_number}` : "Bac ?"}
          </p>
          <p className="text-lg font-semibold">{item.name}</p>
          <p className="text-sm text-white/60">
            {project.reference} • {item.quantity} pcs • {item.type.toUpperCase()}
          </p>
        </div>
        <Badge className="rounded-full bg-white/10 px-3 py-1">
          {item.complexity === "EXPERT" ? "Expert" : "Normal"}
        </Badge>
      </div>

      <div className="grid gap-2">
        {stepsConfig.map((step) => (
          <StepToggle
            key={step.key}
            step={step}
            itemId={item.id}
            completed={Boolean(item[step.key])}
          />
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          className="flex-1 rounded-2xl bg-emerald-500/20 text-white hover:bg-emerald-500/30"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Terminer toutes les étapes
        </Button>
        <Button className="rounded-2xl bg-rose-500/10 text-rose-100 hover:bg-rose-500/20">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Incident
        </Button>
      </div>
    </Card>
  )
}

function StepToggle({
  step,
  itemId,
  completed,
}: {
  step: { key: StepKey; label: string }
  itemId: string
  completed: boolean
}) {
  const [state, formAction] = useFormState(updateItemStep, initialState)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <form action={formAction}>
      <input type="hidden" name="item_id" value={itemId} />
      <input type="hidden" name="step" value={step.key} />
      <input type="hidden" name="next_value" value={(!completed).toString()} />
      <button
        type="submit"
        className={cn(
          "flex w-full items-center justify-between rounded-2xl border px-4 py-2 text-sm transition",
          completed
            ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-100"
            : "border-white/10 bg-black/20 text-white/70 hover:bg-white/10"
        )}
      >
        <span>{step.label}</span>
        <span>{completed ? "✔" : "..."}</span>
      </button>
    </form>
  )
}

