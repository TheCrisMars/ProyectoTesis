
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wifi, MoreVertical, Settings, Power, Download, Trash2 } from "lucide-react"

const mockSensors = [
    {
        id: "ESP32-001",
        name: "Sensor Principal",
        location: "Laboratorio A",
        status: "online",
        temp: 24.5,
        hum: 65,
        signal: 92,
        uptime: "24h 12m",
        lastUpdate: "Hace 2 min",
    },
    {
        id: "ESP32-002",
        name: "Sensor Secundario",
        location: "Laboratorio B",
        status: "online",
        temp: 23.8,
        hum: 63,
        signal: 88,
        uptime: "12h 45m",
        lastUpdate: "Hace 1 min",
    },
    {
        id: "ESP32-003",
        name: "Sensor Externo",
        location: "Campus Norte",
        status: "warning",
        temp: 22.1,
        hum: 70,
        signal: 76,
        uptime: "3h 20m",
        lastUpdate: "Hace 5 min",
    },
    {
        id: "ESP32-004",
        name: "Sensor Respaldo",
        location: "Edificio C",
        status: "offline",
        temp: 0,
        hum: 0,
        signal: 0,
        uptime: "0h",
        lastUpdate: "Hace 2h",
    },
]

export function SensorsTab() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle>Gestión de Sensores ESP32</CardTitle>
                        <CardDescription>Monitorea y configura todos los dispositivos conectados</CardDescription>
                    </div>
                    <Button className="gap-2">
                        <Wifi className="h-4 w-4" />
                        Registrar Sensor
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {mockSensors.map((sensor) => (
                        <div
                            key={sensor.id}
                            className="p-4 rounded-lg border bg-gradient-to-br from-card to-accent/5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`p-3 rounded-full ${sensor.status === "online"
                                            ? "bg-green-500/10 text-green-500"
                                            : sensor.status === "warning"
                                                ? "bg-amber-500/10 text-amber-500"
                                                : "bg-red-500/10 text-red-500"
                                            }`}
                                    >
                                        <Wifi className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">{sensor.name}</h4>
                                        <p className="text-sm text-muted-foreground">{sensor.id}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Ubicación: {sensor.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            sensor.status === "online"
                                                ? "default"
                                                : sensor.status === "warning"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {sensor.status === "online"
                                            ? "En línea"
                                            : sensor.status === "warning"
                                                ? "Advertencia"
                                                : "Desconectado"}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="gap-2">
                                                <Settings className="h-4 w-4" />
                                                Configurar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2">
                                                <Power className="h-4 w-4" />
                                                Reiniciar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2">
                                                <Download className="h-4 w-4" />
                                                Exportar Datos
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2 text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {sensor.status !== "offline" ? (
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="p-3 rounded-lg bg-background/50 border">
                                        <p className="text-xs text-muted-foreground mb-1">Temperatura</p>
                                        <p className="text-2xl font-bold text-red-500">{sensor.temp}°C</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/50 border">
                                        <p className="text-xs text-muted-foreground mb-1">Humedad</p>
                                        <p className="text-2xl font-bold text-blue-500">{sensor.hum}%</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/50 border">
                                        <p className="text-xs text-muted-foreground mb-1">Señal</p>
                                        <p className="text-2xl font-bold text-green-500">{sensor.signal}%</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/50 border">
                                        <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                                        <p className="text-lg font-bold">{sensor.uptime}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-background/50 border">
                                        <p className="text-xs text-muted-foreground mb-1">Actualizado</p>
                                        <p className="text-lg font-bold">{sensor.lastUpdate}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                    <p className="text-sm">Sensor desconectado - Sin datos disponibles</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
