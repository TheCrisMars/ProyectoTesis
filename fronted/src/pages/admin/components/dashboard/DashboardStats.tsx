
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, Wifi, Bell, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function DashboardStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Users className="h-4 w-4 text-blue-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">1,248</div>
                    <p className="text-xs text-muted-foreground mt-1">+12% desde el mes pasado</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Activos (24h)</CardTitle>
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <Activity className="h-4 w-4 text-green-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">847</div>
                    <p className="text-xs text-muted-foreground mt-1">67.9% de usuarios totales</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sensores Activos</CardTitle>
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Wifi className="h-4 w-4 text-purple-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">28/32</div>
                    <Progress value={87.5} className="mt-2 h-2" />
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Bell className="h-4 w-4 text-amber-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground mt-1">2 críticas, 3 advertencias</p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-l-4 border-l-cyan-500 hover:shadow-lg transition-shadow">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Uptime Sistema</CardTitle>
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <Clock className="h-4 w-4 text-cyan-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">99.98%</div>
                    <p className="text-xs text-muted-foreground mt-1">30 días sin interrupciones</p>
                </CardContent>
            </Card>
        </div>
    )
}
