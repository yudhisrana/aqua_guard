import { useEffect, useState } from "react"
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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue } from "firebase/database"
import { app } from "~/lib/firebase/init-firebase"

type DeviceData = {
  eco?: boolean
  lastSeen?: number
  mode?: string
  online?: boolean
  sensorHeight?: number
}

const getDeviceData = (
  firebaseApp: ReturnType<typeof initializeApp>,
  onUpdate: (data: DeviceData) => void
) => {
  const db = getDatabase(firebaseApp)
  const deviceRef = ref(db, "device")

  return onValue(deviceRef, (snapshot) => {
    const data = snapshot.val() as DeviceData | null

    if (data) {
      onUpdate(data)
    }
  })
}

const formatLastSeen = (lastSeen?: number) => {
  if (lastSeen === 0 || lastSeen === undefined) return "-"

  const date = new Date(lastSeen)

  if (Number.isNaN(date.getTime())) return String(lastSeen)

  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default function DeviceInfoPage() {
  const [deviceData, setDeviceData] = useState<DeviceData>({
    eco: false,
    lastSeen: 0,
    mode: "-",
    online: false,
    sensorHeight: 0,
  })

  useEffect(() => {
    const unsubscribe = getDeviceData(
      app as ReturnType<typeof initializeApp>,
      (data) => {
        setDeviceData((current) => ({ ...current, ...data }))
      }
    )

    return () => {
      unsubscribe()
    }
  }, [])

  const cards = [
    {
      label: "Status Perangkat",
      value: deviceData.online ? "Online" : "Offline",
      description: deviceData.online
        ? "Device sedang mengirim data"
        : "Belum ada koneksi aktif",
      tone: deviceData.online
        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
        : "border-red-500/20 bg-red-500/10 text-red-700",
      spanClass: "xl:col-span-2",
    },
    {
      label: "Mode Operasi",
      value: deviceData.mode ?? "-",
      description: "Mode yang sedang digunakan perangkat",
      tone: "border-sky-500/20 bg-sky-500/10 text-sky-700",
      spanClass: "xl:col-span-2",
    },
    {
      label: "Eco Mode",
      value: deviceData.eco ? "Aktif" : "Nonaktif",
      description: "Penghematan daya perangkat",
      tone: deviceData.eco
        ? "border-amber-500/20 bg-amber-500/10 text-amber-700"
        : "border-zinc-500/20 bg-zinc-500/10 text-zinc-700",
      spanClass: "xl:col-span-2",
    },
    {
      label: "Sensor Height",
      value:
        typeof deviceData.sensorHeight === "number"
          ? `${deviceData.sensorHeight} cm`
          : "-",
      description: "Ketinggian sensor yang terdeteksi",
      tone: "border-violet-500/20 bg-violet-500/10 text-violet-700",
      spanClass: "xl:col-span-3",
    },
    {
      label: "Last Seen",
      value: formatLastSeen(deviceData.lastSeen),
      description: "Waktu terakhir perangkat mengirim data",
      tone: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700",
      spanClass: "xl:col-span-3",
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
                  Ringkasan realtime status device, mode operasi, eco mode,
                  ketinggian sensor, dan waktu terakhir update.
                </p>
              </div>
              <div
                className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-medium ${
                  deviceData.online
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                    : "border-red-500/20 bg-red-500/10 text-red-700"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${
                    deviceData.online ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {deviceData.online ? "Terhubung" : "Tidak terhubung"}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {cards.map((card) => (
              <Card
                key={card.label}
                className={`border-border/60 bg-background ${card.spanClass}`}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium ${card.tone}`}
                    >
                      {card.label}
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{card.value}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
