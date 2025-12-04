"use client"

import { useEffect, useMemo, useState } from "react"
import { useFormState } from "react-dom"
import { bulkCreateProjectItems } from "@/app/(admin)/admin/projects/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const initialRow = { name: "", quantity: "1", type: "glass_trophy", complexity: "NORMAL", specs: "" }
const initialState = { error: null as string | null }

interface QuickItemsTableProps {
  projectId: string
}

export function QuickItemsTable({ projectId }: QuickItemsTableProps) {
  const [rows, setRows] = useState(() => Array.from({ length: 3 }, () => ({ ...initialRow })))
  const [state, formAction] = useFormState(bulkCreateProjectItems, initialState)

  useEffect(() => {
    if (!state) return
    if (state.error) {
      toast.error(state.error)
    } else {
      toast.success("Items ajout�s")
      setRows(Array.from({ length: 3 }, () => ({ ...initialRow })))
    }
  }, [state])

  const usableRows = useMemo(() => rows.filter((row) => row.name.trim().length > 0), [rows])

  const payload = JSON.stringify({
    project_id: projectId,
    items: usableRows.map((row) => ({
      name: row.name,
      quantity: Number(row.quantity) || 1,
      type: row.type,
      complexity: row.complexity,
      specs: row.specs,
    })),
  })

  const canSubmit = usableRows.length > 0

  function updateRow(index: number, field: keyof typeof initialRow, value: string) {
    setRows((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function addRows(count = 3) {
    setRows((prev) => [...prev, ...Array.from({ length: count }, () => ({ ...initialRow }))])
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="payload" value={payload} />
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm text-white/80">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Quantit�</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Complexit�</th>
              <th className="px-4 py-3 text-left">Specs JSON</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-white/5">
                <td className="px-4 py-2">
                  <Input
                    value={row.name}
                    onChange={(e) => updateRow(index, "name", e.target.value)}
                    placeholder="Troph�e verre"
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    min={1}
                    value={row.quantity}
                    onChange={(e) => updateRow(index, "quantity", e.target.value)}
                    className="border-white/10 bg-white/5 text-white"
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={row.type}
                    onChange={(e) => updateRow(index, "type", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
                  >
                    <option value="glass_trophy">Troph�e Verre</option>
                    <option value="medal">M�daille</option>
                    <option value="cup">Coupe</option>
                    <option value="plexiglass">Plexi</option>
                    <option value="other">Autre</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={row.complexity}
                    onChange={(e) => updateRow(index, "complexity", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <Input
                    value={row.specs}
                    onChange={(e) => updateRow(index, "specs", e.target.value)}
                    placeholder='{"type":"glass","diameter":"50mm"}'
                    className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="secondary" className="rounded-full border border-white/20 bg-white/10 text-white" onClick={() => addRows(3)}>
          + Ajouter 3 lignes
        </Button>
        <div className="text-xs text-white/60">
          <Badge className="rounded-full bg-white/10 text-white">{usableRows.length} ligne(s) pr�tes</Badge>
        </div>
      </div>
      <Button type="submit" disabled={!canSubmit} className="w-full rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-40">
        Enregistrer les lignes
      </Button>
    </form>
  )
}
