"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const windLevelOptions = [
  { value: "无风", label: "无风" },
  { value: "微风", label: "微风" },
  { value: "和风", label: "和风" },
  { value: "劲风", label: "劲风" },
  { value: "强风", label: "强风" },
]

const weatherTrendOptions = [
  { value: "晴", label: "晴" },
  { value: "多云", label: "多云" },
  { value: "阴", label: "阴" },
  { value: "小雨", label: "小雨" },
  { value: "中雨", label: "中雨" },
  { value: "大雨", label: "大雨" },
  { value: "高温", label: "高温" },
  { value: "低温", label: "低温" },
]

const nutrientLevelOptions = [
  { value: "低", label: "低" },
  { value: "正常", label: "正常" },
  { value: "高", label: "高" },
]

const leafColorOptions = [
  { value: "偏黄", label: "偏黄" },
  { value: "正常", label: "正常" },
  { value: "深绿", label: "深绿" },
]

const growthStatusOptions = [
  { value: "偏弱", label: "偏弱" },
  { value: "正常", label: "正常" },
  { value: "旺盛", label: "旺盛" },
]

const emptyForm = {
  temperatureC: "",
  rainfallMm: "",
  windLevel: "",
  weatherTrend: "",
  soilMoisturePercent: "",
  soilTemperatureC: "",
  soilPh: "",
  nitrogenLevel: "",
  phosphorusLevel: "",
  potassiumLevel: "",
  plantHeightCm: "",
  leafColor: "",
  growthStatus: "",
  pestDescription: "",
  diseaseDescription: "",
  weedDescription: "",
  lastIrrigationDate: "",
  lastFertilizationDate: "",
  lastPesticideDate: "",
  notes: "",
}

