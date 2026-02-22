import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Eye, Target } from "lucide-react";

export function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="py-16 md:py-20 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="max-w-4xl">
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5">
              Nosotros
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance">
              Misión, Visión y Valores
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed text-pretty">
              Conoce el propósito del proyecto y el enfoque que guía el desarrollo de la plataforma.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-border/50 bg-background">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl font-bold">Quiénes Somos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Proyecto académico orientado a integrar tecnologías IoT modernas con desarrollo web para monitoreo,
                  análisis y visualización de datos en tiempo real.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-background">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Misión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Facilitar el acceso a tecnologías IoT mediante una plataforma robusta y escalable, útil para investigación,
                  docencia y aplicaciones reales de monitoreo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-background">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold">Visión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Ser un referente académico en soluciones IoT open-source, promoviendo innovación, buenas prácticas y
                  desarrollo tecnológico con impacto.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 md:grid-cols-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">Rigor:</span>
                    <span>decisiones basadas en datos y pruebas.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">Transparencia:</span>
                    <span>arquitectura clara y documentada.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">Seguridad:</span>
                    <span>protección de datos y control de acceso.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-foreground">Usabilidad:</span>
                    <span>interfaces simples y comprensibles.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
