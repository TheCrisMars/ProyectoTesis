import { Link } from "react-router-dom"
import { Activity, Linkedin, Twitter, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-background/95 backdrop-blur-xl pt-10 pb-6">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-8 lg:grid-cols-4 mb-12">
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
                            <img src="/LOGO-ULEAM.png" alt="ULEAM Logo" className="h-8 w-auto" />
                            <span className="text-primary">ULEAM IoT</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            Plataforma de monitoreo inteligente para la gestión de sensores ESP32. Proyecto de tesis 2026.
                        </p>
                        <div className="flex gap-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                                <Github className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Plataforma</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
                            <li><Link to="/#features" className="hover:text-primary transition-colors">Características</Link></li>
                            <li><Link to="/#about" className="hover:text-primary transition-colors">Nosotros</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Legales</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="#" className="hover:text-primary transition-colors">Términos de Servicio</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Cookies</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Boletín</h3>
                        <p className="text-sm text-muted-foreground">Suscríbete para recibir actualizaciones del proyecto.</p>
                        <div className="flex gap-2">
                            <Input placeholder="tu@email.com" className="bg-background" />
                            <Button size="icon"><Activity className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© 2026 Universidad ULEAM. Todos los derechos reservados.</p>
                    <p className="flex items-center gap-1">
                        Desarrollado por Cristhian Marcelo Ortiz Macías de la ULEAM
                    </p>
                </div>
            </div>
        </footer>
    )
}
