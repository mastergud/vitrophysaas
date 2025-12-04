"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useDroppable, useDraggable } from "@dnd-kit/core"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { ProjectStatus } from "@/types/database.types"
import { updateProjectStatus } from "@/app/(admin)/admin/projects/actions"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"

type KanbanProject = {
  id: string
  reference: string
  title: string
  status: ProjectStatus
  deadline: string | null
  tray_number: string | null
}

const STATUS_META: Record<ProjectStatus, { label: string; accent: string }> = {
  draft: { label: "Draft", accent: "from-zinc-900 to-zinc-800" },
  prepress: { label: "Prepress / BAT", accent: "from-sky-900 to-sky-800" },
  production: { label: "Production", accent: "from-amber-900 to-amber-700" },
  finished: { label: "Terminé", accent: "from-emerald-900 to-emerald-700" },
  delivered: { label: "Livré", accent: "from-blue-900 to-blue-700" },
  archived: { label: "Archivé", accent: "from-zinc-800 to-zinc-700" },
}

interface ProjectsKanbanBoardProps {
  projects: KanbanProject[]
}

export function ProjectsKanbanBoard({ projects }: ProjectsKanbanBoardProps) {
  const [items, setItems] = useState(projects)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setItems(projects)
  }, [projects])

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor)
  )

  const projectsByStatus = useMemo(() => {
    return items.reduce<Record<ProjectStatus, KanbanProject[]>>((acc, project) => {
      acc[project.status] = acc[project.status] ? [...acc[project.status], project] : [project]
      return acc
    }, {
      draft: [],
      prepress: [],
      production: [],
      finished: [],
      delivered: [],
      archived: [],
    })
  }, [items])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const projectId = String(active.id)
    const newStatus = over.id as ProjectStatus
    if (!projectId || !newStatus) return

    setItems((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, status: newStatus } : project
      )
    )

    const formData = new FormData()
    formData.append("project_id", projectId)
    formData.append("status", newStatus)

    startTransition(async () => {
      const result = await updateProjectStatus(undefined, formData)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Statut mis à jour")
      }
    })
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {(Object.keys(STATUS_META) as ProjectStatus[]).map((status) => (
          <Column key={status} status={status} projects={projectsByStatus[status]} pending={isPending} />
        ))}
      </div>
    </DndContext>
  )
}

function Column({
  status,
  projects,
  pending,
}: {
  status: ProjectStatus
  projects: KanbanProject[]
  pending: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const meta = STATUS_META[status]

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[450px] flex-col rounded-3xl border border-white/10 bg-gradient-to-b p-4 text-white backdrop-blur",
        meta.accent,
        isOver && "border-white/40 shadow-lg shadow-black/30"
      )}
    >
      <div className="mb-4 flex items-center justify-between text-sm uppercase tracking-wide text-white/70">
        <span>{meta.label}</span>
        <Badge className="rounded-full bg-white/20 text-white">{projects.length}</Badge>
      </div>

      <div className="flex-1 space-y-3">
        {projects.map((project) => (
          <CardDraggable key={project.id} project={project} disabled={pending} />
        ))}
        {!projects.length && (
          <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center text-xs text-white/60">
            Déposez un projet ici
          </div>
        )}
      </div>
    </div>
  )
}

function CardDraggable({ project, disabled }: { project: KanbanProject; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project.id,
    disabled,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const cardContent = (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-2xl border border-white/10 bg-white/15 p-4 text-white shadow-lg shadow-black/30 backdrop-blur transition",
        isDragging && "opacity-90 ring-2 ring-white/60"
      )}
      {...listeners}
      {...attributes}
    >
      <p className="text-xs uppercase tracking-[0.4em] text-white/60">{project.reference}</p>
      <p className="text-base font-semibold">{project.title}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
        <Badge className="rounded-full bg-black/30 text-white/80">
          {project.tray_number ? `Bac ${project.tray_number}` : "Bac ?"}
        </Badge>
        <Badge className="rounded-full bg-black/20 text-white/80">
          {project.deadline
            ? format(new Date(project.deadline), "dd MMM", { locale: fr })
            : "Deadline ?"}
        </Badge>
      </div>
    </div>
  )

  if (isDragging) {
    return createPortal(cardContent, document.body)
  }

  return cardContent
}

