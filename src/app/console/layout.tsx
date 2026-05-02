"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/console/app-sidebar"
import { CommandPalette } from "@/components/console/command-palette"
import { BreadcrumbNav } from "@/components/console/breadcrumb-nav"
import { ThemeToggle } from "@/components/console/theme-toggle"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function CollapseTrigger() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem("sidebar-collapsed")
    if (s === "true") setCollapsed(true)
    const handler = () => {
      setCollapsed(localStorage.getItem("sidebar-collapsed") === "true")
    }
    window.addEventListener("sidebar-toggle", handler)
    return () => window.removeEventListener("sidebar-toggle", handler)
  }, [])

  const toggle = () => {
    const n = localStorage.getItem("sidebar-collapsed") === "true" ? "false" : "true"
    localStorage.setItem("sidebar-collapsed", n)
    window.dispatchEvent(new Event("sidebar-toggle"))
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} className="hidden md:flex">
      <PanelLeft className="size-5" />
    </Button>
  )
}

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem("sidebar-collapsed")
    if (s === "true") setCollapsed(true)
    const handler = () => {
      setCollapsed(localStorage.getItem("sidebar-collapsed") === "true")
    }
    window.addEventListener("sidebar-toggle", handler)
    return () => window.removeEventListener("sidebar-toggle", handler)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className={cn("transition-all duration-300", collapsed ? "md:pl-14" : "md:pl-64")}>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <CollapseTrigger />
          <BreadcrumbNav />
          <div className="flex-1" />
          <ThemeToggle />
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6">
          {children}
        </div>
      </div>
      <CommandPalette />
    </div>
  )
}
