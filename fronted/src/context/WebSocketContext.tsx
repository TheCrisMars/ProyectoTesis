import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { toast } from "react-hot-toast";

import { ReadyState, type ReadyState as ReadyStateType } from "./readyState";

interface SensorReading {
    sensor_id: string;
    temperature: number;
    humidity: number;
    timestamp: string;
    adc?: number;
    finca?: string;
    origen?: string;
}

interface IrrigationZone {
    id: number;
    name: string;
    is_pump_active: boolean;
    mode: 'manual' | 'timer' | 'auto';
    timer_seconds_remaining?: number;
}

interface WebSocketContextType {
    readyState: ReadyStateType;
    lastJsonMessage: any;
    sensorReadings: Record<string, SensorReading>;
    irrigationZones: Record<number, IrrigationZone>;
    pumpFeedback: any;
    sendMessage: (message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({} as WebSocketContextType);

function resolveWsUrl() {
    const explicit = import.meta.env.VITE_WS_URL as string | undefined;
    if (explicit) return explicit;

    const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000";
    try {
        const url = new URL(apiUrl);
        url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
        url.pathname = "/ws";
        url.search = "";
        url.hash = "";
        return url.toString();
    } catch {
        return "ws://localhost:5000/ws";
    }
}

const WS_URL = resolveWsUrl();

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [readyState, setReadyState] = useState<ReadyStateType>(ReadyState.CLOSED);
    const [lastJsonMessage, setLastJsonMessage] = useState<any>(null);
    const [sensorReadings, setSensorReadings] = useState<Record<string, SensorReading>>({});
    const [irrigationZones, setIrrigationZones] = useState<Record<number, IrrigationZone>>({});
    const [pumpFeedback, setPumpFeedback] = useState<any>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const prevPumpState = useRef<string | null>(null);
    const sessionStarted = useRef(false); // Bandera para evitar toasts en conexión inicial
    const hadDisconnect = useRef(false); // Desconexión WS (servidor o red)
    const wasOffline = useRef(false); // Solo cuando el navegador realmente se quedó sin red
    const manualClose = useRef(false);
    const reconnectTimeout = useRef<number | null>(null);

    const connect = () => {
        manualClose.current = false;
        if (reconnectTimeout.current !== null) {
            window.clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = null;
        }

        const token = localStorage.getItem('token');
        const url = token ? `${WS_URL}?token=${token}` : WS_URL;

        if (!url) return;

        try {
            const ws = new WebSocket(url);
            socketRef.current = ws;

            // ... inside connect function ...
            ws.onopen = () => {
                setReadyState(ReadyState.OPEN);
                console.log('WebSocket conectado');

                // Marcar la sesión como iniciada después de 2 segundos
                // para evitar toasts de estado inicial
                setTimeout(() => {
                    sessionStarted.current = true;
                }, 2000);
                toast.dismiss("ws-error");
                if (hadDisconnect.current && wasOffline.current) {
                    toast.success("Conectado al servidor", { id: "ws-success" });
                }
                hadDisconnect.current = false;
                wasOffline.current = false;
            };

            ws.onclose = () => {
                console.log('WS Disconnected');
                setReadyState(ReadyState.CLOSED);
                if (manualClose.current) {
                    return;
                }

                hadDisconnect.current = true;
                if (!navigator.onLine) {
                    wasOffline.current = true;
                }
                toast.error("Sin conexión con el servidor", {
                    id: "ws-error",
                    duration: Infinity,
                    icon: '📡'
                });
                reconnectTimeout.current = window.setTimeout(connect, 3000); // Reconnect after 3s
            };

            ws.onerror = (error) => {
                console.error('WS Error:', error);
                setReadyState(ReadyState.CLOSED);
                if (!manualClose.current) {
                    hadDisconnect.current = true;
                    if (!navigator.onLine) {
                        wasOffline.current = true;
                    }
                }
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setLastJsonMessage(data);

                    if (data.type === 'new_reading' || data.type === 'nuevo_sensor') {
                        const raw = data.data;
                        const reading: SensorReading = {
                            sensor_id: raw.sensor || 'Unknown',
                            temperature: raw.temperatura || 0,
                            humidity: raw.humedad_suelo || 0,
                            timestamp: new Date().toISOString(),
                            adc: raw.adc,
                            finca: raw.finca,
                            origen: raw.origen
                        };

                        setSensorReadings(prev => ({
                            ...prev,
                            [reading.sensor_id]: reading
                        }));
                    } else if (data.type === 'zone_update') {
                        const zone = data.data as IrrigationZone;
                        setIrrigationZones(prev => ({
                            ...prev,
                            [zone.id]: zone
                        }));
                    } else if (data.type === 'estado_bomba') {
                        const estado = data.data;
                        setPumpFeedback(estado);

                        const currentState = String(estado.estado);
                        if (prevPumpState.current !== currentState && sessionStarted.current) {
                            prevPumpState.current = currentState;
                            const is_on = currentState === '1' || currentState === 'on' || currentState === 'active';
                            toast(is_on ? "Bomba encendida físicamente" : "Bomba apagada físicamente", {
                                icon: is_on ? "💧" : "🛑",
                                id: "pump-feedback"
                            });
                        } else if (prevPumpState.current === null) {
                            // Solo actualizar el estado previo sin mostrar toast en primera carga
                            prevPumpState.current = currentState;
                        }
                    }
                } catch (e) {
                    console.error("WS Parse Error", e);
                }
            };
        } catch (e) {
            console.error("WS Connection Error", e);
        }
    };

    useEffect(() => {
        connect();

        const onOffline = () => {
            wasOffline.current = true;
        };
        window.addEventListener('offline', onOffline);

        return () => {
            manualClose.current = true;
            if (reconnectTimeout.current !== null) {
                window.clearTimeout(reconnectTimeout.current);
                reconnectTimeout.current = null;
            }
            if (socketRef.current) {
                socketRef.current.close();
            }

            window.removeEventListener('offline', onOffline);
        };
    }, []);

    const sendMessage = (message: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        }
    };

    return (
        <WebSocketContext.Provider value={{
            readyState,
            lastJsonMessage,
            sensorReadings,
            irrigationZones,
            pumpFeedback,
            sendMessage
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
