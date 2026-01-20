"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"

interface UserStatsChartProps {
    users: any[];
}

export function UserStatsChart({ users }: UserStatsChartProps) {
    const chartData = useMemo(() => {
        const adminCount = users.filter(u => u.role === "admin").length;
        const userCount = users.filter(u => u.role === "user").length;
        const activeCount = users.filter(u => u.is_active).length;
        const inactiveCount = users.filter(u => !u.is_active).length;

        return [
            { category: "Roles", admins: adminCount, users: userCount },
            { category: "Estado", active: activeCount, inactive: inactiveCount }
        ];
    }, [users]);

    const chartConfig = {
        admins: {
            label: "Administradores",
            color: "hsl(var(--primary))",
        },
        users: {
            label: "Usuarios",
            color: "hsl(var(--muted-foreground))",
        },
        active: {
            label: "Activos",
            color: "#22c55e",
        },
        inactive: {
            label: "Inactivos",
            color: "#ef4444",
        },
    } satisfies ChartConfig

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Estadísticas de Usuarios</CardTitle>
                <CardDescription>Resumen de roles y estados de cuentas</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="admins" fill="var(--color-admins)" radius={4} stackId="a" />
                        <Bar dataKey="users" fill="var(--color-users)" radius={4} stackId="a" />
                        <Bar dataKey="active" fill="var(--color-active)" radius={4} stackId="b" />
                        <Bar dataKey="inactive" fill="var(--color-inactive)" radius={4} stackId="b" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
