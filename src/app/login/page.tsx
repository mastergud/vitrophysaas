'use client'

import { useFormStatus } from 'react-dom'
import { login } from './actions'
import { useFormState } from 'react-dom'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { Badge } from '@/components/ui/badge'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full rounded-full bg-white text-black hover:bg-white/90" type="submit" disabled={pending}>
      {pending ? 'Connexion...' : 'Se connecter'}
    </Button>
  )
}

const initialState = {
  error: null as string | null,
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#121217,_#050506)] p-4">
      <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_40%)]" />
      <Card className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-white shadow-2xl backdrop-blur">
        <CardHeader className="space-y-4">
          <Badge className="w-fit rounded-full bg-white/10 px-3 py-1 text-white">
            Vitrophy OS
          </Badge>
          <div>
            <CardTitle className="text-3xl font-semibold">Bienvenue</CardTitle>
            <CardDescription className="text-white/70">
              Connectez-vous pour accéder à votre espace sur-mesure.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="nom@vitrophy.lu" 
                required 
                className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-white/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">Mot de passe</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-white/40"
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
