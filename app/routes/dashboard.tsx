import { useEffect } from "react"
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
import type { ChartConfig } from "~/components/ui/chart"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue } from "firebase/database"
import { app } from "~/lib/firebase/init-firebase"

const labelChartRadialShape = {
  chartTitle: "Water Level",
  chartDescription: "January - June 2024",
}

const waterLevelData = [
  { name: "water level", value: 1260, fill: "var(--color-name)" },
]

const waterLevelDataConfig = {
  value: {
    label: "Value",
  },
  name: {
    label: "Water Level",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const getDeviceData = (firebaseApp: ReturnType<typeof initializeApp>) => {
  const db = getDatabase(firebaseApp)
  const deviceRef = ref(db, "device")

  return onValue(deviceRef, (snapshot) => {
    const data = snapshot.val()
    console.log("[device] realtime data:", data)
  })
}

export default function Page() {
  useEffect(() => {
    const unsubscribe = getDeviceData(app as ReturnType<typeof initializeApp>)

    return () => unsubscribe()
  }, [])

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
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="aspect-video rounded-xl bg-muted/50">
              {/* Level Air */}
              <ChartRadialShape
                chartTitle={labelChartRadialShape.chartTitle}
                chartDescription={labelChartRadialShape.chartDescription}
                chartData={waterLevelData}
                chartConfig={waterLevelDataConfig}
              />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
              {/* Curah Hujan */}
              <ChartLineLabel />
            </div>
          </div>
          <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
