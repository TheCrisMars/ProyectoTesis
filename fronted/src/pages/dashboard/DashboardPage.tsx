"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/AuthContext"
import { useWebSocketContext } from "@/context/WebSocketContext"
import { ReadyState } from "@/context/readyState"
import {
    Activity,
    Droplets,
    TrendingDown,
    Wifi,
    Zap,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardChart } from "./components/DashboardChart"
import { IrrigationPanel } from "./components/IrrigationPanel"
import { RealTimeSensorChart } from "./components/RealTimeSensorChart"
import { getWeatherCondition, WeatherCard, WeatherHistory, WeatherPicker, type HistoryItem, type WeatherData } from "./components/WeatherComponents"

const humiditySparkline = [60, 62, 58, 57, 55, 53, 56, 59]
const latencySparkline = [45, 52, 48, 50, 47, 49, 51, 48]

export function DashboardPage() {
    const [timeRange, setTimeRange] = useState("24h")
    const { user } = useAuth();
    const navigate = useNavigate();

    // WebSocket Integration
    const { readyState, sensorReadings } = useWebSocketContext();

    // --- Weather State ---
    const [lat, setLat] = useState("-0.9677")
    const [lon, setLon] = useState("-80.7089")
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [weatherLoading, setWeatherLoading] = useState(false)
    const [weatherHistory, setWeatherHistory] = useState<HistoryItem[]>([])

    // Load History
    useEffect(() => {
        const saved = localStorage.getItem("weather_history")
        if (saved) setWeatherHistory(JSON.parse(saved))
        fetchWeather() // Initial fetch
    }, [])

    const fetchWeather = async () => {
        setWeatherLoading(true)
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
            )
            if (!response.ok) throw new Error("Error fetching weather")

            const data = await response.json()
            const code = data.current.weather_code
            const condition = getWeatherCondition(code)

            const weatherData = {
                temperature: data.current.temperature_2m,
                humidity: data.current.relative_humidity_2m,
                windspeed: data.current.wind_speed_10m,
                weathercode: code,
                time: data.current.time
            }

            setWeather(weatherData)

            // Save History
            const newItem: HistoryItem = {
                id: Date.now().toString(),
                lat,
                lon,
                temp: weatherData.temperature,
                condition,
                date: new Date().toLocaleString()
            }
            const updated = [newItem, ...weatherHistory].slice(0, 10)
            setWeatherHistory(updated)
            localStorage.setItem("weather_history", JSON.stringify(updated))

        } catch (err) {
            console.error(err)
        } finally {
            setWeatherLoading(false)
        }
    }
    // ---------------------

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate("/admin/dashboard");
        }
    }, [user, navigate]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    const isConnected = readyState === ReadyState.OPEN;

    const sensorList = Object.values(sensorReadings).length > 0
        ? Object.values(sensorReadings).map(r => ({
            id: r.sensor_id,
            name: `Sensor ${r.sensor_id}`,
            temp: r.temperature,
            hum: r.humidity,
            signal: 90,
            status: "online",
            adc: r.adc,
            finca: r.finca,
            transformed: r.humidity // Assuming 'transformed' refers to the final readable value (humidity %)
        }))
        : [
            {
                id: "Wait...",
                name: "Esperando datos...",
                temp: 0,
                hum: 0,
                signal: 0,
                status: "offline",
                adc: 0,
                finca: "N/A",
                transformed: 0
            }
        ];

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Panel de Control IoT
                    </h1>
                    <p className="text-muted-foreground mt-1">Monitoreo en tiempo real de los sistemas ESP32</p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                    <Badge variant={isConnected ? "default" : "destructive"}>
                        WS: {connectionStatus}
                    </Badge>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1h">Última hora</SelectItem>
                            <SelectItem value="24h">Últimas 24h</SelectItem>
                            <SelectItem value="7d">Últimos 7 días</SelectItem>
                            <SelectItem value="30d">Últimos 30 días</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button>
                        <Activity className="mr-2 h-4 w-4" /> Generar Reporte
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {/* 0. IRRIGATION PANEL */}
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 row-span-1">
                    <IrrigationPanel />
                </div>

                {/* 1. WEATHER CARD */}
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1 row-span-1">
                    <Dialog>
                        <DialogTrigger asChild>
                            <div>
                                <WeatherCard weather={weather} onClick={() => { }} />
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Configuración de Clima</DialogTitle>
                                <DialogDescription>
                                    Selecciona una ubicación en el mapa para ver la predicción y pronóstico.
                                </DialogDescription>
                            </DialogHeader>
                            <WeatherPicker
                                lat={lat} setLat={setLat}
                                lon={lon} setLon={setLon}
                                fetchWeather={fetchWeather}
                                loading={weatherLoading}
                                weather={weather}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* 2. CARD HUMEDAD */}
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Card className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Humedad Ambiente</CardTitle>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Droplets className="h-4 w-4 text-blue-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{weather ? `${weather.humidity}%` : "--%"}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <TrendingDown className="h-3 w-3 text-red-500" />
                                <span className="text-red-500">-1.2%</span> desde la última hora
                            </p>

                            {/* Sparkline Visual */}
                            <div className="mt-3 flex items-end gap-1 h-8">
                                {humiditySparkline.map((val, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-blue-200 hover:bg-blue-400 transition-colors rounded-t-sm"
                                        style={{ height: `${val}%` }}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. CARD SENSORES ACTIVOS */}
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Card className="relative overflow-hidden border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sensores Activos</CardTitle>
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <Wifi className="h-4 w-4 text-orange-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Object.keys(sensorReadings).length}/4</div>
                            <p className="text-xs text-muted-foreground mt-1">En tiempo real</p>
                            <Progress value={(Object.keys(sensorReadings).length / 4) * 100} className="mt-3 h-1.5" />
                            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                                <span>Conectividad</span>
                                <span>100%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 4. CARD LATENCIA */}
                <div className="md:col-span-1 lg:col-span-1 xl:col-span-1">
                    <Card className="relative overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-2xl" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Latencia de Red</CardTitle>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Zap className="h-4 w-4 text-green-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">48ms</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                Óptimo
                            </p>
                            <div className="mt-3 flex items-end gap-1 h-8">
                                {latencySparkline.map((val, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-green-200 hover:bg-green-400 transition-colors rounded-t-sm"
                                        style={{ height: `${val}%` }}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* REAL TIME CHART SECTION */}
            <div className="grid gap-4 grid-cols-1">
                <RealTimeSensorChart readings={sensorReadings} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <DashboardChart timeRange={timeRange} />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <WeatherHistory history={weatherHistory} />
                </div>
            </div>

            {/* SENSORS GRID */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lecturas Individuales de Sensores</CardTitle>
                            <CardDescription>Monitoreo detallado de cada dispositivo ESP32</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {sensorList.map((sensor) => (
                                    <div
                                        key={sensor.id}
                                        className="p-4 rounded-lg border bg-gradient-to-br from-card to-accent/5 hover:shadow-md transition-shadow relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-all" />

                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-semibold">{sensor.name}</h4>
                                                <p className="text-xs text-muted-foreground">{sensor.id}</p>
                                            </div>
                                            <Badge variant={sensor.status === "online" ? "default" : "secondary"}>
                                                {sensor.status === "online" ? "En línea" : "Desconectado"}
                                            </Badge>
                                        </div>

                                        {sensor.status === "online" ? (
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center bg-accent/10 p-2 rounded">
                                                    <span className="text-xs font-medium text-muted-foreground">Temperatura</span>
                                                    <span className="text-lg font-bold text-red-500">{sensor.temp}°C <span className="text-sm text-muted-foreground">({sensor.temp}%)</span></span>
                                                </div>
                                                <div className="flex justify-between items-center bg-accent/10 p-2 rounded">
                                                    <span className="text-xs font-medium text-muted-foreground">Humedad</span>
                                                    <span className="text-lg font-bold text-blue-500">{sensor.hum}%</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-accent/10 p-2 rounded">
                                                    <span className="text-xs font-medium text-muted-foreground">Señal</span>
                                                    <span className="text-lg font-bold text-green-500">{sensor.signal}%</span>
                                                </div>

                                                {/* TECHNICAL PANEL (CA5) */}
                                                <div className="mt-2 pt-2 border-t border-border/50 text-[10px] space-y-1 text-muted-foreground">
                                                    <div className="flex min-w-0 justify-between gap-2"><span className="shrink-0">Finca:</span> <span className="font-mono min-w-0 truncate text-right">{sensor.finca || "Desconocida"}</span></div>
                                                    <div className="flex min-w-0 justify-between gap-2"><span className="shrink-0">ID Sensor:</span> <span className="font-mono min-w-0 truncate text-right">{sensor.id}</span></div>
                                                    <div className="flex min-w-0 justify-between gap-2"><span className="shrink-0">ADC (Raw):</span> <span className="font-mono min-w-0 truncate text-right">{sensor.adc || "N/A"}</span></div>
                                                    <div className="flex min-w-0 justify-between gap-2"><span className="shrink-0">Transformado:</span> <span className="font-mono min-w-0 truncate text-right">{sensor.transformed}%</span></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 opacity-60">
                                                <Wifi className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                                <p className="text-sm font-medium">Esperando conexión...</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
