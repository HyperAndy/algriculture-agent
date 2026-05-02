"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Pagination({
  page,
  totalPages,
  baseUrl,
}: {
  page: number
  totalPages: number
  baseUrl: string
}) {
  if (totalPages <= 1) return null

  const prevHref = page > 1 ? `${baseUrl}?page=${page - 1}` : "#"
  const nextHref = page < totalPages ? `${baseUrl}?page=${page + 1}` : "#"

  const pages: (number | "...")[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...")
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1">
      <Link
        href={prevHref}
        aria-disabled={page <= 1}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-lg text-sm transition-colors",
          "hover:bg-muted",
          page <= 1 && "pointer-events-none text-muted-foreground/40"
        )}
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">上一页</span>
      </Link>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="inline-flex size-8 items-center justify-center text-sm text-muted-foreground">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={`${baseUrl}?page=${p}`}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-lg text-sm transition-colors",
              "hover:bg-muted",
              p === page
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground"
            )}
          >
            {p}
          </Link>
        )
      )}
      <Link
        href={nextHref}
        aria-disabled={page >= totalPages}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-lg text-sm transition-colors",
          "hover:bg-muted",
          page >= totalPages && "pointer-events-none text-muted-foreground/40"
        )}
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">下一页</span>
      </Link>
    </nav>
  )
}
