import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { coursesCatalog } from "@/content/coursesCatalog";
import { BookOpen, CheckCircle2, Layers3, MonitorSmartphone, Users } from "lucide-react";
import { Link } from "react-router-dom";

export function CoursesPage() {
  const defaultTab = coursesCatalog[0]?.id ?? "iot";
  const totalCourses = coursesCatalog.reduce((acc, c) => acc + c.courses.length, 0);

  return (
    <div className="flex flex-col">
      <section className="py-16 md:py-20 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-5xl">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5">
              Formación • Presencial y Online
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance">
              Cursos y Capacitación
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed text-pretty">
              Programas prácticos para estudiantes y profesionales: aprende con ejercicios guiados, proyectos y enfoque a
              resultados.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardHeader className="p-5">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {totalCourses} cursos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-sm text-muted-foreground">Organizados por áreas de aprendizaje.</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardHeader className="p-5">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <MonitorSmartphone className="h-4 w-4 text-primary" />
                    Modalidad flexible
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-sm text-muted-foreground">Presencial u online según el curso.</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                <CardHeader className="p-5">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Enfoque práctico
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-sm text-muted-foreground">Ejercicios, ejemplos y casos reales.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Catálogo</h2>
            <p className="mt-2 text-muted-foreground">
              Elige un área y revisa los cursos disponibles.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card className="border-border/50">
              <CardHeader className="p-5">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Layers3 className="h-4 w-4 text-primary" />
                  Áreas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <p className="text-sm text-muted-foreground">IoT, Automatización, Software y Datos.</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="p-5">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Aprendizaje
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <p className="text-sm text-muted-foreground">Contenido directo a lo aplicable.</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader className="p-5">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Ruta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <p className="text-sm text-muted-foreground">Revisa el detalle de cada curso.</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
              {coursesCatalog.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="whitespace-nowrap">
                  <span className="flex items-center gap-2">
                    {category.label}
                    <Badge variant="secondary" className="h-5 px-2">
                      {category.courses.length}
                    </Badge>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {coursesCatalog.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-8">
                <div className="mb-6">
                  <h3 className="text-xl md:text-2xl font-bold">{category.label}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed max-w-4xl">
                    {category.description}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {category.courses.map((course) => (
                    <Card key={course.slug} className="border-border/50 bg-background hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="secondary">{course.level}</Badge>
                          <Badge variant="outline" className="border-primary/20">
                            {course.modality}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">{course.summary}</p>

                        <Separator />

                        <div>
                          <p className="text-sm font-semibold mb-2">Lo que aprenderás</p>
                          <ul className="space-y-2">
                            {course.highlights.slice(0, 3).map((item) => (
                              <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <span className="min-w-0">{item}</span>
                              </li>
                            ))}
                          </ul>

                          {course.highlights.length > 3 ? (
                            <p className="mt-2 text-xs text-muted-foreground">
                              +{course.highlights.length - 3} más en el detalle.
                            </p>
                          ) : null}
                        </div>
                      </CardContent>

                      <CardFooter className="flex items-center justify-between gap-3">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">Dirigido a:</span> {course.audience}
                        </div>
                        <Link to={`/cursos/${course.slug}`}>
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
}
