"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit2, Power, Droplets } from "lucide-react"
import { irrigationService, type IrrigationZone } from "@/services/api"
import { toast } from "react-hot-toast"

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
        const interval = setInterval(fetchZones, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleToggle = async (zone: IrrigationZone) => {
        try {
            const newStatus = !zone.is_pump_active
            const updatedZones = zones.map(z => z.id === zone.id ? {
                ...z,
                is_pump_active: newStatus,
                mode: 'manual' as const
            } : z)
            setZones(updatedZones)

            await irrigationService.togglePump(zone.id)

            if (newStatus) {
                toast.success(`ACTIVANDO RIEGO en ${zone.name}`, { style: { background: '#2563eb', color: 'white' } })
            } else {
                toast(`Riego DETENIDO en ${zone.name}`, { icon: '🛑' })
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

    const primaryZone = zones.length > 0 ? zones[0] : null;

    return (
        <Card className={`h-full border-l-4 transition-all duration-300 shadow-sm ${primaryZone?.is_pump_active ? 'border-l-blue-500 shadow-blue-500/10' : 'border-l-slate-300'}`}>
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Droplets className="h-4 w-4" />
                    Control de Riego
                </CardTitle>
                {primaryZone && (
                    <Dialog open={editingZone?.id === primaryZone.id} onOpenChange={(open) => !open && setEditingZone(null)}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-slate-400 hover:text-primary" onClick={() => { setEditingZone(primaryZone); setNewName(primaryZone.name); }}>
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
                )}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                {loading && !primaryZone ? (
                    <div className="h-20 flex items-center justify-center text-xs text-muted-foreground animate-pulse">Cargando...</div>
                ) : primaryZone ? (
                    <div className="flex items-center justify-between mt-2">
                        {/* Info Side */}
                        <div className="flex flex-col">
                            <div className="text-2xl font-bold truncate max-w-[140px]">
                                {primaryZone.name || "Zona 1"}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-wider mt-1">
                                {primaryZone.is_pump_active ? (
                                    <span className="text-blue-600 flex items-center gap-1 animate-pulse">
                                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                                        ACTIVO
                                    </span>
                                ) : (
                                    <span className="text-slate-400 flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-slate-300" />
                                        INACTIVO
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Side - Compact Big Button */}
                        <Button
                            className={`
                                relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-md group
                                ${primaryZone.is_pump_active
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/40 ring-4 ring-blue-50 dark:ring-blue-900/20'
                                    : 'bg-white border-2 border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600'
                                }
                            `}
                            onClick={() => handleToggle(primaryZone)}
                        >
                            <Power className={`h-6 w-6 ${primaryZone.is_pump_active ? 'scale-110' : 'scale-100 group-hover:scale-110'} transition-transform`} />
                        </Button>
                    </div>
                ) : (
                    <div className="h-20 flex items-center justify-center text-xs text-muted-foreground">Sin configuración.</div>
                )}
            </CardContent>
        </Card>
    )
}
