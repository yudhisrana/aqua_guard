"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceLine,
  LabelList,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart"

export const description = "A line chart with a label"

type ChartLineLabelProps = {
  chartTitle: string
  chartDescription: string
  chartData: Array<{
    snapshot: string
    waterLevel: number
    safeThreshold: number
    warningThreshold: number
  }>
  chartConfig: ChartConfig
  footerPrimaryText?: string
  footerSecondaryText?: string
}

export function ChartLineLabel({
  chartTitle,
  chartDescription,
  chartData,
  chartConfig,
  footerPrimaryText,
  footerSecondaryText,
}: ChartLineLabelProps) {
  return (
    <Card className="border-border/60 bg-background shadow-sm">
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>{chartDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 22,
              left: 4,
              right: 12,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            {/* line with point labels */}
            <XAxis
              dataKey="snapshot"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelKey="snapshot"
                  nameKey="waterLevel"
                  formatter={(value) =>
                    typeof value === "number"
                      ? new Intl.NumberFormat("id-ID").format(value)
                      : String(value)
                  }
                />
              }
            />
            <Line
              dataKey="waterLevel"
              type="natural"
              stroke="var(--color-waterLevel)"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="waterLevel"
                position="top"
                offset={8}
                className="fill-foreground"
              />
            </Line>
            {/* Draw threshold reference lines using last-known threshold values */}
            {chartData?.length > 0 && (
              <>
                <ReferenceLine
                  y={chartData[chartData.length - 1].safeThreshold}
                  stroke="var(--color-safeThreshold)"
                  strokeDasharray="6 6"
                />
                <ReferenceLine
                  y={chartData[chartData.length - 1].warningThreshold}
                  stroke="var(--color-warningThreshold)"
                  strokeDasharray="3 6"
                />
              </>
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="leading-none font-medium text-foreground">
          {footerPrimaryText ?? "Trend realtime perangkat"}
        </div>
        <div className="leading-none text-muted-foreground">
          {footerSecondaryText ??
            "Water level dibanding threshold aman dan waspada."}
        </div>
      </CardFooter>
    </Card>
  )
}
