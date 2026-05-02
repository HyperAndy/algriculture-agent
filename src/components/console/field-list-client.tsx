"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FieldCard } from "@/components/console/field-card"
import { FilterBar } from "@/components/console/filter-bar"
import { PageHeader } from "@/components/console/page-header"
import { EmptyState } from "@/components/console/empty-state"
import { Input } from "@/components/ui/input"

interface Field {
  id: string
  name: string
  location: string
  areaMu: number
  cropType: string
  variety: string | null
  growthStage: string
  riskLevel: string
}

const cropOptions = [
  { label: "水稻", value: "水稻" },
  { label: "小麦", value: "小麦" },
  { label: "玉米", value: "玉米" },
  { label: "大豆", value: "大豆" },
]

const riskOptions = [
  { label: "低", value: "low" },
  { label: "中", value: "medium" },
  { label: "高", value: "high" },
]

const growthOptions = [
  { label: "播种期", value: "播种期" },
  { label: "苗期", value: "苗期" },
  { label: "分蘖期", value: "分蘖期" },
  { label: "拔节期", value: "拔节期" },
  { label: "孕穗期", value: "孕穗期" },
  { label: "灌浆期", value: "灌浆期" },
  { label: "开花期", value: "开花期" },
]

const filters = [
  { label: "作物", key: "crop", options: cropOptions },
  { label: "风险", key: "risk", options: riskOptions },
  { label: "生长阶段", key: "growth", options: growthOptions },
]

export function FieldListClient({ fields }: { fields: Field[] }) {
  const [search, setSearch] = useState("")
  const [crop, setCrop] = useState("")
  const [risk, setRisk] = useState("")
  const [growth, setGrowth] = useState("")

  const filtered = useMemo(() => {
    return fields.filter((f) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q)
      const matchCrop = !crop || f.cropType === crop
      const matchRisk = !risk || f.riskLevel === risk
      const matchGrowth = !growth || f.growthStage === growth
      return matchSearch && matchCrop && matchRisk && matchGrowth
    })
  }, [fields, search, crop, risk, growth])

  return (
    <div className="space-y-6">
      <PageHeader
        title="地块管理"
        description="管理所有农田地块信息"
        actions={
          <Link href="/demo">
            <Button variant="outline" size="sm">
              演示
            </Button>
          </Link>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <FilterBar
          filters={filters}
          onFilterChange={(key, value) => {
            if (key === "crop") setCrop(value)
            if (key === "risk") setRisk(value)
            if (key === "growth") setGrowth(value)
          }}
        />
        <div className="relative">
          <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索地块名称/位置..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-56 pl-7 text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<MapPin className="size-8" />}
          title="暂无地块数据"
          description="当前筛选条件下没有匹配的地块"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>
      )}
    </div>
  )
}
