"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit2, Play, Sprout, Map as MapIcon, XCircle } from "lucide-react"
import { irrigationService, type IrrigationZone } from "@/services/api"
import { toast } from "react-hot-toast"
import { Progress } from "@/components/ui/progress"

export function IrrigationPanel() {
    const [zones, setZones] = useState<IrrigationZone[]>([])
    const [loading, setLoading] = useState(true)
    const [editingZone, setEditingZone] = useState<IrrigationZone | null>(null)
    const [newName, setNewName] = useState("")

    const fetchZones = async () => {
        try {
            const data = await irrigationService.getZones()
            setZones(data)
        } catch (error) {
            console.error("Failed to fetch zones", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchZones()
        // Poll every 5 seconds for better responsiveness
        const interval = setInterval(fetchZones, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleToggle = async (zone: IrrigationZone) => {
        try {
            // Optimistic update
            const newStatus = !zone.is_pump_active
            const updatedZones = zones.map(z => z.id === zone.id ? {
                ...z,
                is_pump_active: newStatus,
                mode: newStatus ? 'manual' : z.mode // Reset to manual if turning ON, keep current if OFF but actually backend handles this
            } : z)
            setZones(updatedZones)

            await irrigationService.togglePump(zone.id)

            if (newStatus) {
                toast.success(`Bomba encendida en ${zone.name}`, { style: { background: '#22c55e', color: 'white' } })
            } else {
                toast(`Bomba apagada en ${zone.name}`, { icon: '🛑' })
            }
            fetchZones()
        } catch (error) {
            toast.error("Error al cambiar estado")
            fetchZones()
        }
    }

    const handleUpdateName = async () => {
        if (!editingZone || !newName.trim()) return

        try {
            await irrigationService.updateZone(editingZone.id, { name: newName })
            toast.success("Nombre de zona actualizado")
            setEditingZone(null)
            fetchZones()
        } catch (error) {
            toast.error("Error al actualizar nombre")
        }
    }

    const handleStartTimer = async (zone: IrrigationZone, minutes: number) => {
        try {
            await irrigationService.setTimer(zone.id, minutes * 60)
            toast.success(`Temporizador iniciado: ${minutes} min en ${zone.name}`, { style: { background: '#3b82f6', color: 'white' } })
            fetchZones()
        } catch (error) {
            toast.error("Error al iniciar temporizador")
        }
    }

    const handleStopTimer = async (zone: IrrigationZone) => {
        if (zone.is_pump_active) {
            await handleToggle(zone) // Toggle OFF handles stopping
        }
    }

    // Helper to determine Card Color
    const getZoneColor = (zone: IrrigationZone) => {
        if (!zone.is_pump_active) return "border-gray-200 dark:border-gray-800 bg-card"
        if (zone.mode === 'timer') return "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
        return "border-green-500 bg-green-50 dark:bg-green-900/20" // Manual
    }

    if (loading && zones.length === 0) {
        return <div className="p-4 text-center">Cargando sistema de riego...</div>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Visual Map Area */}
            <Card className="lg:col-span-2 border-primary/20 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <MapIcon className="h-6 w-6 text-primary" />
                        Mapa de Cultivo - Control de Riego
                    </CardTitle>
                    <CardDescription>Seleccione una zona para gestionar el riego manual o automático.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {zones.map((zone) => (
                            <div
                                key={zone.id}
                                className={`relative p-5 rounded-xl border-2 transition-all duration-300 ${getZoneColor(zone)} hover:shadow-md`}
                            >
                                {/* Active State Badge - Absolute Position */}
                                <div className="absolute top-4 right-4">
                                    {zone.is_pump_active ? (
                                        <Badge variant="outline" className={`${zone.mode === 'timer' ? 'bg-blue-500 text-white border-blue-600' : 'bg-green-500 text-white border-green-600'} animate-pulse`}>
                                            {zone.mode === 'timer' ? 'AUTOMÁTICO' : 'MANUAL'}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">
                                            INACTIVO
                                        </Badge>
                                    )}
                                </div>

                                {/* Header & Name */}
                                <div className="flex items-center gap-2 mb-4">
                                    <Sprout className={`h-6 w-6 ${zone.is_pump_active ? (zone.mode === 'timer' ? 'text-blue-600' : 'text-green-600') : 'text-gray-400'}`} />
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg">{zone.name}</h3>
                                        <Dialog open={editingZone?.id === zone.id} onOpenChange={(open) => !open && setEditingZone(null)}>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100" onClick={() => { setEditingZone(zone); setNewName(zone.name); }}>
                                                    <Edit2 className="h-3 w-3" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Renombrar Zona</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <Label>Nuevo Nombre</Label>
                                                    <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-2" />
                                                </div>
                                                <DialogFooter>
                                                    <Button onClick={handleUpdateName}>Guardar Cambio</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>

                                {/* Active Timer Feedback */}
                                {zone.mode === 'timer' && zone.is_pump_active && (
                                    <div className="mb-4 bg-white/50 p-2 rounded-lg">
                                        <div className="flex justify-between text-sm font-medium mb-1">
                                            <span className="text-blue-600">Tiempo Restante</span>
                                            <span className="text-blue-800">{Math.ceil(zone.timer_seconds_remaining / 60)} min</span>
                                        </div>
                                        <Progress value={Math.min(100, (zone.timer_seconds_remaining / (60 * 60)) * 100)} className="h-2" />
                                    </div>
                                )}

                                {/* Controls Actions */}
                                <div className="space-y-4">
                                    {/* Manual Toggle */}
                                    <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg">
                                        <Label className="font-semibold text-sm">Riego Manual</Label>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-bold ${zone.is_pump_active ? 'text-green-600' : 'text-gray-400'}`}>
                                                {zone.is_pump_active ? 'VALVULA ABIERTA' : 'CERRADA'}
                                            </span>
                                            <Switch
                                                checked={zone.is_pump_active}
                                                onCheckedChange={() => handleToggle(zone)}
                                            />
                                        </div>
                                    </div>

                                    {/* Timer Controls */}
                                    <div className="bg-primary/5 p-3 rounded-lg">
                                        <Label className="font-semibold text-sm block mb-2">Temporizador (Automático)</Label>

                                        {/* Presets */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {[20, 30, 45, 60].map((min) => (
                                                <Button
                                                    key={min}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800"
                                                    onClick={() => handleStartTimer(zone, min)}
                                                    disabled={zone.is_pump_active}
                                                >
                                                    {min}m
                                                </Button>
                                            ))}
                                        </div>

                                        {/* Custom Input */}
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Minutos..."
                                                className="h-8 bg-white"
                                                disabled={zone.is_pump_active}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const val = parseInt(e.currentTarget.value)
                                                        if (val > 0) handleStartTimer(zone, val)
                                                    }
                                                }}
                                            />
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8"
                                                disabled={zone.is_pump_active}
                                                onClick={(e) => {
                                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                                                    const val = parseInt(input.value)
                                                    if (val > 0) handleStartTimer(zone, val)
                                                }}
                                            >
                                                <Play className="h-3 w-3" />
                                            </Button>
                                        </div>

                                        {zone.mode === 'timer' && zone.is_pump_active && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-full mt-2"
                                                onClick={() => handleStopTimer(zone)}
                                            >
                                                <XCircle className="h-4 w-4 mr-2" /> Cancelar Temporizador
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Side Legend & Info */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Sprout className="h-5 w-5 text-green-600" />
                            Guía de Riego: Cacao
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200">
                            <h4 className="font-bold text-yellow-800 dark:text-yellow-500 mb-1">Cacao Nacional (Fino de Aroma)</h4>
                            <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-2">Requiere humedad constante pero sin encharcamiento.</p>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between"><span>Crecimiento:</span> <strong>30-40 min/día</strong></div>
                                <div className="flex justify-between"><span>Floración:</span> <strong>20 min/día</strong></div>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200">
                            <h4 className="font-bold text-orange-800 dark:text-orange-500 mb-1">Cacao CCN-51</h4>
                            <p className="text-xs text-orange-700 dark:text-orange-400 mb-2">Mayor tolerancia al sol, requiere riegos más intensos.</p>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between"><span>Crecimiento:</span> <strong>45-60 min/día</strong></div>
                                <div className="flex justify-between"><span>Producción:</span> <strong>30-40 min/día</strong></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Estado del Sistema</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            <span className="text-sm font-medium">Bomba Activa (Manual)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            <span className="text-sm font-medium">Temporizador Activo</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-gray-300 border border-gray-400" />
                            <span className="text-sm font-medium">Sistema Inactivo</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
