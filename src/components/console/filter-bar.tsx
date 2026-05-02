"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface FilterOption {
  label: string
  value: string
}

interface FilterDef {
  label: string
  key: string
  options: FilterOption[]
}

export function FilterBar({
  filters,
  onFilterChange,
  searchPlaceholder = "搜索...",
  onSearch,
}: {
  filters: FilterDef[]
  onFilterChange: (key: string, value: string) => void
  searchPlaceholder?: string
  onSearch?: (q: string) => void
}) {
  const [searchValue, setSearchValue] = useState("")

  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => (
        <Select
          key={filter.key}
          onValueChange={(value) => {
            const v = String(value)
            const nonEmpty = v === "__all__" ? "" : v
            onFilterChange(filter.key, nonEmpty)
          }}
        >
          <SelectTrigger size="sm" className="w-36">
            <span className="text-muted-foreground">{filter.label}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">全部</SelectItem>
            {filter.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              onSearch(e.target.value)
            }}
            className="h-8 w-48 pl-7 text-sm"
          />
        </div>
      )}
    </div>
  )
}
