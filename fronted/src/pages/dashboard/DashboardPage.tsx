"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Activity,
    Thermometer,
    Droplets,
    Server,
    Wifi,
    Power,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Clock,
    Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardChart } from "./components/DashboardChart"
import { IrrigationPanel } from "./components/IrrigationPanel"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"

const temperatureSparkline = [22, 21, 23, 24, 26, 27, 25, 24]
const humiditySparkline = [60, 62, 58, 57, 55, 53, 56, 59]
const latencySparkline = [45, 52, 48, 50, 47, 49, 51, 48]

export function DashboardPage() {
    const [timeRange, setTimeRange] = useState("24h")
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate("/admin/dashboard");
        }
    }, [user, navigate]);

    const systems = [
        { name: "Modulo ESP32 Principal", status: "online", uptime: "24h 12m" },
        { name: "Servidor Backend", status: "online", uptime: "99.9%" },
        { name: "Base de Datos", status: "online", uptime: "100%" },
        { name: "Sensores de Humedad", status: "offline", uptime: "0h" },
    ]

    const alerts = [
        { id: 1, type: "warning", message: "Sensor de humedad desconectado", time: "Hace 5 min", icon: AlertTriangle },
        { id: 2, type: "info", message: "Actualización de firmware disponible", time: "Hace 1 hora", icon: Server },
    ]

    const sensorReadings = [
        { id: "ESP32-001", name: "Sensor Principal", temp: 24.5, hum: 65, signal: 92, status: "online" },
        { id: "ESP32-002", name: "Sensor Secundario", temp: 23.8, hum: 63, signal: 88, status: "online" },
        { id: "ESP32-003", name: "Sensor Externo", temp: 22.1, hum: 70, signal: 76, status: "online" },
        { id: "ESP32-004", name: "Sensor Respaldo", temp: 0, hum: 0, signal: 0, status: "offline" },
    ]

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Panel de Control IoT
                    </h1>
                    <p className="text-muted-foreground mt-1">Monitoreo en tiempo real de los sistemas ESP32</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1h">Última hora</SelectItem>
                            <SelectItem value="24h">Últimas 24h</SelectItem>
                            <SelectItem value="7d">Últimos 7 días</SelectItem>
                            <SelectItem value="30d">Últimos 30 días</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button>
                        <Activity className="mr-2 h-4 w-4" /> Generar Reporte
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-2xl" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Temperatura Promedio</CardTitle>
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <Thermometer className="h-4 w-4 text-red-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">24.5°C</div>
                        <div className="flex items-center gap-2 mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <p className="text-xs text-muted-foreground">+2.1% desde la última hora</p>
                        </div>
                        <div className="mt-4 flex items-end gap-1 h-8">
                            {temperatureSparkline.map((value, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-red-500/80 to-red-300/60 rounded-sm"
                                    style={{ height: `${(value / Math.max(...temperatureSparkline)) * 100}%` }}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Humedad Ambiente</CardTitle>
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Droplets className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">65%</div>
                        <div className="flex items-center gap-2 mt-1">
                            <TrendingDown className="h-3 w-3 text-red-500" />
                            <p className="text-xs text-muted-foreground">-1.2% desde la última hora</p>
                        </div>
                        <div className="mt-4 flex items-end gap-1 h-8">
                            {humiditySparkline.map((value, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-blue-500/80 to-blue-300/60 rounded-sm"
                                    style={{ height: `${(value / Math.max(...humiditySparkline)) * 100}%` }}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sensores Activos</CardTitle>
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <Wifi className="h-4 w-4 text-amber-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">3/4</div>
                        <p className="text-xs text-muted-foreground mt-1">1 sensor desconectado</p>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Conectividad</span>
                                <span className="font-medium">75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Latencia de Red</CardTitle>
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Zap className="h-4 w-4 text-green-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">48ms</div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-xs text-muted-foreground">Óptimo</p>
                        </div>
                        <div className="mt-4 flex items-end gap-1 h-8">
                            {latencySparkline.map((value, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-green-500/80 to-green-300/60 rounded-sm"
                                    style={{ height: `${(value / Math.max(...latencySparkline)) * 100}%` }}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <DashboardChart timeRange={timeRange} />
                </div>

                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Alertas y Actividad
                        </CardTitle>
                        <CardDescription>Notificaciones recientes del sistema</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                            >
                                <div
                                    className={`p-2 h-fit rounded-lg ${alert.type === "warning" ? "bg-amber-500/10" : "bg-blue-500/10"}`}
                                >
                                    <alert.icon className={`h-4 w-4 ${alert.type === "warning" ? "text-amber-500" : "text-blue-500"}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{alert.message}</p>
                                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {alert.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full bg-transparent">
                            Ver todas las alertas
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <IrrigationPanel />

            <Card>
                <CardHeader>
                    <CardTitle>Lecturas Individuales de Sensores</CardTitle>
                    <CardDescription>Monitoreo detallado de cada dispositivo ESP32</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {sensorReadings.map((sensor) => (
                            <div
                                key={sensor.id}
                                className="p-4 rounded-lg border bg-gradient-to-br from-card to-accent/5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold">{sensor.name}</h4>
                                        <p className="text-xs text-muted-foreground">{sensor.id}</p>
                                    </div>
                                    <Badge variant={sensor.status === "online" ? "default" : "destructive"}>
                                        {sensor.status === "online" ? "En línea" : "Desconectado"}
                                    </Badge>
                                </div>

                                {sensor.status === "online" ? (
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <div className="text-2xl font-bold text-red-500">{sensor.temp}°C</div>
                                            <p className="text-xs text-muted-foreground">Temperatura</p>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-blue-500">{sensor.hum}%</div>
                                            <p className="text-xs text-muted-foreground">Humedad</p>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-green-500">{sensor.signal}%</div>
                                            <p className="text-xs text-muted-foreground">Señal</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-muted-foreground">Sin datos disponibles</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Estado de Componentes del Sistema</CardTitle>
                    <CardDescription>Vista detallada de la conectividad y uptime de los módulos</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {systems.map((sys) => (
                            <div
                                key={sys.name}
                                className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-card to-accent/5 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-full ${sys.status === "online" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                                    >
                                        <Power className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{sys.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">Uptime: {sys.uptime}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant={sys.status === "online" ? "default" : "destructive"} className="uppercase">
                                        {sys.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
