
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, AlertCircle, Activity, CheckCircle2, Clock, Users } from "lucide-react"

const mockLogs = [
    {
        id: 1,
        timestamp: "2026-01-12 11:50:23",
        type: "info",
        user: "José Vera",
        action: "Actualizó configuración de sensor ESP32-001",
        ip: "192.168.1.105",
    },
    {
        id: 2,
        timestamp: "2026-01-12 11:45:12",
        type: "warning",
        user: "Sistema",
        action: "Sensor ESP32-003 señal baja detectada",
        ip: "N/A",
    },
    {
        id: 3,
        timestamp: "2026-01-12 11:30:45",
        type: "error",
        user: "Sistema",
        action: "Sensor ESP32-004 desconectado",
        ip: "N/A",
    },
    {
        id: 4,
        timestamp: "2026-01-12 11:15:33",
        type: "info",
        user: "María González",
        action: "Inició sesión desde nueva ubicación",
        ip: "192.168.1.87",
    },
    {
        id: 5,
        timestamp: "2026-01-12 10:55:18",
        type: "success",
        user: "Carlos Mendoza",
        action: "Exportó reporte de datos",
        ip: "192.168.1.56",
    },
]

export function LogsTab() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle>Registro de Actividad del Sistema</CardTitle>
                        <CardDescription>Auditoría completa de eventos y acciones</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[150px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                <SelectItem value="info">Información</SelectItem>
                                <SelectItem value="warning">Advertencias</SelectItem>
                                <SelectItem value="error">Errores</SelectItem>
                                <SelectItem value="success">Éxitos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="gap-2 bg-transparent">
                            <Download className="h-4 w-4" />
                            Exportar
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {mockLogs.map((log) => (
                        <div
                            key={log.id}
                            className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/5 transition-colors"
                        >
                            <div
                                className={`p-2 rounded-lg ${log.type === "success"
                                    ? "bg-green-500/10 text-green-500"
                                    : log.type === "warning"
                                        ? "bg-amber-500/10 text-amber-500"
                                        : log.type === "error"
                                            ? "bg-red-500/10 text-red-500"
                                            : "bg-blue-500/10 text-blue-500"
                                    }`}
                            >
                                {log.type === "success" ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : log.type === "warning" ? (
                                    <AlertCircle className="h-4 w-4" />
                                ) : log.type === "error" ? (
                                    <AlertCircle className="h-4 w-4" />
                                ) : (
                                    <Activity className="h-4 w-4" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-1">
                                    <p className="font-medium text-sm">{log.action}</p>
                                    <Badge variant="outline" className="text-xs shrink-0">
                                        {log.type}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {log.timestamp}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {log.user}
                                    </span>
                                    <span>IP: {log.ip}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Mostrando los últimos 50 eventos</p>
                    <Button variant="outline" size="sm">
                        Cargar más
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
