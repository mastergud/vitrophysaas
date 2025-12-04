"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

type ActionState = {
  error: string | null
} | undefined

export async function startTimer(_prevState: ActionState, _formData: FormData) {
  void _prevState
  void _formData
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Session expirée" }
  }

  const { data: openEntry } = await supabase
    .from("timesheets")
    .select("id")
    .is("end_time", null)
    .eq("user_id", user.id)
    .maybeSingle()

  if (openEntry) {
    return { error: "Une session est déjà en cours" }
  }

  const { error } = await supabase.from("timesheets").insert({
    user_id: user.id,
    start_time: new Date().toISOString(),
  })

  if (error) {
    return { error: "Impossible de démarrer" }
  }

  revalidatePath("/workshop/time")
  return { success: true }
}

export async function stopTimer(_prevState: ActionState, formData: FormData) {
  void _prevState
  const supabase = createClient()
  const entryId = formData.get("entry_id") as string

  if (!entryId) {
    return { error: "Session inconnue" }
  }

  const { error } = await supabase
    .from("timesheets")
    .update({ end_time: new Date().toISOString() })
    .eq("id", entryId)

  if (error) {
    return { error: "Impossible d&apos;arrêter" }
  }

  revalidatePath("/workshop/time")
  return { success: true }
}

