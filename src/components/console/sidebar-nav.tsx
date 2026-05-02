"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MapPinned, ClipboardList, Archive, Sprout, MonitorUp } from "lucide-react"
import { cn } from "@/lib/utils"

export const NAV_ITEMS = [
  { href: "/console", label: "工作台", icon: LayoutDashboard },
  { href: "/console/fields", label: "地块管理", icon: MapPinned },
  { href: "/console/tasks", label: "农事任务", icon: ClipboardList },
  { href: "/console/archive", label: "农事档案", icon: Archive },
]

export function SidebarNav({ collapsed = false, onLinkClick }: { collapsed?: boolean; onLinkClick?: () => void }) {
  const pathname = usePathname()

  const linkClasses = (active: boolean) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-[#1a3d28] text-emerald-400"
        : "text-[#9ab5a2] hover:bg-[#0f281a] hover:text-[#d4e5d8]",
      collapsed && "justify-center px-2"
    )

  return (
    <>
      <div className={cn("flex items-center gap-2 border-b border-[#1a3d28] px-3 py-4", collapsed && "justify-center px-1")}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 min-w-0" onClick={onLinkClick}>
            <Sprout className="size-5 shrink-0 text-emerald-400" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold uppercase text-emerald-400 leading-tight">稳产减灾Agent</span>
              <span className="text-lg font-bold leading-6 truncate text-[#d4e5d8]">大田作物稳产减灾</span>
            </div>
          </Link>
        )}
        {collapsed && <Sprout className="size-5 text-emerald-400" />}
      </div>

      <nav className="flex-1 space-y-1 px-2 py-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/console" && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined}
              className={linkClasses(active)} onClick={onLinkClick}>
              <item.icon className="size-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[#1a3d28] px-2 py-3">
        <Link href="/demo" title={collapsed ? "演示大屏" : undefined}
          className={cn(linkClasses(false), collapsed && "justify-center px-2")} onClick={onLinkClick}>
          <MonitorUp className="size-5 shrink-0" />
          {!collapsed && <span>演示大屏</span>}
        </Link>
      </div>
    </>
  )
}
