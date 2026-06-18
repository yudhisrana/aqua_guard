import { useEffect, useMemo, useState } from "react"
import { AppSidebar } from "~/components/app-sidebar"
import { ChartLineLabel } from "~/components/chart-line-label"
import { ChartRadialShape } from "~/components/chart-radial-shape"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import type { ChartConfig } from "~/components/ui/chart"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { useGetDeviceData } from "~/hooks/use-get-device-data"
import { useGetSettingsData } from "~/hooks/use-get-settings-data"
import { useLogin } from "~/hooks/use-login"

type WaterTrendPoint = {
  snapshot: string
  waterLevel: number
  safeThreshold: number
  warningThreshold: number
}

const formatValue = (value?: number) =>
  value === undefined ? "-" : new Intl.NumberFormat("id-ID").format(value)

const formatTime = (value?: number) => {
  if (!value || value <= 0) return "-"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "-"

  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

const radialChartConfig = {
  waterLevel: {
    label: "Water Level",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const trendChartConfig = {
  waterLevel: {
    label: "Water Level",
    color: "var(--chart-2)",
  },
  safeThreshold: {
    label: "Safe Threshold",
    color: "var(--chart-3)",
  },
  warningThreshold: {
    label: "Warning Threshold",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export default function Page() {
  const { isLoggedIn, isLoadingIn } = useLogin()

  useEffect(() => {
    if (isLoadingIn) return

    if (!isLoggedIn) {
      window.location.href = "/login"
    }
  }, [isLoggedIn, isLoadingIn])

  const deviceData = useGetDeviceData()
  const settingsData = useGetSettingsData()
  const [waterTrend, setWaterTrend] = useState<WaterTrendPoint[]>([])

  const sensorHeight = deviceData.status?.sensorHeight
  const distance = deviceData.status?.distance
  const reportedWaterLevel = deviceData.status?.waterLevel ?? 0
  const waterLevel = useMemo(() => {
    if (sensorHeight !== undefined && distance !== undefined) {
      return Math.max(sensorHeight - distance, 0)
    }

    return reportedWaterLevel
  }, [distance, reportedWaterLevel, sensorHeight])
  const batteryPercent = deviceData.status?.batteryPercent ?? 0
  const safeThreshold = settingsData.config?.safeThreshold ?? 0
  const warningThreshold = settingsData.config?.warningThreshold ?? 0
  const currentMode = settingsData.config?.mode ?? "AUTO"
  const lastSeenAt = deviceData.status?.lastSeenAt ?? 0

  const waterStatus = useMemo(() => {
    const levelFromSensorHeight =
      sensorHeight !== undefined && distance !== undefined
        ? Math.max(sensorHeight - distance, 0)
        : reportedWaterLevel

    if (safeThreshold > 0 && levelFromSensorHeight >= safeThreshold) {
      return {
        label: "Waspada",
        tone: "border-amber-500/20 bg-amber-500/10 text-amber-700",
      }
    }

    if (warningThreshold > 0 && levelFromSensorHeight >= warningThreshold) {
      return {
        label: "Bahaya",
        tone: "border-red-500/20 bg-red-500/10 text-red-700",
      }
    }

    return {
      label: "Aman",
      tone: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    }
  }, [
    distance,
    reportedWaterLevel,
    safeThreshold,
    sensorHeight,
    warningThreshold,
  ])

  const radialMaxValue = Math.max(
    sensorHeight ?? 0,
    safeThreshold,
    warningThreshold,
    waterLevel,
    1
  )

  useEffect(() => {
    if (lastSeenAt <= 0) return

    const snapshot: WaterTrendPoint = {
      snapshot: new Date(lastSeenAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      waterLevel,
      safeThreshold,
      warningThreshold,
    }

    setWaterTrend((current) => {
      const last = current[current.length - 1]

      if (
        last &&
        last.waterLevel === snapshot.waterLevel &&
        last.safeThreshold === snapshot.safeThreshold &&
        last.warningThreshold === snapshot.warningThreshold
      ) {
        return current
      }

      return [...current, snapshot].slice(-8)
    })
  }, [lastSeenAt, safeThreshold, warningThreshold, waterLevel])

  const trendData =
    waterTrend.length > 0
      ? waterTrend
      : [
          {
            snapshot: "Now",
            waterLevel,
            safeThreshold,
            warningThreshold,
          },
        ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">AquaGuard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-background via-background to-muted/40 p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-heading text-3xl font-semibold tracking-tight">
                  Dashboard Monitoring
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Ringkasan realtime untuk water level, threshold, dan status
                  perangkat.
                </p>
              </div>
              <div
                className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-medium ${waterStatus.tone}`}
              >
                <span
                  className={`size-2 rounded-full ${
                    waterStatus.label === "Bahaya"
                      ? "bg-red-500"
                      : waterStatus.label === "Waspada"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                />
                {waterStatus.label}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="border-border/60 bg-background shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Water Level</CardDescription>
                <CardTitle className="text-2xl">
                  {formatValue(waterLevel)} cm
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Ketinggian Sensor: {formatValue(radialMaxValue)} cm
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-background shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Status Air</CardDescription>
                <CardTitle className="text-2xl">{waterStatus.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Batas Aman {"< "} {formatValue(safeThreshold)} cm <br />
                Batas Peringatan {"< "} {formatValue(warningThreshold)} cm
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-background shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Baterai</CardDescription>
                <CardTitle className="text-2xl">
                  {formatValue(batteryPercent)}%
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Sisa daya perangkat saat ini
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-background shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Mode & Terakhir Terlihat</CardDescription>
                <CardTitle className="text-2xl">{currentMode}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {formatTime(lastSeenAt)} <br />
                Jarak {formatValue(distance)} cm
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.95fr_1.4fr]">
            <ChartRadialShape
              chartTitle="Water Level Gauge"
              chartDescription="Snapshot terakhir dibanding threshold realtime"
              chartData={[
                {
                  name: "Water Level",
                  value: waterLevel,
                  fill: "var(--color-waterLevel)",
                },
              ]}
              chartConfig={radialChartConfig}
              maxValue={radialMaxValue}
              centerLabel="cm"
              footerPrimaryText={`Status ${waterStatus.label} · ${formatValue(waterLevel)} cm`}
              footerSecondaryText={`Safe ${formatValue(safeThreshold)} cm · Warning ${formatValue(warningThreshold)} cm`}
            />

            <ChartLineLabel
              chartTitle="Water Level Trend"
              chartDescription="8 pembacaan terakhir dengan garis threshold aman dan waspada"
              chartData={trendData}
              chartConfig={trendChartConfig}
              footerPrimaryText={`Pembaruan terakhir ${formatTime(lastSeenAt)}`}
              footerSecondaryText={`Mode ${currentMode} · ${waterStatus.label}`}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