function formatDemoDate(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function getDemoData() {
  return {
    temperatureC: "34",
    rainfallMm: "2",
    windLevel: "微风",
    weatherTrend: "晴",
    soilMoisturePercent: "38",
    soilTemperatureC: "25",
    soilPh: "6.8",
    nitrogenLevel: "低",
    phosphorusLevel: "正常",
    potassiumLevel: "正常",
    plantHeightCm: "65",
    leafColor: "深绿",
    growthStatus: "正常",
    pestDescription: "少量虫咬叶片",
    diseaseDescription: "",
    weedDescription: "田埂有少量杂草",
    lastIrrigationDate: formatDemoDate(7),
    lastFertilizationDate: formatDemoDate(14),
    lastPesticideDate: formatDemoDate(3),
    notes: "",
  }
}

interface FormErrors {
  temperatureC?: string
  rainfallMm?: string
  soilMoisturePercent?: string
  growthStatus?: string
}

export default function ObservationInputPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [fieldName, setFieldName] = useState("")
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/fields/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setFieldName(data.field?.name ?? "")
      })
      .catch(() => setFieldName(""))
      .finally(() => setPageLoading(false))
  }, [id])

  function setField(key: string, value: string | null) {
    setForm((prev) => ({ ...prev, [key]: value ?? "" }))
    setErrors((prev) => {
      if (prev[key as keyof FormErrors]) {
        const next = { ...prev }
        delete next[key as keyof FormErrors]
        return next
      }
      return prev
    })
  }

  function handleDemoFill() {
    setForm(getDemoData())
    setErrors({})
  }

  function handleClear() {
    setForm(emptyForm)
    setErrors({})
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.temperatureC || form.temperatureC.trim() === "") {
      e.temperatureC = "请输入当前温度"
    }
    if (!form.rainfallMm || form.rainfallMm.trim() === "") {
      e.rainfallMm = "请输入降雨量"
    }
    if (!form.soilMoisturePercent || form.soilMoisturePercent.trim() === "") {
      e.soilMoisturePercent = "请输入土壤墒情"
    }
    if (!form.growthStatus) {
      e.growthStatus = "请选择长势"
    }
    return e
  }

  async function handleSubmit() {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const res = await fetch(`/api/fields/${id}/observations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error("保存失败: " + (data.message || "未知错误"))
        return
      }
      toast.success("观测数据保存成功")
      router.push(`/console/fields/${id}/analysis`)
    } catch {
      toast.error("保存失败: 网络错误")
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const steps = [
    { icon: "🌤️", title: "天气信息" },
    { icon: "🧪", title: "土壤信息" },
    { icon: "🌱", title: "苗情与病虫草害" },
    { icon: "📋", title: "农事记录" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">观测数据录入</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          {fieldName || "示范地块"} — 录入观测数据
        </h1>
      </div>

      <div className="flex items-center justify-center gap-4 border-b pb-4 overflow-x-auto flex-nowrap">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">{step.icon}</span>
              <span className="font-medium text-muted-foreground hidden sm:inline">
                {step.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="mx-1 text-muted-foreground/40">→</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={handleDemoFill}>
          一键填入示范值
        </Button>
        <Button variant="ghost" onClick={handleClear}>
          清空表单
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🌤️</span>
            天气信息
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                当前温度 <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                value={form.temperatureC}
                onChange={(e) => setField("temperatureC", e.target.value)}
                placeholder="℃"
              />
              {errors.temperatureC && (
                <p className="text-xs text-destructive">{errors.temperatureC}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                近24小时降雨 <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                value={form.rainfallMm}
                onChange={(e) => setField("rainfallMm", e.target.value)}
                placeholder="mm"
              />
              {errors.rainfallMm && (
                <p className="text-xs text-destructive">{errors.rainfallMm}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">风力等级</label>
              <Select
                value={form.windLevel}
                onValueChange={(v) => setField("windLevel", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择风力" />
                </SelectTrigger>
                <SelectContent>
                  {windLevelOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">天气趋势</label>
              <Select
                value={form.weatherTrend}
                onValueChange={(v) => setField("weatherTrend", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择天气趋势" />
                </SelectTrigger>
                <SelectContent>
                  {weatherTrendOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🧪</span>
            土壤信息
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                土壤墒情 <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                value={form.soilMoisturePercent}
                onChange={(e) => setField("soilMoisturePercent", e.target.value)}
                placeholder="%"
              />
              {errors.soilMoisturePercent && (
                <p className="text-xs text-destructive">{errors.soilMoisturePercent}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">土壤温度</label>
              <Input
                type="number"
                value={form.soilTemperatureC}
                onChange={(e) => setField("soilTemperatureC", e.target.value)}
                placeholder="℃"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">土壤pH</label>
              <Input
                type="number"
                step="0.1"
                value={form.soilPh}
                onChange={(e) => setField("soilPh", e.target.value)}
                placeholder="6.0-8.0"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">氮素水平</label>
              <Select
                value={form.nitrogenLevel}
                onValueChange={(v) => setField("nitrogenLevel", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择氮素水平" />
                </SelectTrigger>
                <SelectContent>
                  {nutrientLevelOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">磷素水平</label>
              <Select
                value={form.phosphorusLevel}
                onValueChange={(v) => setField("phosphorusLevel", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择磷素水平" />
                </SelectTrigger>
                <SelectContent>
                  {nutrientLevelOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">钾素水平</label>
              <Select
                value={form.potassiumLevel}
                onValueChange={(v) => setField("potassiumLevel", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择钾素水平" />
                </SelectTrigger>
                <SelectContent>
                  {nutrientLevelOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            苗情与病虫草害
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">株高</label>
              <Input
                type="number"
                value={form.plantHeightCm}
                onChange={(e) => setField("plantHeightCm", e.target.value)}
                placeholder="cm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">叶色</label>
              <Select
                value={form.leafColor}
                onValueChange={(v) => setField("leafColor", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择叶色" />
                </SelectTrigger>
                <SelectContent>
                  {leafColorOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                长势 <span className="text-destructive">*</span>
              </label>
              <Select
                value={form.growthStatus}
                onValueChange={(v) => setField("growthStatus", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择长势" />
                </SelectTrigger>
                <SelectContent>
                  {growthStatusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.growthStatus && (
                <p className="text-xs text-destructive">{errors.growthStatus}</p>
              )}
            </div>
            <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium">虫害描述</label>
              <Textarea
                value={form.pestDescription}
                onChange={(e) => setField("pestDescription", e.target.value)}
                placeholder="描述虫害情况..."
                rows={2}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium">病害描述</label>
              <Textarea
                value={form.diseaseDescription}
                onChange={(e) => setField("diseaseDescription", e.target.value)}
                placeholder="描述病害情况..."
                rows={2}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium">杂草描述</label>
              <Textarea
                value={form.weedDescription}
                onChange={(e) => setField("weedDescription", e.target.value)}
                placeholder="描述杂草情况..."
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            农事记录
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">上次灌溉日期</label>
              <Input
                type="date"
                value={form.lastIrrigationDate}
                onChange={(e) => setField("lastIrrigationDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">上次施肥日期</label>
              <Input
                type="date"
                value={form.lastFertilizationDate}
                onChange={(e) => setField("lastFertilizationDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">上次施药日期</label>
              <Input
                type="date"
                value={form.lastPesticideDate}
                onChange={(e) => setField("lastPesticideDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-sm font-medium">备注</label>
              <Textarea
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="其他备注信息..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button onClick={handleSubmit} disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              保存中...
            </>
          ) : (
            "提交"
          )}
        </Button>
      </div>
    </div>
  )
}
