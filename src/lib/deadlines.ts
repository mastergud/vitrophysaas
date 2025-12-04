import { differenceInCalendarDays } from "date-fns"

export type DeadlineMeta = {
  label: string
  className: string
  daysLeft: number | null
  urgency: "safe" | "warning" | "danger" | "past"
}

export function getDeadlineMeta(deadline: string | null): DeadlineMeta {
  if (!deadline) {
    return {
      label: "Sans deadline",
      className: "bg-zinc-800/60 text-zinc-100",
      daysLeft: null,
      urgency: "safe",
    }
  }

  const daysLeft = differenceInCalendarDays(new Date(deadline), new Date())

  if (daysLeft < 0) {
    return {
      label: `En retard ${Math.abs(daysLeft)} j`,
      className: "bg-red-600/30 text-red-100 animate-pulse",
      daysLeft,
      urgency: "past",
    }
  }

  if (daysLeft <= 3) {
    return {
      label: `J-${daysLeft}`,
      className: "bg-red-500/20 text-red-100 animate-pulse",
      daysLeft,
      urgency: "danger",
    }
  }

  if (daysLeft <= 7) {
    return {
      label: `J-${daysLeft}`,
      className: "bg-amber-500/20 text-amber-100",
      daysLeft,
      urgency: "warning",
    }
  }

  return {
    label: `J-${daysLeft}`,
    className: "bg-emerald-500/15 text-emerald-100",
    daysLeft,
    urgency: "safe",
  }
}
