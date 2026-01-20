
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Bell, Clock } from "lucide-react"

const mockAlerts = [
    {
        id: 1,
        type: "critical",
        title: "Sensor ESP32-004 Desconectado",
        message: "No se ha recibido datos en las últimas 2 horas",
        time: "Hace 5 min",
    },
    {
        id: 2,
        type: "warning",
        title: "Señal Débil Detectada",
        message: "ESP32-003 tiene señal inferior al 80%",
        time: "Hace 15 min",
    },
    {
        id: 3,
        type: "info",
        title: "Actualización Disponible",
        message: "Nueva versión de firmware para ESP32",
        time: "Hace 1 hora",
    },
]

export function AlertsTab() {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-amber-500" />
                        Alertas Activas
                    </CardTitle>
                    <CardDescription>Notificaciones que requieren atención</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mockAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`p-4 rounded-lg border-l-4 ${alert.type === "critical"
                                ? "border-l-red-500 bg-red-500/5"
                                : alert.type === "warning"
                                    ? "border-l-amber-500 bg-amber-500/5"
                                    : "border-l-blue-500 bg-blue-500/5"
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold">{alert.title}</h4>
                                <Badge variant={alert.type === "critical" ? "destructive" : "secondary"} className="shrink-0">
                                    {alert.type === "critical" ? "Crítico" : alert.type === "warning" ? "Advertencia" : "Info"}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {alert.time}
                                </span>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                                        Resolver
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                                        Ver detalles
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Configuración de Alertas</CardTitle>
                    <CardDescription>Define umbrales y notificaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Temperatura Alta</Label>
                                <p className="text-sm text-muted-foreground">Alertar cuando supere los 30°C</p>
                            </div>
                            <Checkbox defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Sensor Desconectado</Label>
                                <p className="text-sm text-muted-foreground">Notificar tras 10 min sin datos</p>
                            </div>
                            <Checkbox defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Señal Débil</Label>
                                <p className="text-sm text-muted-foreground">Alertar cuando señal {"<"} 70%</p>
                            </div>
                            <Checkbox defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Actividad Inusual</Label>
                                <p className="text-sm text-muted-foreground">Detectar patrones anómalos</p>
                            </div>
                            <Checkbox />
                        </div>
                    </div>
                    <Button className="w-full">Guardar Configuración</Button>
                </CardContent>
            </Card>
        </div>
    )
}
