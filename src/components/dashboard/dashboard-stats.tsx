import { createClient } from "@/utils/supabase/server"
import { StatsCard } from "./stats-card"
import { Activity, AlertCircle, CheckCircle2, Clock } from "lucide-react"

export async function DashboardStats() {
  const supabase = createClient()
  
  const { count: ongoingCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'production')

  const { count: lateCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .lt('deadline', new Date().toISOString())
    .neq('status', 'delivered')
    .neq('status', 'archived')

  const { count: prepressCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .in('status', ['draft', 'prepress'])
    
  const productionCount = 0 

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="En Production"
        value={ongoingCount || 0}
        icon={Activity}
        description="Projets actifs en atelier"
        accent="emerald"
      />
      <StatsCard
        title="Retards / Urgences"
        value={lateCount || 0}
        icon={AlertCircle}
        description="Deadlines dépassées"
        accent="rose"
      />
      <StatsCard
        title="En Préparation"
        value={prepressCount || 0}
        icon={Clock}
        description="Drafts & BAT"
        accent="amber"
      />
      <StatsCard
        title="Production du jour"
        value={productionCount}
        icon={CheckCircle2}
        description="Items terminés aujourd&apos;hui"
      />
    </div>
  )
}

