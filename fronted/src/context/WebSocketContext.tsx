import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';

// Define ReadyState constant manually since we removed the lib
export const ReadyState = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
    UNINSTANTIATED: -1,
} as const;

export type ReadyState = typeof ReadyState[keyof typeof ReadyState];

interface SensorReading {
    sensor_id: string;
    temperature: number;
    humidity: number;
    timestamp: string;
}

interface IrrigationZone {
    id: number;
    name: string;
    is_pump_active: boolean;
    mode: string;
    timer_seconds_remaining?: number;
}

interface WebSocketContextType {
    readyState: ReadyState;
    lastJsonMessage: any;
    sensorReadings: Record<string, SensorReading>;
    irrigationZones: Record<number, IrrigationZone>;
    sendMessage: (message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({} as WebSocketContextType);

// Construct WS URL - In production this should be dynamic
// Construct WS URL - In production this should be dynamic
const WS_URL = 'ws://localhost:5000/ws';

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const [readyState, setReadyState] = useState<ReadyState>(ReadyState.CLOSED);
    const [lastJsonMessage, setLastJsonMessage] = useState<any>(null);
    const [sensorReadings, setSensorReadings] = useState<Record<string, SensorReading>>({});
    const [irrigationZones, setIrrigationZones] = useState<Record<number, IrrigationZone>>({});
    const socketRef = useRef<WebSocket | null>(null);

    const connect = () => {
        const token = localStorage.getItem('token');
        const url = token ? `${WS_URL}?token=${token}` : null;

        if (!url) return;

        try {
            const ws = new WebSocket(url);
            socketRef.current = ws;

            ws.onopen = () => {
                console.log('WS Connected');
                setReadyState(ReadyState.OPEN);
            };

            ws.onclose = () => {
                console.log('WS Disconnected');
                setReadyState(ReadyState.CLOSED);
                setTimeout(connect, 3000); // Reconnect after 3s
            };

            ws.onerror = (error) => {
                console.error('WS Error:', error);
                setReadyState(ReadyState.CLOSED);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setLastJsonMessage(data);

                    if (data.type === 'new_reading') {
                        const reading = data.data as SensorReading;
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
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
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
            sendMessage
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
