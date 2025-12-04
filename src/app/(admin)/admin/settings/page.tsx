import { saveSetting } from "./actions"
import { createClient } from "@/utils/supabase/server"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ItemPresetsManager } from "@/components/features/item-presets-manager"

async function simpleSaveSetting(formData: FormData) {
  "use server"
  await saveSetting(undefined, formData)
}

const defaultItemPresets = [
  { label: "Trophée verre 10mm", type: "glass_trophy", specs: { thickness: "10mm", technique: "uv_gluing" } },
  { label: "Médailles 50mm", type: "medal", specs: { diameter: "50mm", lanyard: "tricolore" } },
]

const defaultTrays = ["Bac 01", "Bac 02", "Bac 03"]

const defaultDeadlines = { warning: 7, danger: 3 }

function formatValue(value: unknown) {
  return JSON.stringify(value, null, 2)
}

export default async function SettingsPage() {
  const supabase = createClient()
  const { data } = await supabase.from("settings").select("key, value")
  const map = Object.fromEntries(data?.map((entry) => [entry.key, entry.value]) ?? [])

  const itemPresets = map["item_presets"] ?? defaultItemPresets
  const trayCatalog = map["tray_catalog"] ?? defaultTrays
  const deadlineThresholds = map["deadline_thresholds"] ?? defaultDeadlines

  return (
    <div className="space-y-8 text-white">
      <div className="space-y-2">
        <Badge className="rounded-full bg-white/10 text-white">Paramètres</Badge>
        <h1 className="text-4xl font-semibold">Configuration atelier & bureau</h1>
        <p className="text-white/60">Définissez les presets utilisés par les formulaires.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ItemPresetsManager presets={itemPresets} />
        <SettingsCard
          title="Bacs atelier"
          description="Liste des bacs disponibles pour l'assignation."
          name="tray_catalog"
          defaultValue={formatValue(trayCatalog)}
        />
        <SettingsCard
          title="Seuils Deadlines"
          description="Jours avant deadline pour les badges orange/rouge."
          name="deadline_thresholds"
          defaultValue={formatValue(deadlineThresholds)}
        />
      </div>
    </div>
  )
}

function SettingsCard({
  title,
  description,
  name,
  defaultValue,
}: {
  title: string
  description: string
  name: string
  defaultValue: string
}) {
  return (
    <Card className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-white/60">{description}</p>
      </CardHeader>
      <CardContent>
        <form action={simpleSaveSetting} className="space-y-3">
          <input type="hidden" name="key" value={name} />
          <Textarea
            name="value"
            defaultValue={defaultValue}
            className="min-h-[160px] border-white/10 bg-black/30 text-white font-mono text-xs"
          />
          <Button type="submit" className="rounded-full bg-white text-black hover:bg-white/90">
            Enregistrer
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
