import Link from "next/link";
import type { ReactNode } from "react";
import { LayoutDashboard, Archive, ClipboardList, MapPinned, MonitorUp } from "lucide-react";

const NAV = [
  { href: "/demo", label: "演示大屏", icon: MonitorUp },
  { href: "/console", label: "工作台", icon: LayoutDashboard },
  { href: "/console/fields", label: "地块", icon: MapPinned },
  { href: "/console/tasks", label: "任务", icon: ClipboardList },
  { href: "/console/archive", label: "档案", icon: Archive }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f8f3] text-[#17231b]">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-[#dce5d8] bg-white p-5 md:block">
        <Link href="/" className="block">
          <p className="text-xs font-semibold uppercase text-[#1f6f49]">Field Crop Agent</p>
          <h1 className="mt-2 text-lg font-bold leading-6">大田作物稳产减灾</h1>
        </Link>
        <nav className="mt-8 grid gap-2">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-[#536156] hover:bg-[#eef4ec] hover:text-[#1f6f49]">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="md:pl-60">
        <div className="mx-auto max-w-7xl px-5 py-6">{children}</div>
      </main>
    </div>
  );
}
