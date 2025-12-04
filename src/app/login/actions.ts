'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

type AuthState = {
  error: string | null
} | undefined

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function login(_: AuthState, formData: FormData) {
  const supabase = createClient()
  
  const data = Object.fromEntries(formData)
  const parsed = loginSchema.safeParse(data)

  if (!parsed.success) {
    return { error: 'Format invalide' }
  }

  const { email, password } = parsed.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Identifiants incorrects' }
  }

  revalidatePath('/', 'layout')
  redirect('/') // Middleware will handle role-based redirection
}

