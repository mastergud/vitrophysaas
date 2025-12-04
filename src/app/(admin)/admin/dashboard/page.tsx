import { Suspense } from "react"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { RecentProjects } from "@/components/dashboard/recent-projects"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10 text-white">
      <div className="space-y-3">
        <Badge className="rounded-full bg-white/10 text-white hover:bg-white/20">
          Atelier connecté
        </Badge>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-zinc-400">
            Vue panoramique des projets, urgences et activité atelier.
          </p>
        </div>
      </div>
      
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <GlassCard className="col-span-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Projets récents</h3>
              <p className="text-sm text-white/60">
                Dernières modifications et nouveaux leads.
              </p>
            </div>
          </div>
          <Suspense fallback={<Skeleton className="h-[200px] rounded-2xl bg-white/10" />}>
            {/* @ts-expect-error Server Component */}
            <RecentProjects />
          </Suspense>
        </GlassCard>
        <GlassCard className="col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Activité Atelier</h3>
              <p className="text-sm text-white/60">
                Logs en temps réel des étudiants.
              </p>
            </div>
          </div>
          <EmptyState label="Flux en préparation" />
        </GlassCard>
      </div>
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-[140px] rounded-3xl bg-white/10" />
      ))}
    </div>
  )
}

function GlassCard({ className, children }: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl shadow-black/20 backdrop-blur",
        className
      )}
    >
      {children}
    </Card>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-white/50">
      {label}
    </div>
  )
}
