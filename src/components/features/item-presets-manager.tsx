"use client"

import { useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { saveSetting } from "@/app/(admin)/admin/settings/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const initialState = { error: null as string | null }

type Preset = {
  label: string
  type: string
  specs: Record<string, unknown>
}

interface ItemPresetsManagerProps {
  presets: Preset[]
}

export function ItemPresetsManager({ presets }: ItemPresetsManagerProps) {
  const [rows, setRows] = useState(() =>
    presets.map((preset) => ({
      label: preset.label,
      type: preset.type,
      specsText: JSON.stringify(preset.specs ?? {}, null, 2),
    }))
  )
  const [state, formAction] = useFormState(saveSetting, initialState)

  useEffect(() => {
    if (!state) return
    if (state.error) {
      toast.error(state.error)
    } else {
      toast.success("Presets enregistrés")
    }
  }, [state])

  function updateRow(index: number, field: "label" | "type" | "specsText", value: string) {
    setRows((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function addRow() {
    setRows((prev) => [...prev, { label: "", type: "glass_trophy", specsText: "{}" }])
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  const payload = JSON.stringify(
    rows.map((row) => {
      let parsedSpecs: Record<string, unknown> = {}
      try {
        parsedSpecs = JSON.parse(row.specsText || "{}")
      } catch {
        parsedSpecs = {}
      }
      return {
        label: row.label,
        type: row.type,
        specs: parsedSpecs,
      }
    })
  )

  return (
    <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
      <CardHeader>
        <CardTitle>Types d&apos;items</CardTitle>
        <p className="text-sm text-white/60">
          Utilisé lors de la saisie rapide et des formulaires.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="key" value="item_presets" />
          <input type="hidden" name="value" value={payload} />
          <div className="space-y-4">
            {rows.map((row, index) => (
              <div key={index} className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Label">
                    <Input
                      value={row.label}
                      onChange={(e) => updateRow(index, "label", e.target.value)}
                      placeholder="Trophée verre 10mm"
                      className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                    />
                  </Field>
                  <Field label="Type">
                    <select
                      value={row.type}
                      onChange={(e) => updateRow(index, "type", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
                    >
                      <option value="glass_trophy">Trophée Verre</option>
                      <option value="medal">Médaille</option>
                      <option value="cup">Coupe</option>
                      <option value="plexiglass">Plexi</option>
                      <option value="other">Autre</option>
                    </select>
                  </Field>
                </div>
                <Field label="Specs JSON">
                  <Textarea
                    value={row.specsText}
                    onChange={(e) => updateRow(index, "specsText", e.target.value)}
                    className="min-h-[120px] border-white/10 bg-white/5 text-white font-mono text-xs"
                  />
                </Field>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full border border-white/20 bg-white/10 text-white"
                    onClick={() => removeRow(index)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={addRow} className="rounded-full bg-white text-black hover:bg-white/90">
              + Ajouter un preset
            </Button>
            <Button type="submit" className="rounded-full bg-emerald-500 text-white hover:bg-emerald-400">
              Enregistrer
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs uppercase tracking-wide text-white/60">{label}</label>
      {children}
    </div>
  )
}
