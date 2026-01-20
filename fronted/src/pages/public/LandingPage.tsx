import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Link } from "react-router-dom"
import {
    ArrowRight,
    CheckCircle2,
    Target,
    Eye,
    Wifi,
    Activity,
    Database,
    Shield,
    Zap,
    TrendingUp,
    Sparkles,
} from "lucide-react"

export function LandingPage() {
    const features = [
        {
            icon: Activity,
            title: "Monitoreo en Tiempo Real",
            description:
                "Visualización instantánea de datos de sensores con actualización automática, baja latencia y procesamiento en tiempo real.",
            gradient: "from-primary/10 to-transparent",
            hoverGradient: "from-primary/5 via-primary/5 to-transparent",
            iconColor: "text-primary",
            shadowColor: "group-hover:shadow-primary/10",
        },
        {
            icon: Database,
            title: "Almacenamiento Persistente",
            description:
                "Base de datos optimizada para históricos y análisis retrospectivo con capacidad de millones de registros.",
            gradient: "from-primary/10 to-transparent",
            hoverGradient: "from-primary/5 via-primary/5 to-transparent",
            iconColor: "text-primary",
            shadowColor: "group-hover:shadow-primary/10",
        },
        {
            icon: Wifi,
            title: "Conectividad ESP32",
            description:
                "Integración nativa con microcontroladores ESP32 mediante protocolos seguros y comunicación eficiente.",
            gradient: "from-primary/10 to-transparent",
            hoverGradient: "from-primary/5 via-primary/5 to-transparent",
            iconColor: "text-primary",
            shadowColor: "group-hover:shadow-primary/10",
        },
        {
            icon: Shield,
            title: "Seguridad Avanzada",
            description:
                "Autenticación robusta y encriptación end-to-end para proteger tus datos con estándares industriales.",
            gradient: "from-primary/10 to-transparent",
            hoverGradient: "from-primary/5 via-primary/5 to-transparent",
            iconColor: "text-primary",
            shadowColor: "group-hover:shadow-primary/10",
        },
        {
            icon: TrendingUp,
            title: "Análisis Avanzado",
            description:
                "Gráficos interactivos y herramientas de análisis estadístico para insights profundos y toma de decisiones.",
            gradient: "from-primary/10 to-transparent",
            hoverGradient: "from-primary/5 via-primary/5 to-transparent",
            iconColor: "text-primary",
            shadowColor: "group-hover:shadow-primary/10",
        },
        {
            icon: Zap,
            title: "Alto Rendimiento",
            description: "Arquitectura optimizada para manejar miles de lecturas por segundo sin degradación de performance.",
            gradient: "from-primary/10 to-transparent",
            hoverGradient: "from-primary/5 via-primary/5 to-transparent",
            iconColor: "text-primary",
            shadowColor: "group-hover:shadow-primary/10",
        },
    ]

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
                {/* Animated background gradients */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
                </div>

                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

                <div className="container px-4 md:px-6 relative z-10 mx-auto py-20">
                    <div className="flex flex-col items-center text-center max-w-6xl mx-auto">
                        <Badge
                            variant="outline"
                            className="mb-8 px-6 py-3 text-sm font-semibold border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 backdrop-blur-sm text-foreground shadow-lg hover:shadow-xl transition-all group"
                        >
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3 animate-pulse shadow-lg shadow-emerald-500/50" />
                            <span className="relative">
                                Proyecto de Tesis • Universidad ULEAM • 2026
                                <Sparkles className="inline-block w-4 h-4 ml-2 text-primary animate-pulse" />
                            </span>
                        </Badge>

                        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 text-balance leading-tight">
                            <span className="block mb-2 text-foreground">
                                Sistema IoT de
                            </span>
                            <span className="block text-primary animate-gradient bg-[length:200%_auto]">
                                Monitoreo Inteligente
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mb-14 leading-relaxed text-pretty font-medium">
                            Plataforma de{" "}
                            <span className="text-foreground font-semibold">visualización y gestión en tiempo real</span> para
                            sensores ESP32. Arquitectura robusta, escalable y orientada a la investigación académica de vanguardia.
                        </p>

                        <div className="flex flex-wrap justify-center gap-5 mb-20">
                            <Link to="/register">
                                <Button
                                    size="lg"
                                    className="h-16 px-10 text-lg font-semibold shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 bg-primary text-primary-foreground"
                                >
                                    Comenzar Ahora
                                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <a href="#features">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-16 px-10 text-lg font-semibold bg-background/50 backdrop-blur-sm hover:bg-background/80 border-2 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                                >
                                    Explorar Características
                                </Button>
                            </a>
                        </div>

                        <div className="grid grid-cols-3 gap-6 md:gap-10 w-full max-w-4xl">
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-background/40 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all hover:scale-105 shadow-lg">
                                <div className="text-4xl md:text-5xl font-extrabold text-emerald-600 mb-2">
                                    99.9%
                                </div>
                                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Uptime</div>
                            </div>
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-background/40 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all hover:scale-105 shadow-lg">
                                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                                    &lt;100ms
                                </div>
                                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Latencia</div>
                            </div>
                            <div className="flex flex-col items-center p-6 rounded-2xl bg-background/40 backdrop-blur-md border border-border/50 hover:border-primary/50 transition-all hover:scale-105 shadow-lg">
                                <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-2">
                                    ESP32
                                </div>
                                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Compatible</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
                        <div className="w-1.5 h-3 bg-primary/60 rounded-full animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-28 bg-muted/30 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
                </div>

                <div className="container px-4 md:px-6 mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <Badge variant="outline" className="mb-6 px-4 py-2 border-primary/20 bg-primary/5">
                            Tecnología de Vanguardia
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-balance text-foreground">
                            Características Principales
                        </h2>
                        <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-pretty leading-relaxed text-muted-foreground">
                            Tecnología de punta para el monitoreo y análisis de datos IoT con capacidades empresariales
                        </p>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 md:px-12">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent>
                                {features.map((feature, index) => (
                                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                        <div className="p-2 h-full">
                                            <Card
                                                className="border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl group h-full"
                                            >
                                                <CardHeader>
                                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                                        {React.createElement(feature.icon, { className: "text-primary h-7 w-7" })}
                                                    </div>
                                                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden md:flex -left-12" />
                            <CarouselNext className="hidden md:flex -right-12" />
                        </Carousel>
                    </div>
                </div>
            </section>

            {/* About / Mission / Vision */}
            <section id="about" className="py-28 bg-background relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
                </div>

                <div className="container px-4 md:px-6 mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <Badge variant="outline" className="mb-6 px-4 py-2 border-primary/20 bg-primary/5">
                            Nuestra Institución
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-balance">Universidad ULEAM</h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto">
                        <Card className="border-border/50 bg-background hover:bg-muted/30 transition-all duration-300 hover:shadow-lg hover:border-primary/20 group">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                </div>
                                <CardTitle className="text-xl font-bold">Quiénes Somos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    Proyecto de investigación de la Universidad ULEAM dedicado a integrar tecnologías IoT modernas con
                                    desarrollo web de última generación para impulsar la innovación tecnológica.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-background hover:bg-muted/30 transition-all duration-300 hover:shadow-lg hover:border-primary/20 group">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Target className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl font-bold">Misión</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    Democratizar el acceso a tecnologías IoT mediante una plataforma robusta y escalable que facilite la
                                    investigación científica y el análisis de datos en tiempo real a nivel académico y profesional.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-background hover:bg-muted/30 transition-all duration-300 hover:shadow-lg hover:border-primary/20 group">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Eye className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl font-bold">Visión</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    Ser referentes latinoamericanos en implementación de arquitecturas IoT open-source, impulsando la
                                    innovación tecnológica en el ámbito universitario, profesional e industrial.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
                </div>

                <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <Badge
                            variant="secondary"
                            className="mb-8 px-6 py-3 text-sm font-semibold bg-white/20 backdrop-blur-sm border-white/30 text-white"
                        >
                            Empieza Gratis Hoy
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-balance leading-tight">
                            Comienza a Monitorear con Tecnología de Vanguardia
                        </h2>
                        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 text-pretty leading-relaxed font-medium">
                            Únete a la próxima generación de sistemas IoT inteligentes y lleva tu investigación al siguiente nivel
                        </p>
                        <Link to="/register">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="h-16 px-12 text-lg font-bold shadow-2xl hover:shadow-white/20 hover:scale-110 transition-all duration-300 bg-white text-primary hover:bg-white/90"
                            >
                                Crear Cuenta Gratuita
                                <ArrowRight className="ml-3 h-6 w-6" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
