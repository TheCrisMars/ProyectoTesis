import { ControllerFormField } from "@/components/ControllerFormField"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { authService } from "@/services/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { jwtDecode } from "jwt-decode"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

const formSchema = z.object({
    username: z.string().min(3, { message: "El usuario debe tener al menos 3 caracteres" }),
    password: z.string().min(1, { message: "La contraseña es requerida" }),
})

export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await authService.login(values.username, values.password);

            if (response.token) {
                await login(response.token);

                try {
                    const decoded: any = jwtDecode(response.token);
                    const role = decoded.role;

                    toast.success("¡Bienvenido de vuelta!", {
                        duration: 3000,
                    });

                    setTimeout(() => {
                        if (role === 'admin') {
                            navigate("/admin/dashboard");
                        } else {
                            navigate("/dashboard");
                        }
                    }, 800);
                } catch (e) {
                    navigate("/dashboard");
                }
            }
        } catch (error: any) {
            console.error("Login failed:", error);
            if (!error?.response) {
                toast.error(
                    <div>
                        <b>Servidor no disponible</b>
                        <br />
                        <span className="text-sm">No se pudo conectar con el backend. Verifica la URL del API en producción.</span>
                    </div>,
                    { id: "login-server-error" }
                );
                return;
            }

            const errorMessage = error.response?.data?.detail;

            if (errorMessage === "User account is inactive") {
                toast.error(
                    <div>
                        <b>Cuenta Desactivada</b>
                        <br />
                        <span className="text-sm">Su cuenta ha sido desactivada, para más información contacte con el equipo.</span>
                    </div>,
                    {
                        duration: 5000,
                        id: "inactive-account-error"
                    }
                );
            } else {
                toast.error(
                    <div>
                        <b>Error de Credenciales</b>
                        <br />
                        <span className="text-sm">Verifica tu usuario y contraseña.</span>
                    </div>,
                    { id: "login-error" }
                );
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] relative overflow-hidden bg-background">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                <Card className="border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1 flex flex-col items-center">
                        <img
                            src="/Logo.svg"
                            alt="Cacao IoT Logo"
                            className="h-16 w-auto mb-2"
                        />
                        <CardTitle className="text-2xl font-bold text-center">Bienvenido de nuevo</CardTitle>
                        <CardDescription className="text-center">
                            Ingresa tus credenciales para acceder al panel de control
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <ControllerFormField
                                    form={form}
                                    name="username"
                                    label="Usuario"
                                >
                                    {(field) => (
                                        <Input
                                            placeholder="admin"
                                            {...field}
                                            className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                                        />
                                    )}
                                </ControllerFormField>

                                <ControllerFormField
                                    form={form}
                                    name="password"
                                    label="Contraseña"
                                >
                                    {(field) => (
                                        <Input
                                            type="password"
                                            placeholder="******"
                                            {...field}
                                            className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                                        />
                                    )}
                                </ControllerFormField>

                                <Button type="submit" className="w-full h-11 font-medium shadow-lg hover:shadow-primary/25 transition-all">
                                    Iniciar Sesión
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-border/50 pt-6 bg-muted/20">
                        <p className="text-sm text-muted-foreground">
                            ¿No tienes cuenta? <Link to="/register" className="text-primary hover:underline font-medium hover:text-primary/80 transition-colors">Regístrate aquí</Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
