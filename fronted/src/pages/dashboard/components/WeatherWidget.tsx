
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CloudSun, Loader2, History, Droplets, Wind, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Leaflet Imports
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet Default Icon Issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface WeatherData {
    temperature: number;
    humidity: number;
    windspeed: number;
    weathercode: number;
    time: string;
}

interface HistoryItem {
    id: string;
    lat: string;
    lon: string;
    temp: number;
    condition: string;
    date: string;
}

// Map Click Component
function LocationMarker({ setLat, setLon }: { setLat: (l: string) => void, setLon: (l: string) => void }) {
    const map = useMapEvents({
        click(e) {
            setLat(e.latlng.lat.toFixed(4))
            setLon(e.latlng.lng.toFixed(4))
            map.flyTo(e.latlng, map.getZoom())
        },
    })
    return null
}

export function WeatherWidget() {
    // Default to Manta, Ecuador
    const [lat, setLat] = useState("-0.9677")
    const [lon, setLon] = useState("-80.7089")
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [activeTab, setActiveTab] = useState("current")

    // Load History
    useEffect(() => {
        const saved = localStorage.getItem("weather_history")
        if (saved) setHistory(JSON.parse(saved))
    }, [])

    const saveToHistory = (data: WeatherData, condition: string) => {
        const newItem: HistoryItem = {
            id: Date.now().toString(),
            lat,
            lon,
            temp: data.temperature,
            condition,
            date: new Date().toLocaleString()
        }
        const updated = [newItem, ...history].slice(0, 10) // Keep last 10
        setHistory(updated)
        localStorage.setItem("weather_history", JSON.stringify(updated))
    }

    const getWeatherCondition = (code: number) => {
        if (code === 0) return "Despejado"
        if (code <= 3) return "Parcialmente Nublado"
        if (code <= 48) return "Neblina"
        if (code <= 67) return "Lluvia"
        if (code <= 77) return "Nieve"
        if (code >= 80) return "Tormenta"
        return "Desconocido"
    }

    const getAdvice = (code: number, temp: number) => {
        if (code >= 80) return "¡Alerta de tormenta! Asegura equipos externos."
        if (code >= 51) return "Lluvia detectada. El riego se suspenderá automáticamente."
        if (temp > 30) return "Alta temperatura. Se recomienda riego extra."
        if (temp < 10) return "Baja temperatura. Protege cultivos sensibles."
        return "Condiciones normales. Operación estándar."
    }

    const fetchWeather = async () => {
        setLoading(true)
        setError("")
        setActiveTab("current")
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
            saveToHistory(weatherData, condition)

        } catch (err) {
            setError("No se pudo obtener el clima")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Initial Load
    useEffect(() => {
        fetchWeather()
    }, [])

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CloudSun className="h-5 w-5 text-sky-500" />
                    Clima & Predicciones
                </CardTitle>
                <CardDescription>Selecciona ubicación en el mapa para predicciones</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="current">Actual</TabsTrigger>
                        <TabsTrigger value="map">Mapa</TabsTrigger>
                    </TabsList>

                    <TabsContent value="map" className="h-[300px] rounded-md overflow-hidden border mt-2 relative">
                        {/* Leaflet Map */}
                        <MapContainer
                            center={[parseFloat(lat) || -0.96, parseFloat(lon) || -80.70]}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker setLat={setLat} setLon={setLon} />
                            <Marker position={[parseFloat(lat) || 0, parseFloat(lon) || 0]}></Marker>
                        </MapContainer>
                        <div className="absolute bottom-2 left-2 right-2 bg-background/90 p-2 rounded border text-xs z-[1000] flex justify-between items-center">
                            <span>Lat: {lat}, Lon: {lon}</span>
                            <Button size="sm" onClick={fetchWeather} disabled={loading}>
                                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Consultar"}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="current" className="space-y-4">
                        <div className="flex gap-2">
                            <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Lat" className="h-8 text-xs" />
                            <Input value={lon} onChange={(e) => setLon(e.target.value)} placeholder="Lon" className="h-8 text-xs" />
                            <Button size="sm" onClick={fetchWeather} className="h-8"><Search className="h-3 w-3" /></Button>
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}

                        {weather && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="bg-gradient-to-br from-sky-500/10 to-blue-600/10 p-4 rounded-xl border border-sky-100 dark:border-sky-900">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{getWeatherCondition(weather.weathercode)}</p>
                                            <div className="text-4xl font-bold text-sky-700 dark:text-sky-300 my-1">
                                                {weather.temperature}°C
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="bg-background/50">
                                            {weather.time.split("T")[1]}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/40 p-2 rounded">
                                            <Droplets className="h-4 w-4 text-blue-500" />
                                            <span>Hum: {weather.humidity}%</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/40 p-2 rounded">
                                            <Wind className="h-4 w-4 text-gray-500" />
                                            <span>Wind: {weather.windspeed} km/h</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-200 dark:border-amber-900 flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase">Consejo del Sistema</p>
                                        <p className="text-sm text-amber-900 dark:text-amber-200 leading-tight mt-1">
                                            {getAdvice(weather.weathercode, weather.temperature)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <div className="border-t pt-4">
                    <h4 className="text-xs font-semibold mb-2 flex items-center gap-2">
                        <History className="h-3 w-3" /> Historial Reciente
                    </h4>
                    <ScrollArea className="h-[120px]">
                        <div className="space-y-2">
                            {history.length === 0 && <p className="text-xs text-muted-foreground">Sin historial.</p>}
                            {history.map((item) => (
                                <div key={item.id} className="text-xs flex justify-between items-center p-2 rounded bg-muted/50">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{item.temp}°C - {item.condition}</span>
                                        <span className="text-[10px] text-muted-foreground">{item.date}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                                        {item.lat}, {item.lon}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

            </CardContent>
        </Card>
    )
}
