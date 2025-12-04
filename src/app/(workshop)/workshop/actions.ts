"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/utils/supabase/server"

type ActionState = {
  error: string | null
} | undefined

const stepSchema = z.object({
  item_id: z.string().uuid(),
  step: z.enum(["step_cut", "step_engrave", "step_assemble", "step_quality_control", "step_pack"]),
  next_value: z.string(),
})

export async function updateItemStep(_: ActionState, formData: FormData) {
  const supabase = createClient()
  const raw = Object.fromEntries(formData)
  const parsed = stepSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: "Formulaire invalide" }
  }

  const { item_id, step, next_value } = parsed.data
  const value = next_value === "true"

  const { error } = await supabase
    .from("project_items")
    .update({ [step]: value })
    .eq("id", item_id)

  if (error) {
    return { error: "Impossible de mettre à jour l'étape" }
  }

  revalidatePath("/workshop")
  return { success: true }
}

