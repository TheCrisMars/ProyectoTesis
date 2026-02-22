"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface SensorData {
    time: string
    [key: string]: string | number
}

interface RealTimeSensorChartProps {
    readings: Record<string, {
        sensor_id: string
        temperature: number
        humidity: number
    }>
}

export function RealTimeSensorChart({ readings }: RealTimeSensorChartProps) {
    const [data, setData] = useState<SensorData[]>([])
    // Ref to hold the latest readings to access inside interval
    const readingsRef = useRef(readings);

    useEffect(() => {
        readingsRef.current = readings;
    }, [readings]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('es-EC', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // Create a data point with timestamp
            const newDataPoint: SensorData = {
                time: timeStr,
            };

            const currentReadings = readingsRef.current;
            const sensorIds = Object.keys(currentReadings);

            if (sensorIds.length > 0) {
                sensorIds.forEach(id => {
                    // We will plot Humidity for now as primary metric
                    // You can change 'humidity' to 'temperature' or make it toggleable
                    newDataPoint[`Sensor ${id}`] = currentReadings[id].humidity || 0;
                });
            } else {
                // Default flat line if no sensors
                newDataPoint["Sin Datos"] = 0;
            }

            setData(prev => {
                const newArr = [...prev, newDataPoint];
                // Keep last 60 seconds
                if (newArr.length > 60) {
                    return newArr.slice(newArr.length - 60);
                }
                return newArr;
            });

        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Get all unique sensor keys from the last data point to generate lines dynamically
    const lines = data.length > 0 ? Object.keys(data[data.length - 1]).filter(k => k !== 'time') : [];

    // Colors for different lines
    const colors = ["#2563eb", "#16a34a", "#db2777", "#ea580c", "#7c3aed"];

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Humedad en Tiempo Real (Último Minuto)
                </CardTitle>
            </CardHeader>
            <CardContent className="min-w-0 overflow-x-hidden">
                <div className="h-[250px] w-full sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="time"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                unit="%"
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                            />
                            <Legend />
                            {lines.map((key, index) => (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={colors[index % colors.length]}
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                    animationDuration={300}
                                    isAnimationActive={false} // Disable animation for smoother real-time feeling
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
