import { useEffect } from "react"
import { AppSidebar } from "~/components/app-sidebar"
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
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { useGetDeviceData } from "~/hooks/use-get-device-data"
import { useLogin } from "~/hooks/use-login"

const formatLastSeen = (lastSeen?: number) => {
  if (lastSeen === 0 || lastSeen === undefined) return "-"

  const date = new Date(lastSeen)

  if (Number.isNaN(date.getTime())) return String(lastSeen)

  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

const formatBoolean = (value?: boolean) => (value ? "Ya" : "Tidak")

const formatNumber = (value?: number, fractionDigits = 2) => {
  if (value === undefined || Number.isNaN(value)) return "-"
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

const isConnectedValue = (value?: string) =>
  Boolean(value && value.trim() !== "" && value !== "-")

export default function DeviceInfoPage() {
  const { isLoggedIn, isLoadingIn } = useLogin()

  useEffect(() => {
    if (isLoadingIn) return

    if (!isLoggedIn) {
      window.location.href = "/login"
    }
  }, [isLoggedIn, isLoadingIn])

  const deviceData = useGetDeviceData()
  const statusValue = deviceData.status?.activityState
  const isConnected = isConnectedValue(statusValue)

  const statusDetails = [
    {
      label: "Status Aktivitas",
      value: deviceData.status?.activityState ?? "-",
    },
    {
      label: "Persentase Baterai",
      value:
        deviceData.status?.batteryPercent === undefined
          ? "-"
          : `${deviceData.status.batteryPercent}%`,
    },
    {
      label: "Buzzer",
      value: formatBoolean(deviceData.status?.buzzerOn),
    },
    {
      label: "Override Buzzer",
      value: deviceData.status?.buzzerOverride ?? "-",
    },
    {
      label: "Jarak",
      value:
        deviceData.status?.distance === undefined
          ? "-"
          : `${formatNumber(deviceData.status.distance)} cm`,
    },
    {
      label: "Terakhir Terlihat",
      value: formatLastSeen(deviceData.status?.lastSeenAt),
    },
    {
      label: "LCD",
      value: formatBoolean(deviceData.status?.lcdOn),
    },
    {
      label: "Override LCD",
      value: deviceData.status?.lcdOverride ?? "-",
    },
    {
      label: "Mode",
      value: deviceData.status?.mode ?? "-",
    },
    {
      label: "Interval Baca",
      value:
        deviceData.status?.readInterval === undefined
          ? "-"
          : `${deviceData.status.readInterval} ms`,
    },
    {
      label: "Interval Laporan",
      value:
        deviceData.status?.reportInterval === undefined
          ? "-"
          : `${deviceData.status.reportInterval} ms`,
    },
    {
      label: "Ketinggian Air",
      value:
        deviceData.status?.waterLevel === undefined
          ? "-"
          : `${formatNumber(deviceData.status.waterLevel)} cm`,
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
                  <BreadcrumbPage>Device Info</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-linear-to-br from-background via-background to-muted/40 p-6 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-heading text-3xl font-semibold tracking-tight">
                  Informasi perangkat
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Ringkasan realtime status perangkat AquaGuard
                </p>
              </div>
              <div
                className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-medium ${
                  isConnected
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                    : "border-red-500/20 bg-red-500/10 text-red-700"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${
                    isConnected ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {isConnected ? "Terhubung" : "Tidak terhubung"}
              </div>
            </div>
          </div>

          <Card className="border-border/60 bg-background">
            <CardHeader>
              <CardTitle>Status Perangkat</CardTitle>
              <CardDescription>
                Detail lengkap dari status perangkat.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {statusDetails.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/60 bg-muted/30 p-4"
                >
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold wrap-break-word text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
