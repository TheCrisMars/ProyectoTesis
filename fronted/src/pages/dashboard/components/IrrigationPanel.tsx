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
                {loading ? (
                    <div className="h-20 flex items-center justify-center text-xs text-muted-foreground animate-pulse">Cargando...</div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {zones.map((zone) => (
                            <div key={zone.id} className="felx flex-col p-2 border rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold">{zone.name || `Zona ${zone.id}`}</span>
                                    {zone.id === 4 ? (
                                        <span className="text-[10px] text-purple-500 font-bold">AUTO</span>
                                    ) : null}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] uppercase font-bold">
                                        {zone.is_pump_active ? (
                                            <span className="text-blue-600">ACTIVO</span>
                                        ) : (
                                            <span className="text-slate-400">INACTIVO</span>
                                        )}
                                    </div>
                                    <Button
                                        size="icon"
                                        className={`h-8 w-8 rounded-full ${zone.is_pump_active ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                        onClick={() => handleToggle(zone)}
                                        disabled={zone.id === 4} // Disable manual toggle for Auto zone? Or allow override? User said "4 es automatico", usually implies auto-only, but let's allow override or check user intent. User said "se enciende automaticamente".
                                    >
                                        <Power className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
