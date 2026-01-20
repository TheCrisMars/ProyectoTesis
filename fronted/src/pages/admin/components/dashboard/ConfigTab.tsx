
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export function ConfigTab() {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Configuración del Sistema</CardTitle>
                    <CardDescription>Ajustes generales de la plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Intervalo de Actualización</Label>
                        <Select defaultValue="5">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 segundo</SelectItem>
                                <SelectItem value="5">5 segundos (Recomendado)</SelectItem>
                                <SelectItem value="10">10 segundos</SelectItem>
                                <SelectItem value="30">30 segundos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Retención de Datos</Label>
                        <Select defaultValue="90">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">30 días</SelectItem>
                                <SelectItem value="90">90 días (Recomendado)</SelectItem>
                                <SelectItem value="180">180 días</SelectItem>
                                <SelectItem value="365">1 año</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Modo de Energía</Label>
                        <Select defaultValue="balanced">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="performance">Alto Rendimiento</SelectItem>
                                <SelectItem value="balanced">Balanceado (Recomendado)</SelectItem>
                                <SelectItem value="efficiency">Eficiencia Energética</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Estadísticas del Sistema</CardTitle>
                    <CardDescription>Métricas de uso y rendimiento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Uso de CPU</span>
                            <span className="font-medium">32%</span>
                        </div>
                        <Progress value={32} className="h-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Uso de Memoria</span>
                            <span className="font-medium">48%</span>
                        </div>
                        <Progress value={48} className="h-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Almacenamiento</span>
                            <span className="font-medium">67%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Ancho de Banda</span>
                            <span className="font-medium">23%</span>
                        </div>
                        <Progress value={23} className="h-2" />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                            <p className="text-xs text-muted-foreground">Lecturas Totales</p>
                            <p className="text-2xl font-bold">1.2M</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">DB Size</p>
                            <p className="text-2xl font-bold">4.8 GB</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
