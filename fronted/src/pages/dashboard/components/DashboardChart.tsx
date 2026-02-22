"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, LineChartIcon, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

const chartData = [
    { time: "00:00", temp: 22, hum: 60 },
    { time: "02:00", temp: 21.5, hum: 61 },
    { time: "04:00", temp: 21, hum: 62 },
    { time: "06:00", temp: 22, hum: 60 },
    { time: "08:00", temp: 23, hum: 58 },
    { time: "10:00", temp: 25, hum: 56 },
    { time: "12:00", temp: 26, hum: 55 },
    { time: "14:00", temp: 27.5, hum: 54 },
    { time: "16:00", temp: 27, hum: 53 },
    { time: "18:00", temp: 25, hum: 57 },
    { time: "20:00", temp: 24, hum: 59 },
    { time: "22:00", temp: 23, hum: 61 },
]

const chartConfig = {
    temp: {
        label: "Temperatura (°C)",
        color: "#ef4444",
    },
    hum: {
        label: "Humedad (%)",
        color: "#3b82f6",
    },
} satisfies ChartConfig

interface DashboardChartProps {
    timeRange?: string
}

export function DashboardChart({ timeRange = "24h" }: DashboardChartProps) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return

        const media = window.matchMedia("(max-width: 640px)")
        const onChange = () => setIsMobile(media.matches)
        onChange()

        const mediaAny = media as any

        if (typeof mediaAny.addEventListener === "function") {
            mediaAny.addEventListener("change", onChange)
            return () => mediaAny.removeEventListener?.("change", onChange)
        }

        // Legacy Safari fallback
        // eslint-disable-next-line deprecation/deprecation
        mediaAny.addListener?.(onChange)
        // eslint-disable-next-line deprecation/deprecation
        return () => mediaAny.removeListener?.(onChange)
    }, [])

    return (
        <Card className="min-w-0 overflow-x-hidden">
            <CardHeader>
                <CardTitle>Métricas del Sistema en Tiempo Real</CardTitle>
                <CardDescription>
                    Historial de temperatura y humedad de las últimas{" "}
                    {timeRange === "1h" ? "hora" : timeRange === "24h" ? "24 horas" : timeRange === "7d" ? "7 días" : "30 días"}
                </CardDescription>
            </CardHeader>
            <CardContent className="min-w-0 overflow-x-hidden">
                <Tabs defaultValue="line" className="w-full">
                    <TabsList className="grid w-full max-w-full grid-cols-3 mb-4">
                        <TabsTrigger value="line" className="flex items-center gap-2">
                            <LineChartIcon className="h-4 w-4" />
                            Línea
                        </TabsTrigger>
                        <TabsTrigger value="bar" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Barras
                        </TabsTrigger>
                        <TabsTrigger value="area" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Área
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="line" className="mt-0">
                        <ChartContainer config={chartConfig} className="h-[260px] w-full sm:h-[350px]">
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: isMobile ? 6 : 12,
                                    left: isMobile ? 0 : 12,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    tickLine={false}
                                    tickMargin={8}
                                    axisLine={false}
                                    fontSize={10}
                                    interval={isMobile ? 2 : 0}
                                    minTickGap={isMobile ? 12 : 24}
                                />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            formatter={(value, name) => {
                                                if (name === "temp") {
                                                    return [`${value}°C`, chartConfig.temp.label];
                                                }
                                                if (name === "hum") {
                                                    return [`${value}%`, chartConfig.hum.label];
                                                }
                                                return [value, name];
                                            }}
                                        />
                                    }
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="temp"
                                    stroke="var(--color-temp)"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="hum"
                                    stroke="var(--color-hum)"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </TabsContent>

                    <TabsContent value="bar" className="mt-0">
                        <ChartContainer config={chartConfig} className="h-[260px] w-full sm:h-[350px]">
                            <BarChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: isMobile ? 6 : 12,
                                    left: isMobile ? 0 : 12,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="time"
                                    tickLine={false}
                                    tickMargin={8}
                                    axisLine={false}
                                    fontSize={10}
                                    interval={isMobile ? 2 : 0}
                                    minTickGap={isMobile ? 12 : 24}
                                />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}`} />
                                <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="temp" fill="var(--color-temp)" radius={4} />
                                <Bar dataKey="hum" fill="var(--color-hum)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>

                    <TabsContent value="area" className="mt-0">
                        <ChartContainer config={chartConfig} className="h-[260px] w-full sm:h-[350px]">
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: isMobile ? 6 : 12,
                                    left: isMobile ? 0 : 12,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    tickLine={false}
                                    tickMargin={8}
                                    axisLine={false}
                                    fontSize={10}
                                    interval={isMobile ? 2 : 0}
                                    minTickGap={isMobile ? 12 : 24}
                                />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Area
                                    type="monotone"
                                    dataKey="temp"
                                    stroke="var(--color-temp)"
                                    fill="var(--color-temp)"
                                    fillOpacity={0.2}
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="hum"
                                    stroke="var(--color-hum)"
                                    fill="var(--color-hum)"
                                    fillOpacity={0.2}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
