"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { useWebSocketContext } from "@/context/WebSocketContext"
import { ReadyState } from "@/context/readyState"
import { irrigationService, type IrrigationZone } from "@/services/api"
import { Droplets, Power } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

export function IrrigationPanel() {
    const [zones, setZones] = useState<IrrigationZone[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [lastOffTimestamp, setLastOffTimestamp] = useState<string | null>(null)

    // Hook must be here
    const { readyState, irrigationZones, pumpFeedback } = useWebSocketContext();
    const isOffline = readyState !== ReadyState.OPEN;

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
        const interval = setInterval(fetchZones, 10000) // Lower freq as we have WS
        return () => clearInterval(interval)
    }, [])

    // Sincronizar zones con irrigationZones, validando is_pump_active con pumpFeedback
    useEffect(() => {
        if (Object.keys(irrigationZones).length > 0) {
            setZones(prev => prev.map(zone => {
                const wsZoneUpdate = irrigationZones[zone.id];
                if (wsZoneUpdate) {
                    // Apply WS updates
                    let updatedZone = { ...zone, ...wsZoneUpdate };

                    // For the main pump zone (ID 4), override is_pump_active based on hardware feedback
                    if (zone.id === 4 && pumpFeedback) {
                        const hardwareIsOn = String(pumpFeedback.estado) === 'on' || String(pumpFeedback.estado) === '1';
                        updatedZone.is_pump_active = hardwareIsOn;
                    }
                    return updatedZone;
                }
                return zone;
            }));
        }
    }, [irrigationZones, pumpFeedback]);

    // Detectar cuando la bomba se apaga y guardar ese timestamp
    useEffect(() => {
        if (pumpFeedback && pumpFeedback.timestamp) {
            const currentState = String(pumpFeedback.estado);
            const isOff = currentState === 'off' || currentState === '0';

            // Si cambió a OFF, guardar el timestamp actual
            if (isOff) {
                setLastOffTimestamp(pumpFeedback.timestamp);
            } else {
                // Si está ON, limpiar el timestamp guardado
                setLastOffTimestamp(null);
            }
        }
    }, [pumpFeedback]);

    const handleActivate = async () => {
        // ID 4 is the single system now
        const zone = zones.find(z => z.id === 4);
        if (!zone) return;

        try {
            await irrigationService.togglePump(zone.id)
            toast.success(`Iniciando Sistema de Riego`)
            setIsOpen(false)
            fetchZones()
        } catch (error) {
            toast.error("Error al activar sistema")
        }
    }

    const handleStop = async (zone: IrrigationZone) => {
        try {
            await irrigationService.togglePump(zone.id)
            toast.success(`Deteniendo Riego: ${zone.name}`)
            fetchZones()
        } catch (error) {
            toast.error("Error al detener zona")
        }
    }

    // Determine state - VALIDAR SIEMPRE CONTRA HARDWARE
    // Solo considerar activo si el hardware confirma ON
    const hardwareIsOn = pumpFeedback && (String(pumpFeedback.estado) === 'on' || String(pumpFeedback.estado) === '1');
    const activeZone = hardwareIsOn ? zones.find(z => z.id === 4) : null;
    const lastActiveZone = [...zones]
        .filter(z => z.last_watered)
        .sort((a, b) => new Date(b.last_watered!).getTime() - new Date(a.last_watered!).getTime())[0];

    const displayZone = activeZone || lastActiveZone || (zones.length > 0 ? zones[0] : null);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="h-full cursor-pointer group">
                    <Card className={`h-full border-l-4 transition-all duration-500 ${activeZone
                        ? 'border-l-blue-500 shadow-lg shadow-blue-500/30 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 animate-pulse-slow'
                        : 'border-l-slate-300 shadow-sm group-hover:shadow-md bg-white'
                        }`}>
                        <CardHeader className={`p-4 flex flex-row items-center justify-between space-y-0 pb-2 ${activeZone ? (activeZone.mode === 'auto' ? 'bg-orange-500/5' : 'bg-green-500/5') : ''}`}>
                            <CardTitle className={`text-sm font-medium flex items-center gap-2 ${activeZone ? (activeZone.mode === 'auto' ? 'text-orange-700 font-semibold' : 'text-green-700 font-semibold') : 'text-muted-foreground'}`}>
                                <Droplets className={`h-4 w-4 ${activeZone ? 'animate-bounce' : ''}`} />
                                Control de Riego
                            </CardTitle>
                            {activeZone ? (
                                <span className="relative flex h-4 w-4">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeZone.mode === 'auto' ? 'bg-orange-400' : 'bg-green-400'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-4 w-4 shadow-lg ${activeZone.mode === 'auto' ? 'bg-orange-500 shadow-orange-500/50' : 'bg-green-500 shadow-green-500/50'}`}></span>
                                </span>
                            ) : (
                                <span className="relative flex h-4 w-4">
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 shadow-sm border border-red-600"></span>
                                </span>
                            )}
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {loading ? (
                                <div className="h-24 flex items-center justify-center text-xs text-muted-foreground animate-pulse">Cargando...</div>
                            ) : (
                                <div className="flex flex-col gap-3 h-32 justify-center">
                                    {activeZone ? (
                                        <>
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-3xl font-extrabold tracking-tight ${activeZone.mode === 'auto' ? 'text-orange-600' : 'text-green-600'}`}>
                                                    {activeZone.name}
                                                </span>
                                                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${activeZone.mode === 'auto' ? 'text-orange-600' : 'text-green-600'}`}>
                                                    <div className="relative flex h-2 w-2">
                                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeZone.mode === 'auto' ? 'bg-orange-600' : 'bg-green-600'}`}></span>
                                                        <span className={`relative inline-flex rounded-full h-2 w-2 ${activeZone.mode === 'auto' ? 'bg-orange-600' : 'bg-green-600'}`}></span>
                                                    </div>
                                                    {activeZone.mode === 'auto' ? 'Modo Automático' : 'Modo Manual'}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-2xl font-bold text-slate-600">Inactivo</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {displayZone ? `Último: ${displayZone.name}` : 'Sistema en espera'}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-slate-400 italic">
                                                Toca para configurar
                                            </div>
                                        </>
                                    )}

                                    {/* Feedback de Hardware - SIEMPRE VISIBLE */}
                                    <div className="flex flex-col gap-1 pt-2 border-t border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-medium text-slate-500">Hardware:</span>
                                            {pumpFeedback ? (
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-2 h-2 rounded-full ${String(pumpFeedback.estado) === 'on' || String(pumpFeedback.estado) === '1' ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse' : 'bg-slate-300'}`} />
                                                    <span className="text-[10px] font-mono font-bold uppercase text-slate-700">
                                                        {String(pumpFeedback.estado) === 'on' || String(pumpFeedback.estado) === '1' ? 'ON' : 'OFF'}
                                                    </span>
                                                    {pumpFeedback.marca && (
                                                        <span className="text-[9px] text-slate-400 ml-0.5">({pumpFeedback.marca})</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-slate-400">Sin señal</span>
                                            )}
                                        </div>
                                        {/* Mostrar última vez apagado */}
                                        {pumpFeedback && (String(pumpFeedback.estado) === 'off' || String(pumpFeedback.estado) === '0') && lastOffTimestamp && (
                                            <div className="text-[9px] text-slate-400 italic flex items-center gap-1">
                                                <span>Última vez apagado:</span>
                                                <span className="font-mono font-semibold text-slate-500">
                                                    {new Date(lastOffTimestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Control de Riego</DialogTitle>
                    <DialogDescription>
                        Selecciona una zona para activar el riego manual o detén el riego actual.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {activeZone ? (
                        <div className="flex flex-col items-center gap-4 py-4 bg-red-50 rounded-lg border border-red-100">
                            <div className="p-3 bg-white rounded-full shadow-sm">
                                <span className="relative flex h-6 w-6">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <Droplets className="relative inline-flex rounded-full h-6 w-6 text-red-500" />
                                </span>
                            </div>
                            <div className="text-center space-y-1">
                                <h4 className="font-semibold text-lg text-red-900">Riego Activo: {activeZone.name}</h4>
                                <p className="text-sm text-red-600">El sistema está operando actualmente.</p>
                            </div>
                            <Button
                                variant="destructive"
                                size="lg"
                                className="w-full max-w-xs shadow-lg hover:shadow-red-500/25 transition-all"
                                onClick={() => handleStop(activeZone)}
                                disabled={isOffline}
                            >
                                <Power className="mr-2 h-5 w-5" />
                                {isOffline ? "Sin Conexión" : "DETENER RIEGO AHORA"}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="p-4 bg-blue-50 rounded-full mb-2">
                                <Droplets className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className="text-center space-y-2 max-w-sm">
                                <h3 className="font-semibold text-lg">Sistema de Riego Principal</h3>
                                <p className="text-sm text-muted-foreground">
                                    El sistema está inactivo. Presiona el botón para iniciar el ciclo de riego manual.
                                </p>
                            </div>

                            <Button
                                className="w-full max-w-xs h-12 text-base font-semibold shadow-lg hover:shadow-blue-500/25 transition-all bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                                onClick={handleActivate}
                                disabled={isOffline || zones.length === 0}
                            >
                                <Power className="mr-2 h-5 w-5" />
                                {isOffline ? "Sin Conexión" : "ENCENDER SISTEMA"}
                            </Button>
                        </div>
                    )}

                    {/* Feedback de Hardware en el Modal */}
                    {pumpFeedback && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs text-muted-foreground">
                            <span className="font-medium">Estado Físico de Bomba:</span>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${String(pumpFeedback.estado) === 'on' || String(pumpFeedback.estado) === '1' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="font-mono font-bold uppercase">{String(pumpFeedback.estado) === 'on' || String(pumpFeedback.estado) === '1' ? 'ENCENDIDO' : 'APAGADO'}</span>
                                {pumpFeedback.timestamp && <span className="text-[10px] opacity-70 ml-1">({new Date(pumpFeedback.timestamp).toLocaleTimeString()})</span>}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent >
        </Dialog >
    )
}
