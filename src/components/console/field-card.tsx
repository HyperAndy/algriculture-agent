import Link from "next/link"
import { MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RiskBadge } from "@/components/console/risk-badge"

const cropEmoji: Record<string, string> = {
  水稻: "🌾",
  小麦: "🌾",
  玉米: "🌽",
  大豆: "🫘",
  棉花: "☁️",
  油菜: "🌼",
  马铃薯: "🥔",
  甘蔗: "🎋",
}

const stageProgress: Record<string, number> = {
  播种期: 10,
  出苗期: 25,
  分蘖期: 40,
  拔节期: 55,
  抽穗期: 70,
  开花期: 80,
  灌浆期: 90,
  成熟期: 100,
}

export function FieldCard({
  field,
}: {
  field: {
    id: string
    name: string
    location: string
    areaMu: number
    cropType: string
    variety?: string | null
    growthStage: string
    riskLevel: string
  }
}) {
  const progress = stageProgress[field.growthStage] ?? 50

  return (
    <Link href={`/console/fields/${field.id}`} className="block">
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">{cropEmoji[field.cropType] ?? "🌱"}</span>
              {field.name}
            </CardTitle>
            <RiskBadge level={field.riskLevel} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            <span>{field.location}</span>
            <span className="ml-auto">{field.areaMu} 亩</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>生长阶段</span>
              <span>{field.growthStage}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {field.cropType}
            </Badge>
            {field.variety && (
              <Badge variant="outline" className="text-xs">
                {field.variety}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
