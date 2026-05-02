"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { Menu, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/console/app-sidebar"
import { SidebarNav } from "@/components/console/sidebar-nav"
import { CommandPalette } from "@/components/console/command-palette"
import { BreadcrumbNav } from "@/components/console/breadcrumb-nav"
import { ThemeToggle } from "@/components/console/theme-toggle"

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
  const [mobileOpen, setMobileOpen] = useState(false)

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

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-[#0a1f14] text-[#d4e5d8]">
          <SheetHeader className="sr-only">
            <SheetTitle>导航菜单</SheetTitle>
            <SheetDescription>选择要访问的页面</SheetDescription>
          </SheetHeader>
          <SidebarNav onLinkClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className={cn("transition-all duration-300", collapsed ? "md:pl-14" : "md:pl-64")}>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <CollapseTrigger />
          <BreadcrumbNav />
          <div className="flex-1" />
          <ThemeToggle />
        </header>
        <div className="mx-auto max-w-7xl px-2 sm:px-4 md:px-4 py-4 sm:py-6">
          {children}
        </div>
      </div>
      <CommandPalette />
    </div>
  )
}
