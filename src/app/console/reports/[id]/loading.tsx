import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ReportLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-5 w-20 mb-1" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-5 w-28 mb-1" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-3 w-full ml-6" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-5 w-28 mb-1" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} size="sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-2 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3 mt-1" />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28 mb-1" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <div className="relative pl-8 space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="relative">
                <Skeleton className="absolute left-[-1.625rem] top-1 size-3 rounded-full" />
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-full" />
                {i < 5 && (
                  <Skeleton className="absolute left-[-1.375rem] top-4 h-full w-0.5" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
