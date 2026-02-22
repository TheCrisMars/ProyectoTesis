import React from "react";
import { Link } from "react-router-dom";

import { coursesCatalog } from "@/content/coursesCatalog";
import { useAuth } from "@/context/AuthContext";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Database,
  GraduationCap,
  Handshake,
  Shield,
  Wifi,
  Zap,
} from "lucide-react";

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const cacaoIotHref = isAuthenticated ? "/dashboard" : "/login";

  const services = [
    {
      icon: GraduationCap,
      title: "Cursos y capacitación",
      description:
        "Formación práctica presencial y online para estudiantes y profesionales: IoT, automatización, instrumentación y software.",
      href: "/cursos",
      cta: "Ver cursos",
    },
    {
      icon: Handshake,
      title: "Asesorías técnicas",
      description:
        "Acompañamiento en proyectos, revisión de diseño y orientación metodológica para avanzar con seguridad.",
      href: "/nosotros",
      cta: "Conócenos",
    },
    {
      icon: BadgeCheck,
      title: "Proyectos e implementación",
      description:
        "Desarrollo de soluciones con enfoque a resultados: prototipos, dashboards, integración de sensores y monitoreo.",
      href: "/#cacao-iot",
      cta: "Ver proyecto",
    },
  ];

  const cacaoFeatures = [
    {
      icon: Activity,
      title: "Monitoreo en Tiempo Real",
      description:
        "Visualización instantánea de datos de sensores con actualización automática, baja latencia y procesamiento en tiempo real.",
    },
    {
      icon: Database,
      title: "Almacenamiento Persistente",
      description:
        "Base de datos optimizada para históricos y análisis retrospectivo con capacidad de millones de registros.",
    },
    {
      icon: Wifi,
      title: "Conectividad ESP32",
      description:
        "Integración nativa con microcontroladores ESP32 mediante comunicación eficiente para telemetría.",
    },
    {
      icon: Shield,
      title: "Seguridad",
      description:
        "Autenticación y control de acceso para proteger la plataforma y los datos.",
    },
    {
      icon: Zap,
      title: "Alto Rendimiento",
      description:
        "Arquitectura optimizada para manejar lecturas frecuentes sin degradación de performance.",
    },
  ];

  const coursesPreview = coursesCatalog.flatMap((c) => c.courses).slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

        <div className="container px-4 md:px-6 relative z-10 mx-auto py-20">
          <div className="flex flex-col items-center text-center max-w-6xl mx-auto">
            <img
              src="/Logo-HMB.jpeg"
              alt="HMB Ingenierías Logo"
              className="h-24 w-24 object-contain mb-6"
            />
            <Badge
              variant="outline"
              className="mb-8 px-6 py-3 text-sm font-semibold border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 backdrop-blur-sm text-foreground shadow-lg hover:shadow-xl transition-all"
            >
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-3 animate-pulse shadow-lg shadow-emerald-500/50" />
              HMB Ingenierías • Cursos • Asesorías • Proyectos
            </Badge>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-balance leading-tight">
              <span className="block mb-2 text-foreground">Soluciones en</span>
              <span className="block text-primary animate-gradient bg-[length:200%_auto]">
                Ingeniería y Tecnología
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mb-12 leading-relaxed text-pretty font-medium">
              Formación y acompañamiento técnico para estudiantes y profesionales. Implementación de proyectos con enfoque
              práctico: IoT, automatización, instrumentación y dashboards.
            </p>

            <div className="flex flex-wrap justify-center gap-5 mb-14">
              <Link to="/cursos">
                <Button
                  size="lg"
                  className="h-16 px-10 text-lg font-semibold shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 bg-primary text-primary-foreground"
                >
                  Ver cursos
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link to="/#servicios">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-10 text-lg font-semibold bg-background/50 backdrop-blur-sm hover:bg-background/80 border-2 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                >
                  Ver servicios
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 w-full max-w-5xl">
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm shadow-lg">
                <CardHeader className="p-5">
                  <CardTitle className="text-base font-semibold flex items-center justify-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Formación práctica
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-sm text-muted-foreground">Presencial y online, con proyectos guiados.</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm shadow-lg">
                <CardHeader className="p-5">
                  <CardTitle className="text-base font-semibold flex items-center justify-center gap-2">
                    <Handshake className="h-4 w-4 text-primary" />
                    Acompañamiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-sm text-muted-foreground">Asesoría técnica para avanzar con claridad.</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm shadow-lg">
                <CardHeader className="p-5">
                  <CardTitle className="text-base font-semibold flex items-center justify-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-primary" />
                    Implementación
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-sm text-muted-foreground">Soluciones aplicadas a casos reales.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-28 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-primary/20 bg-primary/5">
              ¿Qué ofrecemos?
            </Badge>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-balance text-foreground">Servicios</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-pretty leading-relaxed text-muted-foreground">
              Capacitación, asesoría e implementación para llevar tus ideas a proyectos reales.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
            {services.map((s) => (
              <Card key={s.title} className="border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    {React.createElement(s.icon, { className: "text-primary h-7 w-7" })}
                  </div>
                  <CardTitle className="text-xl font-bold">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed text-sm">{s.description}</p>
                </CardContent>
                <CardFooter>
                  <Link to={s.href} className="w-full">
                    <Button variant="outline" className="w-full">
                      {s.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cursos */}
      <section id="cursos" className="py-28 bg-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-primary/20 bg-primary/5">
              Capacitación
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-balance">Cursos destacados</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-pretty leading-relaxed text-muted-foreground">
              Programas diseñados para aprender haciendo: teoría aplicada, ejercicios guiados y enfoque a resultados.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-7xl mx-auto">
            {coursesPreview.map((course) => (
              <Card key={course.slug} className="border-border/50 bg-background">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">{course.level}</Badge>
                    <Badge variant="outline" className="border-primary/20">
                      {course.modality}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed text-sm">{course.summary}</p>

                  <Separator />

                  <ul className="space-y-2">
                    {course.highlights.slice(0, 2).map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">{course.audience}</span>
                    <Link to={`/cursos/${course.slug}`}>
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link to="/cursos">
              <Button size="lg" className="h-14 px-10">
                Ver catálogo completo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cacao IoT */}
      <section id="cacao-iot" className="py-28 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-4 py-2 border-primary/20 bg-primary/5">
              Proyecto
            </Badge>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-balance text-foreground">Cacao IoT</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-pretty leading-relaxed text-muted-foreground">
              Aquí muestro el sistema ya construido: monitoreo con sensores, históricos en base de datos y
              visualización en tiempo real.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to={cacaoIotHref}>
                <Button size="lg" className="h-14 px-10">
                  {isAuthenticated ? "Abrir dashboard" : "Ver plataforma"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!isAuthenticated ? (
                <Link to="/register">
                  <Button size="lg" variant="outline" className="h-14 px-10">
                    Crear cuenta
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>

          <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-2 items-start">
            <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">ESP32</Badge>
                  <Badge variant="secondary">WebSocket</Badge>
                  <Badge variant="secondary">PostgreSQL</Badge>
                  <Badge variant="secondary">React</Badge>
                </div>
                <Separator />
                <ul className="space-y-2">
                  {cacaoFeatures.slice(0, 3).map((f) => (
                    <li key={f.title} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="min-w-0">{f.title}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="px-0 sm:px-4 md:px-0">
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent>
                  {cacaoFeatures.map((feature, index) => (
                    <CarouselItem key={index} className="md:basis-1/2">
                      <div className="p-2 h-full">
                        <Card className="border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl group h-full">
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
        </div>
      </section>

      {/* CTA */}
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
              Comienza hoy
            </Badge>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-balance leading-tight">
              Aprende, implementa y mejora tus proyectos
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 text-pretty leading-relaxed font-medium">
              Revisa el catálogo de cursos o mira el proyecto Cacao IoT.
            </p>
            <Link to="/cursos">
              <Button
                size="lg"
                variant="secondary"
                className="h-16 px-12 text-lg font-bold shadow-2xl hover:shadow-white/20 hover:scale-110 transition-all duration-300 bg-white text-primary hover:bg-white/90"
              >
                Ver cursos
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
