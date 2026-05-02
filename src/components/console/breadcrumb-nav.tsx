"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const LABEL_MAP: Record<string, string> = {
  console: "工作台",
  fields: "地块管理",
  tasks: "农事任务",
  archive: "农事档案",
  reports: "诊断报告",
  analysis: "Agent分析",
  input: "数据录入",
}

function getLabel(segment: string): string {
  return LABEL_MAP[segment] ?? segment
}

export function BreadcrumbNav() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>首页</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  const items = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const label = getLabel(segment)
    const isLast = index === segments.length - 1

    return { href, label, isLast }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item) => (
          <span key={item.href} className="flex items-center gap-1.5">
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
