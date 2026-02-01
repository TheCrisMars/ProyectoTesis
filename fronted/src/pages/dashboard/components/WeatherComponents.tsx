
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CloudSun, Loader2, History, Droplets, Wind, Search, TrendingUp } from "lucide-react"

// Leaflet Imports
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Types
export interface WeatherData {
    temperature: number;
    humidity: number;
    windspeed: number;
    weathercode: number;
    time: string;
}

export interface HistoryItem {
    id: string;
    lat: string;
    lon: string;
    temp: number;
    condition: string;
    date: string;
}

// Helpers
export const getWeatherCondition = (code: number) => {
    if (code === 0) return "Despejado"
    if (code <= 3) return "Parcialmente Nublado"
    if (code <= 48) return "Neblina"
    if (code <= 67) return "Lluvia"
    if (code <= 77) return "Nieve"
    if (code >= 80) return "Tormenta"
    return "Desconocido"
}

export const getAdvice = (code: number, temp: number) => {
    if (code >= 80) return "¡Alerta de tormenta! Asegura equipos externos."
    if (code >= 51) return "Lluvia detectada. El riego se suspenderá automáticamente."
    if (temp > 30) return "Alta temperatura. Se recomienda riego extra."
    if (temp < 10) return "Baja temperatura. Protege cultivos sensibles."
    return "Condiciones normales. Operación estándar."
}

// Map Component
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

// --- Components ---

// 1. Weather Card (The Summary Card for the Dashboard Grid)
export function WeatherCard({
    weather,
    onClick
}: {
    weather: WeatherData | null,
    onClick: () => void
}) {
    // If no data, show placeholder or loading state
    if (!weather) return (
        <Card className="relative overflow-hidden border-l-4 border-l-sky-500 hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clima Externo</CardTitle>
                <div className="p-2 bg-sky-500/10 rounded-lg">
                    <CloudSun className="h-4 w-4 text-sky-500" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground">Cargando datos...</div>
            </CardContent>
        </Card>
    )

    return (
        <Card className="relative overflow-hidden border-l-4 border-l-sky-500 hover:shadow-lg transition-shadow cursor-pointer group" onClick={onClick}>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/10 to-transparent rounded-full blur-2xl group-hover:from-sky-500/20 transition-all" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temperatura</CardTitle>
                <div className="p-2 bg-sky-500/10 rounded-lg">
                    <CloudSun className="h-4 w-4 text-sky-500" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">
                    {weather.temperature}°C
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <TrendingUp className="h-3 w-3 text-sky-500" />
                    <p className="text-xs text-muted-foreground">{getWeatherCondition(weather.weathercode)}</p>
                </div>

                {/* Advice Badge Inline */}
                <div className="mt-3">
                    <Badge variant="secondary" className="text-[10px] font-normal truncate max-w-full">
                        {getAdvice(weather.weathercode, weather.temperature)}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}

// 2. Weather Picker (The Content for the Dialog)
export function WeatherPicker({
    lat, setLat, lon, setLon, fetchWeather, loading, weather
}: {
    lat: string, setLat: (v: string) => void,
    lon: string, setLon: (v: string) => void,
    fetchWeather: () => void,
    loading: boolean,
    weather: WeatherData | null
}) {
    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Lat" className="h-8 text-xs" />
                <Input value={lon} onChange={(e) => setLon(e.target.value)} placeholder="Lon" className="h-8 text-xs" />
                <Button size="sm" onClick={fetchWeather} className="h-8"><Search className="h-3 w-3" /></Button>
            </div>

            <div className="h-[300px] rounded-md overflow-hidden border relative">
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
                        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Actualizar"}
                    </Button>
                </div>
            </div>

            {weather && (
                <div className="bg-muted/50 p-3 rounded-lg border flex gap-4 items-center">
                    <div>
                        <div className="text-2xl font-bold">{weather.temperature}°C</div>
                        <div className="text-xs text-muted-foreground">{getWeatherCondition(weather.weathercode)}</div>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="flex items-center gap-1"><Droplets className="h-3 w-3" /> Hum: {weather.humidity}%</div>
                        <div className="flex items-center gap-1"><Wind className="h-3 w-3" /> Viento: {weather.windspeed} km/h</div>
                    </div>
                </div>
            )}
        </div>
    )
}

// 3. Weather History (Sidebar Component)
export function WeatherHistory({ history }: { history: HistoryItem[] }) {
    const displayedHistory = history.slice(0, 5);
    const hasMore = history.length > 5;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Historial de Consultas
                </CardTitle>
                <CardDescription>Últimas ubicaciones verificadas</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {history.length === 0 && <p className="text-xs text-muted-foreground">No hay historial disponible.</p>}
                    {displayedHistory.map((item) => (
                        <div key={item.id} className="flex flex-col gap-1 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm">{item.temp}°C</span>
                                <Badge variant="outline" className="text-[10px] h-5">{item.condition}</Badge>
                            </div>
                            <div className="flex justify-between items-end mt-1">
                                <div className="text-[10px] text-muted-foreground">
                                    <div>Lat: {item.lat}</div>
                                    <div>Lon: {item.lon}</div>
                                </div>
                                <div className="text-[10px] text-muted-foreground">{item.date.split(" ")[1]}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full mt-4 text-xs h-8">
                                Ver todo ({history.length})
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Historial Completo</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="h-[300px] pr-4">
                                <div className="space-y-3">
                                    {history.map((item) => (
                                        <div key={item.id} className="flex flex-col gap-1 p-2 rounded-lg border bg-card">
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-sm">{item.temp}°C</span>
                                                <Badge variant="outline" className="text-[10px] h-5">{item.condition}</Badge>
                                            </div>
                                            <div className="flex justify-between items-end mt-1">
                                                <div className="text-[10px] text-muted-foreground">
                                                    <div>Lat: {item.lat}, Lon: {item.lon}</div>
                                                    <div className="text-[9px]">{item.date}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                )}
            </CardContent>
        </Card>
    )
}
