import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 border-dashed p-12 text-center",
        className
      )}
    >
      <div className="mx-auto mb-4 flex size-12 items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <h3 className="mb-1 text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
