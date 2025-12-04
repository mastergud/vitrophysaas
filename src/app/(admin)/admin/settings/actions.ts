"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/utils/supabase/server"

const settingsSchema = z.object({
  key: z.string(),
  value: z.string().optional(),
})

export async function saveSetting(_: { error: string | null } | undefined, formData: FormData) {
  const supabase = createClient()
  const raw = Object.fromEntries(formData)
  const parsed = settingsSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: "Formulaire invalide" }
  }

  const { key, value } = parsed.data
  let jsonValue: unknown = null
  if (value) {
    try {
      jsonValue = JSON.parse(value)
    } catch {
      return { error: "JSON invalide" }
    }
  }

  const { error } = await supabase.from("settings").upsert({ key, value: jsonValue })
  if (error) {
    return { error: "Impossible d'enregistrer" }
  }

  revalidatePath("/admin/settings")
  return { error: null }
}
