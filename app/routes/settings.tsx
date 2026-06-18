import React, { useEffect, useMemo, useState } from "react"
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
import { Card, CardContent } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { useGetSettingsData } from "~/hooks/use-get-settings-data"
import type { SettingsData } from "~/types"
import { getDatabase, ref, set } from "firebase/database"
import { app } from "~/lib/firebase/init-firebase"
import toast from "react-hot-toast"
import { LoaderCircle } from "lucide-react"
import { useLogin } from "~/hooks/use-login"

const formatModeLabel = (mode?: string) => {
  if (!mode) return "Unknown"

  return mode.toUpperCase()
}

const formatTimestamp = (ts?: number) => {
  if (!ts) return "-"
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return String(ts)
  return d.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
}
export default function SettingsPage() {
  const { isLoggedIn, isLoadingIn } = useLogin()

  useEffect(() => {
    if (isLoadingIn) return

    if (!isLoggedIn) {
      window.location.href = "/login"
    }
  }, [isLoggedIn, isLoadingIn])

  const [isLoading, setIsLoading] = React.useState(false)
  const settingsData = useGetSettingsData()
  const [draftConfig, setDraftConfig] = useState<SettingsData>(
    settingsData as SettingsData
  )

  useEffect(() => {
    setDraftConfig(settingsData as SettingsData)
  }, [settingsData])

  const mode = draftConfig.config?.mode ?? "AUTO"

  const canEditAdaptive = mode === "MANUAL_ADAPTIVE"
  const canEditFixed = mode === "MANUAL_FIXED"

  const handleConfigChange = (path: string[], value: any) => {
    setDraftConfig((current) => {
      const next = {
        ...(current ?? {}),
        config: { ...(current?.config ?? {}) },
      }
      let target: any = next.config
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i]
        target[key] = { ...(target[key] ?? {}) }
        target = target[key]
      }
      target[path[path.length - 1]] = value
      return next
    })
  }

  const handleSaveConfig = async () => {
    setIsLoading(true)
    try {
      const db = getDatabase(app)

      await Promise.all([
        set(ref(db, "devices/aquaguard-01/config"), draftConfig.config),
        set(ref(db, "devices/aquaguard-01/config/updatedAt"), Date.now()),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ])

      setIsLoading(false)
      toast.success("Konfigurasi berhasil disimpan!")
    } catch (error) {
      setIsLoading(false)
      toast.error("Gagal menyimpan konfigurasi.")
    }
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
                  Kelola kontrol perangkat, dan konfigurasi sistem.
                </p>
              </div>

              <div
                className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-medium ${
                  mode === "AUTO"
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-700"
                    : "border-sky-500/20 bg-sky-500/10 text-sky-700"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${mode === "AUTO" ? "bg-amber-500" : "bg-sky-500"}`}
                />
                {formatModeLabel(mode)} Mode
              </div>
            </div>
          </div>

          <Card className="border-border/60 bg-background shadow-sm">
            <CardContent>
              <div className="mb-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Mode konfigurasi</p>
                    <p className="mt-1 text-lg font-medium">{mode}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={mode === "AUTO" ? "default" : "outline"}
                      onClick={() => handleConfigChange(["mode"], "AUTO")}
                    >
                      AUTO
                    </Button>
                    <Button
                      variant={
                        mode === "MANUAL_ADAPTIVE" ? "default" : "outline"
                      }
                      onClick={() =>
                        handleConfigChange(["mode"], "MANUAL_ADAPTIVE")
                      }
                    >
                      MANUAL_ADAPTIVE
                    </Button>
                    <Button
                      variant={mode === "MANUAL_FIXED" ? "default" : "outline"}
                      onClick={() =>
                        handleConfigChange(["mode"], "MANUAL_FIXED")
                      }
                    >
                      MANUAL_FIXED
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                    <p className="text-sm font-medium">
                      Adaptive (read-only unless MANUAL_ADAPTIVE)
                    </p>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      <label className="space-y-1 text-sm">
                        <span className="text-muted-foreground">
                          Alert Read Interval (ms)
                        </span>
                        <Input
                          type="number"
                          value={
                            draftConfig.config?.adaptive?.alertReadInterval ?? 0
                          }
                          disabled={!canEditAdaptive}
                          onChange={(e) =>
                            handleConfigChange(
                              ["adaptive", "alertReadInterval"],
                              Number(e.currentTarget.value)
                            )
                          }
                        />
                      </label>
                      <label className="space-y-1 text-sm">
                        <span className="text-muted-foreground">
                          Alert Report Interval (ms)
                        </span>
                        <Input
                          type="number"
                          value={
                            draftConfig.config?.adaptive?.alertReportInterval ??
                            0
                          }
                          disabled={!canEditAdaptive}
                          onChange={(e) =>
                            handleConfigChange(
                              ["adaptive", "alertReportInterval"],
                              Number(e.currentTarget.value)
                            )
                          }
                        />
                      </label>
                      <label className="space-y-1 text-sm">
                        <span className="text-muted-foreground">
                          Low Power Read Interval (ms)
                        </span>
                        <Input
                          type="number"
                          value={
                            draftConfig.config?.adaptive
                              ?.lowPowerReadInterval ?? 0
                          }
                          disabled={!canEditAdaptive}
                          onChange={(e) =>
                            handleConfigChange(
                              ["adaptive", "lowPowerReadInterval"],
                              Number(e.currentTarget.value)
                            )
                          }
                        />
                      </label>
                      <label className="space-y-1 text-sm">
                        <span className="text-muted-foreground">
                          Low Power Report Interval (ms)
                        </span>
                        <Input
                          type="number"
                          value={
                            draftConfig.config?.adaptive
                              ?.lowPowerReportInterval ?? 0
                          }
                          disabled={!canEditAdaptive}
                          onChange={(e) =>
                            handleConfigChange(
                              ["adaptive", "lowPowerReportInterval"],
                              Number(e.currentTarget.value)
                            )
                          }
                        />
                      </label>
                      <label className="space-y-1 text-sm">
                        <span className="text-muted-foreground">
                          Monitoring Read Interval (ms)
                        </span>
                        <Input
                          type="number"
                          value={
                            draftConfig.config?.adaptive
                              ?.monitoringReadInterval ?? 0
                          }
                          disabled={!canEditAdaptive}
                          onChange={(e) =>
                            handleConfigChange(
                              ["adaptive", "monitoringReadInterval"],
                              Number(e.currentTarget.value)
                            )
                          }
                        />
                      </label>
                      <label className="space-y-1 text-sm">
                        <span className="text-muted-foreground">
                          Monitoring Report Interval (ms)
                        </span>
                        <Input
                          type="number"
                          value={
                            draftConfig.config?.adaptive
                              ?.monitoringReportInterval ?? 0
                          }
                          disabled={!canEditAdaptive}
                          onChange={(e) =>
                            handleConfigChange(
                              ["adaptive", "monitoringReportInterval"],
                              Number(e.currentTarget.value)
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                    <p className="text-sm font-medium">
                      Fixed (read-only unless MANUAL_FIXED)
                    </p>
                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      <label className="space-y-1 text-sm">
                        <span className="text-muted-foreground">
                          Read Interval (ms)
                        </span>
                        <Input
                          type="number"
                          value={draftConfig.config?.fixed?.readInterval ?? 0}
                          disabled={!canEditFixed}
                          onChange={(e) =>
                            handleConfigChange(
                              ["fixed", "readInterval"],
                              Number(e.currentTarget.value)
                            )
                          }
                        />
                      </label>
                      <label className="space-y-1 text-sm">
                        <span className="text-muted-foreground">
                          Report Interval (ms)
                        </span>
                        <Input
                          type="number"
                          value={draftConfig.config?.fixed?.reportInterval ?? 0}
                          disabled={!canEditFixed}
                          onChange={(e) =>
                            handleConfigChange(
                              ["fixed", "reportInterval"],
                              Number(e.currentTarget.value)
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Beep Interval (ms)
                    </span>
                    <Input
                      type="number"
                      value={draftConfig.config?.beepInterval ?? 0}
                      onChange={(e) =>
                        handleConfigChange(
                          ["beepInterval"],
                          Number(e.currentTarget.value)
                        )
                      }
                      min={0}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Buzzer Override
                    </span>
                    <select
                      className="h-9 w-full rounded-4xl border border-input bg-input/30 px-3 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                      value={draftConfig.config?.buzzerOverride ?? "AUTO"}
                      onChange={(e) =>
                        handleConfigChange(
                          ["buzzerOverride"],
                          e.currentTarget.value
                        )
                      }
                    >
                      <option value="AUTO">AUTO</option>
                      <option value="ON">ON</option>
                      <option value="OFF">OFF</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      LCD Override
                    </span>
                    <select
                      className="h-9 w-full rounded-4xl border border-input bg-input/30 px-3 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                      value={draftConfig.config?.lcdOverride ?? "AUTO"}
                      onChange={(e) =>
                        handleConfigChange(
                          ["lcdOverride"],
                          e.currentTarget.value
                        )
                      }
                    >
                      <option value="AUTO">AUTO</option>
                      <option value="ON">ON</option>
                      <option value="OFF">OFF</option>
                    </select>
                  </label>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Safe Threshold
                    </span>
                    <Input
                      type="number"
                      value={draftConfig.config?.safeThreshold ?? 0}
                      onChange={(e) =>
                        handleConfigChange(
                          ["safeThreshold"],
                          Number(e.currentTarget.value)
                        )
                      }
                      min={0}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Warning Threshold
                    </span>
                    <Input
                      type="number"
                      value={draftConfig.config?.warningThreshold ?? 0}
                      onChange={(e) =>
                        handleConfigChange(
                          ["warningThreshold"],
                          Number(e.currentTarget.value)
                        )
                      }
                      min={0}
                    />
                  </label>
                </div>

                <div className="mt-6 flex items-center justify-between gap-2">
                  <div className="">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Updated At
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {formatTimestamp(settingsData.config?.updatedAt)}
                    </p>
                  </div>

                  <Button onClick={handleSaveConfig} disabled={isLoading}>
                    {isLoading && (
                      <LoaderCircle className="mr-2 size-4 animate-spin" />
                    )}
                    {isLoading ? "Menyimpan..." : "Simpan Konfigurasi"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
