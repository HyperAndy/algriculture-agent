"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MapPinned, ClipboardList, Archive, Sprout, MonitorUp, PanelLeftClose, PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const NAV_ITEMS = [
  { href: "/console", label: "工作台", icon: LayoutDashboard },
  { href: "/console/fields", label: "地块管理", icon: MapPinned },
  { href: "/console/tasks", label: "农事任务", icon: ClipboardList },
  { href: "/console/archive", label: "农事档案", icon: Archive },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const stored = typeof window !== "undefined" ? localStorage.getItem("sidebar-collapsed") : null
  useEffect(() => {
    if (stored !== null) setCollapsed(stored === "true")
  }, [])

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem("sidebar-collapsed", String(next))
      return next
    })
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-[#0a1f14] text-[#d4e5d8] transition-all duration-300 ease-in-out",
        "md:block hidden",
        collapsed ? "w-14" : "w-64"
      )}
    >
      <div className={cn("flex items-center gap-2 border-b border-[#1a3d28] px-3 py-4", collapsed && "justify-center px-1")}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <Sprout className="size-5 shrink-0 text-emerald-400" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold uppercase text-emerald-400 leading-tight">
                稳产减灾Agent
              </span>
              <span className="text-lg font-bold leading-6 truncate text-[#d4e5d8]">
                大田作物稳产减灾
              </span>
            </div>
          </Link>
        )}
        {collapsed && <Sprout className="size-5 text-emerald-400" />}
        <button
          onClick={toggle}
          className={cn("ml-auto shrink-0 rounded-md p-1 text-[#7a967e] hover:bg-[#1a3d28] hover:text-[#d4e5d8]", collapsed && "ml-0")}
        >
          {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/console" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[#1a3d28] text-emerald-400"
                  : "text-[#9ab5a2] hover:bg-[#0f281a] hover:text-[#d4e5d8]",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="size-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[#1a3d28] px-2 py-3">
        <Link
          href="/demo"
          title={collapsed ? "演示大屏" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#9ab5a2] transition-colors hover:bg-[#0f281a] hover:text-[#d4e5d8]",
            collapsed && "justify-center px-2"
          )}
        >
          <MonitorUp className="size-5 shrink-0" />
          {!collapsed && <span>演示大屏</span>}
        </Link>
      </div>
    </aside>
  )
}
