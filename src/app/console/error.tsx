"use client"

import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ConsoleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <AlertTriangle className="mx-auto size-12 text-destructive" />
          <CardTitle>页面加载出错</CardTitle>
          <CardDescription>
            {error.message || "发生了一个未知错误，请稍后重试。"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => router.refresh()}>
            重试
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
