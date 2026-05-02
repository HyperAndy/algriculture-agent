"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Dialog } from "@/components/ui/dialog"
import { MapPinned, ClipboardList, FileText } from "lucide-react"

interface SearchResult {
  id: string
  name: string
  href: string
}

interface SearchResponse {
  fields: SearchResult[]
  reports: SearchResult[]
  tasks: SearchResult[]
}

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResponse | null>(null)
  const [loading, setLoading] = React.useState(false)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(null)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleInputChange = React.useCallback((value: string) => {
    setQuery(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!value.trim()) {
      setResults(null)
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        } else {
          setResults(null)
        }
      } catch {
        setResults(null)
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const hasResults =
    results &&
    (results.fields.length > 0 ||
      results.reports.length > 0 ||
      results.tasks.length > 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="搜索地块、报告、任务..."
          value={query}
          onValueChange={handleInputChange}
        />
        <CommandList>
          {loading && (
            <CommandEmpty>搜索中...</CommandEmpty>
          )}
          {!loading && !hasResults && query.trim() !== "" && (
            <CommandEmpty>未找到匹配结果</CommandEmpty>
          )}
          {!loading && results && (
            <>
              {results.fields.length > 0 && (
                <CommandGroup heading="地块 Fields">
                  {results.fields.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`field-${item.id}`}
                      onSelect={() => {
                        router.push(item.href)
                        setOpen(false)
                      }}
                    >
                      <MapPinned className="size-4" />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {results.reports.length > 0 && (
                <CommandGroup heading="分析报告 Reports">
                  {results.reports.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`report-${item.id}`}
                      onSelect={() => {
                        router.push(item.href)
                        setOpen(false)
                      }}
                    >
                      <FileText className="size-4" />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {results.tasks.length > 0 && (
                <CommandGroup heading="农事任务 Tasks">
                  {results.tasks.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`task-${item.id}`}
                      onSelect={() => {
                        router.push(item.href)
                        setOpen(false)
                      }}
                    >
                      <ClipboardList className="size-4" />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </Command>
    </Dialog>
  )
}
