"use client"

import { useEffect } from "react"
import { useFormState } from "react-dom"
import { startTimer, stopTimer } from "@/app/(workshop)/workshop/time/actions"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format, formatDistanceStrict } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"
import { Database } from "@/types/database.types"

const initialState = { error: null as string | null }

type TimesheetEntry = Database["public"]["Tables"]["timesheets"]["Row"]

interface TimeTrackerProps {
  openEntry: TimesheetEntry | null
  entries: TimesheetEntry[]
}

export function TimeTracker({ openEntry, entries }: TimeTrackerProps) {
  const [startState, startAction] = useFormState(startTimer, initialState)
  const [stopState, stopAction] = useFormState(stopTimer, initialState)

  useEffect(() => {
    if (startState?.error) toast.error(startState.error)
    if (stopState?.error) toast.error(stopState.error)
  }, [startState, stopState])

  const runningDuration = openEntry
    ? formatDistanceStrict(new Date(openEntry.start_time), new Date(), {
        locale: fr,
      })
    : null

  return (
    <div className="space-y-6 text-white">
      <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">
              Pointage atelier
            </p>
            <h1 className="text-3xl font-semibold">
              {openEntry ? "Session en cours" : "Pas de session"}
            </h1>
            {openEntry && (
              <p className="text-white/70">
                Démarré à {format(new Date(openEntry.start_time), "HH:mm", { locale: fr })} • {runningDuration}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {!openEntry ? (
              <form action={startAction}>
                <Button className="rounded-full bg-emerald-500 text-white hover:bg-emerald-400">
                  Démarrer
                </Button>
              </form>
            ) : (
              <form action={stopAction}>
                <input type="hidden" name="entry_id" value={openEntry.id} />
                <Button className="rounded-full bg-rose-500 text-white hover:bg-rose-400">
                  Stopper
                </Button>
              </form>
            )}
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">Historique</p>
        <div className="mt-4 space-y-3">
          {entries.length === 0 && (
            <p className="text-sm text-white/60">Aucune session enregistrée.</p>
          )}
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold">
                  {format(new Date(entry.start_time), "dd MMM", { locale: fr })}
                </p>
                <p className="text-white/60">
                  {format(new Date(entry.start_time), "HH:mm", { locale: fr })} →{" "}
                  {entry.end_time ? format(new Date(entry.end_time), "HH:mm", { locale: fr }) : "…"}
                </p>
              </div>
              <p className="text-white/80">
                {entry.end_time
                  ? formatDistanceStrict(new Date(entry.start_time), new Date(entry.end_time), {
                      locale: fr,
                    })
                  : "En cours"}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function TimeTrackerSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 rounded-3xl bg-white/10" />
      <Skeleton className="h-40 rounded-3xl bg-white/10" />
    </div>
  )
}

