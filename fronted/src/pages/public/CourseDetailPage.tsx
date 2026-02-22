import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { coursesCatalog } from "@/content/coursesCatalog";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export function CourseDetailPage() {
  const { slug } = useParams();

  const allCourses = coursesCatalog.flatMap((c) => c.courses);
  const course = allCourses.find((c) => c.slug === slug);

  if (!course) {
    return (
      <div className="container px-4 md:px-6 mx-auto py-16">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Curso no encontrado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              El curso que buscas no existe o fue movido.
            </p>
            <Link to="/cursos">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a cursos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="py-16 md:py-20 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl">
            <Link to="/cursos" className="inline-flex">
              <Button variant="ghost" className="px-0">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Catálogo
              </Button>
            </Link>

            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-balance">
              {course.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">{course.level}</Badge>
              <Badge variant="outline" className="border-primary/20">
                {course.modality}
              </Badge>
            </div>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
              {course.summary}
            </p>

            <div className="mt-6 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Dirigido a:</span> {course.audience}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader>
                <CardTitle>Lo que aprenderás</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.highlights.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="min-w-0">{item}</span>
                    </li>
                  ))}
                </ul>

                {course.topics?.length ? (
                  <div className="mt-6">
                    <p className="text-sm font-semibold mb-2">Temas</p>
                    <Separator className="mb-4" />
                    <div className="flex flex-wrap gap-2">
                      {course.topics.map((topic) => (
                        <Badge key={topic} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Detalles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold">Dirigido a</p>
                  <p className="text-muted-foreground">{course.audience}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold">Modalidad</p>
                  <p className="text-muted-foreground">{course.modality}</p>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold">Nivel</p>
                  <p className="text-muted-foreground">{course.level}</p>
                </div>

                {course.topics?.length ? (
                  <>
                    <Separator />
                    <div>
                      <p className="font-semibold">Temas</p>
                      <p className="text-muted-foreground">{course.topics.length}</p>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
