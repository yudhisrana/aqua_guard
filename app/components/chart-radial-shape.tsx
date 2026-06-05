"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { ChartContainer, type ChartConfig } from "~/components/ui/chart"

type ChartRadialShapeProps = {
  chartTitle: string
  chartDescription: string
  chartData: {
    name: string
    value: number
    fill?: string
  }[]
  chartConfig: ChartConfig
  displayValue?: number
  maxValue?: number
  centerLabel?: string
  footerPrimaryText?: string
  footerSecondaryText?: string
  displayLabel?: string
  footerPrimary?: string
  footerSecondary?: string
}

export function ChartRadialShape({
  chartTitle,
  chartDescription,
  chartConfig,
  chartData,
  maxValue,
  centerLabel,
  footerPrimaryText,
  footerSecondaryText,
}: ChartRadialShapeProps) {
  const radialMaxValue = Math.max(maxValue ?? 0, chartData[0]?.value ?? 0, 1)

  return (
    <Card className="flex h-full flex-col border-border/60 bg-background shadow-sm">
      <CardHeader className="items-start pb-0">
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>{chartDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig}>
          <RadialBarChart
            data={[
              // background full-scale ring
              {
                name: "max",
                value: radialMaxValue,
                fill: "rgba(148,163,184,0.12)",
              },
              // current value overlay
              {
                name: chartData[0]?.name ?? "value",
                value: chartData[0]?.value ?? 0,
                fill: chartData[0]?.fill ?? "var(--color-waterLevel)",
              },
            ]}
            startAngle={90}
            endAngle={-270}
            innerRadius={70}
            outerRadius={100}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[92, 78]}
            />
            <RadialBar dataKey="value" cornerRadius={999} />
            <PolarRadiusAxis
              domain={[0, radialMaxValue]}
              tick={false}
              tickLine={false}
              axisLine={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {(chartData[0]?.value ?? 0).toLocaleString("id-ID")}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {centerLabel ?? chartData[0]?.name}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {footerPrimaryText ?? "Data realtime dari perangkat"}
        </div>
        <div className="leading-none text-muted-foreground">
          {footerSecondaryText ??
            `Skala maksimum ${radialMaxValue.toLocaleString()}`}
        </div>
      </CardFooter>
    </Card>
  )
}
