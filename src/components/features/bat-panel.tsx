"use client"

import { useEffect } from "react"
import { useFormState } from "react-dom"
import { createBatEntry } from "@/app/(admin)/admin/projects/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { BatStatus, Database } from "@/types/database.types"

const initialState = { error: null as string | null }

type BatEntry = Database["public"]["Tables"]["bat_files"]["Row"]

interface BatPanelProps {
  projectId: string
  entries: BatEntry[]
  currentStatus: BatStatus
}

export function BatPanel({ projectId, entries, currentStatus }: BatPanelProps) {
  const [state, formAction] = useFormState(createBatEntry, initialState)

  useEffect(() => {
    if (!state) return
    if (state.error) {
      toast.error(state.error)
    } else {
      toast.success("BAT enregistré")
    }
  }, [state])

  const sortedEntries = [...entries].sort((a, b) => b.version - a.version)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">Historique BAT</p>
        <div className="space-y-2">
          {sortedEntries.length === 0 && <p className="text-sm text-white/60">Pas encore de BAT.</p>}
          {sortedEntries.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Version V{entry.version}</p>
                <Badge className="rounded-full bg-white/10 text-white">
                  {entry.status === "validated" ? "Valid�" : entry.status === "pending" ? "En attente" : "Rejet�"}
                </Badge>
              </div>
              <p className="text-xs text-white/60 mt-1">
                {entry.created_at ? format(new Date(entry.created_at), "dd MMM yyyy - HH:mm", { locale: fr }) : ""}
              </p>
              {entry.notes && <p className="mt-2 text-white/70">{entry.notes}</p>}
              {entry.file_url && (
                <a href={entry.file_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-sky-200 underline">
                  Ouvrir le BAT
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <form action={formAction} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <input type="hidden" name="project_id" value={projectId} />
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wide text-white/60" htmlFor="status">
              Statut BAT
            </label>
            <select
              id="status"
              name="status"
              defaultValue={currentStatus}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
            >
              <option value="pending">En attente</option>
              <option value="validated">Valid�</option>
              <option value="rejected">Rejet�</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wide text-white/60" htmlFor="file_url">
              Lien BAT (Supabase Storage / Drive)
            </label>
            <Input
              id="file_url"
              name="file_url"
              placeholder="https://..."
              className="border-white/10 bg-black/30 text-white"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wide text-white/60" htmlFor="notes">
            Notes
          </label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="BAT V2 suite corrections client"
            className="border-white/10 bg-black/30 text-white"
          />
        </div>
        <Button type="submit" className="w-full rounded-full bg-white text-black hover:bg-white/90">
          Ajouter une version BAT
        </Button>
      </form>
    </div>
  )
}
