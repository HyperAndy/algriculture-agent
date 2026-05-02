"use client"

import { useState, useEffect } from "react"
import { PanelLeftClose, PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { SidebarNav } from "@/components/console/sidebar-nav"

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem("sidebar-collapsed")
    if (s === "true") setCollapsed(true)
  }, [])

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem("sidebar-collapsed", String(next))
      window.dispatchEvent(new Event("sidebar-toggle"))
      return next
    })
  }

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-30 flex-col bg-[#0a1f14] text-[#d4e5d8] transition-all duration-300 ease-in-out hidden md:flex",
      collapsed ? "w-14" : "w-64"
    )}>
      <div className="flex justify-end px-2 pt-3 pb-1">
        <button onClick={toggle} className="rounded-md p-1 text-[#7a967e] hover:bg-[#1a3d28] hover:text-[#d4e5d8]">
          {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>
      <SidebarNav collapsed={collapsed} />
    </aside>
  )
}
