import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { TimeTracker, TimeTrackerSkeleton } from "@/components/features/time-tracker"

export default async function TimePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: entries } = await supabase
    .from("timesheets")
    .select("*")
    .eq("user_id", user.id)
    .order("start_time", { ascending: false })
    .limit(10)

  const openEntry = entries?.find((entry) => !entry.end_time) ?? null

  return (
    <Suspense fallback={<TimeTrackerSkeleton />}>
      <TimeTracker openEntry={openEntry} entries={entries ?? []} />
    </Suspense>
  )
}

