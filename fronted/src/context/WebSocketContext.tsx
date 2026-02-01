import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

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
const WS_URL = 'ws://localhost:8000/ws';

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
    const { sendMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
        shouldReconnect: (closeEvent) => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    });

    const [sensorReadings, setSensorReadings] = useState<Record<string, SensorReading>>({});
    const [irrigationZones, setIrrigationZones] = useState<Record<number, IrrigationZone>>({});

    useEffect(() => {
        if (lastJsonMessage) {
            console.log("WS Message:", lastJsonMessage);
            const msg = lastJsonMessage as any;

            if (msg.type === 'new_reading') {
                const reading = msg.data as SensorReading;
                setSensorReadings(prev => ({
                    ...prev,
                    [reading.sensor_id]: reading
                }));
            } else if (msg.type === 'zone_update') {
                const zone = msg.data as IrrigationZone;
                setIrrigationZones(prev => ({
                    ...prev,
                    [zone.id]: zone
                }));
            }
        }
    }, [lastJsonMessage]);

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
