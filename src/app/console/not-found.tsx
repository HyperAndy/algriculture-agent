"use client"

import Link from "next/link"
import { FileX } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ConsoleNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <FileX className="mx-auto size-12 text-muted-foreground" />
          <CardTitle>页面不存在</CardTitle>
          <CardDescription>
            请检查URL是否正确
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button variant="outline" render={<Link href="/console" />}>
            返回工作台
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
