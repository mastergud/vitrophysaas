"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createClient } from "@/utils/supabase/server"

type ActionState = {
  error: string | null
  success?: boolean
} | undefined

const createProjectSchema = z.object({
  reference: z.string().min(3),
  title: z.string().min(3),
  client_name: z.string().min(2),
  deadline: z.string().optional(),
  tray_number: z.string().optional(),
  status: z.enum(["draft", "prepress", "production", "finished", "delivered", "archived"]).optional(),
  notes: z.string().optional(),
})

export async function createProject(_: ActionState, formData: FormData) {
  const supabase = createClient()
  const raw = Object.fromEntries(formData)
  const parsed = createProjectSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: "Formulaire invalide" }
  }

  const { reference, title, client_name, tray_number, deadline, status = "draft", notes } =
    parsed.data

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Session expirée" }
  }

  // Ensure client exists
  let clientId: string | null = null
  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .ilike("name", client_name)
    .maybeSingle()

  if (existingClient) {
    clientId = existingClient.id
  } else {
    const { data: newClient, error: clientError } = await supabase
      .from("clients")
      .insert({ name: client_name })
      .select("id")
      .single()

    if (clientError || !newClient) {
      return { error: "Impossible de créer le client" }
    }

    clientId = newClient.id
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      reference,
      title,
      client_id: clientId,
      tray_number: tray_number || null,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      status,
      notes,
      created_by: user.id,
    })
    .select("id")
    .single()

  if (error || !project) {
    return { error: "Impossible de créer le projet" }
  }

  revalidatePath("/admin/projects")
  redirect(`/admin/projects/${project.id}`)
}

const createItemSchema = z.object({
  project_id: z.string().uuid(),
  name: z.string().min(2),
  quantity: z.coerce.number().min(1).default(1),
  type: z.enum(["glass_trophy", "medal", "cup", "plexiglass", "other"]),
  complexity: z.enum(["NORMAL", "EXPERT"]).default("NORMAL"),
  specs: z.string().optional(),
})

export async function createProjectItem(_: ActionState, formData: FormData) {
  const supabase = createClient()
  const raw = Object.fromEntries(formData)
  const parsed = createItemSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: "Formulaire item invalide" }
  }

  const { project_id, name, quantity, type, complexity, specs } = parsed.data

  const specsJson = specs ? safeJson(specs) : {}

  const { error } = await supabase.from("project_items").insert({
    project_id,
    name,
    quantity,
    type,
    complexity,
    specs: specsJson,
  })

  if (error) {
    return { error: "Impossible d&apos;ajouter l&apos;item" }
  }

  revalidatePath(`/admin/projects/${project_id}`)
  redirect(`/admin/projects/${project_id}`)
}

function safeJson(input: string | undefined) {
  if (!input) return {}
  try {
    return JSON.parse(input)
  } catch {
    return {}
  }
}

const updateStatusSchema = z.object({
  project_id: z.string().uuid(),
  status: z.enum(["draft", "prepress", "production", "finished", "delivered", "archived"]),
})

export async function updateProjectStatus(_: ActionState, formData: FormData) {
  const supabase = createClient()
  const raw = Object.fromEntries(formData)
  const parsed = updateStatusSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: "Statut invalide" }
  }

  const { project_id, status } = parsed.data

  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("bat_status, tray_number")
    .eq("id", project_id)
    .single()

  if (fetchError || !project) {
    return { error: "Projet introuvable" }
  }

  if (status === "production" && project.bat_status !== "validated") {
    return { error: "BAT non validé, impossible de passer en production" }
  }

  if (status === "production" && !project.tray_number) {
    return { error: "Assignez un Bac avant la production" }
  }

  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", project_id)

  if (error) {
    return { error: "Impossible de mettre à jour" }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/admin/projects/kanban")
  return { success: true, error: null }
}

const bulkItemsSchema = z.object({
  project_id: z.string().uuid(),
  items: z
    .array(
      z.object({
        name: z.string().min(2),
        quantity: z.number().min(1),
        type: z.enum(["glass_trophy", "medal", "cup", "plexiglass", "other"]),
        complexity: z.enum(["NORMAL", "EXPERT"]).default("NORMAL"),
        specs: z.string().optional(),
      })
    )
    .min(1),
})

export async function bulkCreateProjectItems(_: ActionState, formData: FormData) {
  const supabase = createClient()
  const payload = formData.get("payload")
  if (!payload) {
    return { error: "Aucune ligne valide" }
  }
  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(payload as string)
  } catch {
    return { error: "Format invalide" }
  }

  const parsed = bulkItemsSchema.safeParse(parsedJson)
  if (!parsed.success) {
    return { error: "Lignes invalides" }
  }

  const { project_id, items } = parsed.data
  const mapped = items.map((item) => ({
    project_id,
    name: item.name,
    quantity: item.quantity,
    type: item.type,
    complexity: item.complexity,
    specs: safeJson(item.specs),
  }))

  const { error } = await supabase.from("project_items").insert(mapped)
  if (error) {
    return { error: "Impossible d'enregistrer les items" }
  }

  revalidatePath(`/admin/projects/${project_id}`)
  return { success: true }
}

const batEntrySchema = z.object({
  project_id: z.string().uuid(),
  file_url: z.string().url().optional(),
  notes: z.string().optional(),
  status: z.enum(["pending", "validated", "rejected"]),
})

export async function createBatEntry(_: ActionState, formData: FormData) {
  const supabase = createClient()
  const raw = Object.fromEntries(formData)
  const parsed = batEntrySchema.safeParse(raw)

  if (!parsed.success) {
    return { error: "BAT invalide" }
  }

  const { project_id, file_url, notes, status } = parsed.data

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("bat_version")
    .eq("id", project_id)
    .single()

  if (projectError || !project) {
    return { error: "Projet introuvable" }
  }

  const nextVersion = (project.bat_version || 0) + 1

  const [{ error: insertError }, { error: updateError }] = await Promise.all([
    supabase.from("bat_files").insert({
      project_id,
      version: nextVersion,
      status,
      file_url,
      notes,
    }),
    supabase
      .from("projects")
      .update({ bat_version: nextVersion, bat_status: status, bat_file_url: file_url || null })
      .eq("id", project_id),
  ])

  if (insertError || updateError) {
    return { error: "Impossible d'enregistrer le BAT" }
  }

  revalidatePath(`/admin/projects/${project_id}`)
  revalidatePath("/admin/projects")
  return { success: true, error: null }
}

