import { useEffect, useMemo, useState } from "react"
import { AppSidebar } from "~/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { useGetControlsData } from "~/hooks/use-get-controls-data"
import { useGetDeviceData } from "~/hooks/use-get-device-data"
import { useGetSettingsData } from "~/hooks/use-get-settings-data"
import type { SettingsData } from "~/types"
import { getDatabase, ref, set } from "firebase/database"
import { app } from "~/lib/firebase/init-firebase"

const defaultSettings: SettingsData = {
  activeInterval: 0,
  ecoInterval: 0,
  readInterval: 0,
  safeThreshold: 0,
  warningThreshold: 0,
}

const formatModeLabel = (mode?: string) => {
  if (!mode) return "Unknown"

  return mode.toUpperCase()
}

const getSwitchButtonClassName = (isOn: boolean) =>
  isOn
    ? "min-w-28 border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
    : "min-w-28 border-red-600 bg-red-600 text-white hover:bg-red-700 hover:text-white"

export default function SettingsPage() {
  const deviceData = useGetDeviceData()
  const controlsData = useGetControlsData()
  const settingsData = useGetSettingsData()
  const [draftSettings, setDraftSettings] =
    useState<SettingsData>(defaultSettings)

  useEffect(() => {
    setDraftSettings({
      activeInterval: settingsData.activeInterval ?? 0,
      ecoInterval: settingsData.ecoInterval ?? 0,
      readInterval: settingsData.readInterval ?? 0,
      safeThreshold: settingsData.safeThreshold ?? 0,
      warningThreshold: settingsData.warningThreshold ?? 0,
    })
  }, [settingsData])

  const isAutoMode = useMemo(
    () => deviceData.mode === "AUTO",
    [deviceData.mode]
  )

  const handleControlToggle = () => {
    const db = getDatabase(app)
    const nextValue = !controlsData.buzzer
    set(ref(db, `controls/buzzer`), nextValue)
  }

  const handleDeviceToggle = (field: "eco" | "mode") => {
    const db = getDatabase(app)

    if (field === "eco") {
      const nextValue = !deviceData.eco
      set(ref(db, `device/eco`), nextValue)
      return
    }

    const nextValue = deviceData.mode === "AUTO" ? "MANUAL" : "AUTO"
    set(ref(db, `device/mode`), nextValue)
  }

  const handleDraftChange = (field: keyof SettingsData, value: string) => {
    setDraftSettings((current) => ({
      ...current,
      [field]: Number(value),
    }))
  }

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
                  <BreadcrumbPage>Settings</BreadcrumbPage>
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
                  Settings Panel
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Kelola kontrol mode device, eco mode, dan buzzer dari satu
                  halaman yang rapi. Jika device berada di mode AUTO, form
                  manual akan otomatis dinonaktifkan.
                </p>
              </div>

              <div
                className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-medium ${
                  deviceData.mode === "AUTO"
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-700"
                    : "border-sky-500/20 bg-sky-500/10 text-sky-700"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${
                    deviceData.mode === "AUTO" ? "bg-amber-500" : "bg-sky-500"
                  }`}
                />
                {formatModeLabel(deviceData.mode)} Mode
              </div>
            </div>
          </div>

          <Card className="border-border/60 bg-background shadow-sm">
            <CardHeader>
              <CardTitle>Device Controls</CardTitle>
              <CardDescription>
                Panel operasional untuk mode device, eco mode dan buzzer.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Mode</p>
                  <p className="mt-1 text-lg font-medium">
                    {formatModeLabel(deviceData.mode)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={() => handleDeviceToggle("mode")}
                  className={getSwitchButtonClassName(
                    deviceData.mode === "AUTO"
                  )}
                >
                  {deviceData.mode === "AUTO" ? "Switch Off" : "Switch On"}
                </Button>
              </div>

              <div className="grid gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Eco Mode</p>
                  <p className="mt-1 text-lg font-medium">
                    {deviceData.eco ? "Aktif" : "Nonaktif"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={() => handleDeviceToggle("eco")}
                  className={getSwitchButtonClassName(deviceData.eco ?? false)}
                >
                  {deviceData.eco ? "Switch Off" : "Switch On"}
                </Button>
              </div>

              <div className="grid gap-3 rounded-xl border border-border/60 bg-muted/20 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Buzzer</p>
                  <p className="mt-1 text-lg font-medium">
                    {controlsData.buzzer ? "Aktif" : "Nonaktif"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleControlToggle}
                  className={getSwitchButtonClassName(
                    controlsData.buzzer ?? false
                  )}
                >
                  {controlsData.buzzer ? "Switch Off" : "Switch On"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background shadow-sm">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Semua data settings ditampilkan di sini. Jika mode device
                  AUTO, input manual akan dikunci.
                </CardDescription>
              </div>
              <div
                className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium ${
                  isAutoMode
                    ? "border-border/60 bg-muted/40 text-muted-foreground"
                    : "border-border/60 bg-muted/40 text-foreground"
                }`}
              >
                {isAutoMode ? "Locked by AUTO" : "Editable"}
              </div>
            </CardHeader>

            <CardContent>
              {isAutoMode ? (
                <div className="mb-4 rounded-xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                  Mode device sedang AUTO, sehingga semua input manual
                  dinonaktifkan.
                </div>
              ) : (
                <div className="mb-4 rounded-xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
                  Mode device tidak AUTO. Input manual bisa diisi.
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Active Interval
                  </span>
                  <Input
                    type="number"
                    value={draftSettings.activeInterval ?? 0}
                    onChange={(event) =>
                      handleDraftChange(
                        "activeInterval",
                        event.currentTarget.value
                      )
                    }
                    disabled={isAutoMode}
                    min={0}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Eco Interval
                  </span>
                  <Input
                    type="number"
                    value={draftSettings.ecoInterval ?? 0}
                    onChange={(event) =>
                      handleDraftChange(
                        "ecoInterval",
                        event.currentTarget.value
                      )
                    }
                    disabled={isAutoMode}
                    min={0}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Read Interval
                  </span>
                  <Input
                    type="number"
                    value={draftSettings.readInterval ?? 0}
                    onChange={(event) =>
                      handleDraftChange(
                        "readInterval",
                        event.currentTarget.value
                      )
                    }
                    disabled={isAutoMode}
                    min={0}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Safe Threshold
                  </span>
                  <Input
                    type="number"
                    value={draftSettings.safeThreshold ?? 0}
                    onChange={(event) =>
                      handleDraftChange(
                        "safeThreshold",
                        event.currentTarget.value
                      )
                    }
                    disabled={isAutoMode}
                    min={0}
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Warning Threshold
                  </span>
                  <Input
                    type="number"
                    value={draftSettings.warningThreshold ?? 0}
                    onChange={(event) =>
                      handleDraftChange(
                        "warningThreshold",
                        event.currentTarget.value
                      )
                    }
                    disabled={isAutoMode}
                    min={0}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
