import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ControllerFormField } from "@/components/ControllerFormField"
import { Link, useNavigate } from "react-router-dom"
import { authService } from "@/services/api"
import { toast } from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"

const formSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
})

export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await authService.login(values.email, values.password);

            if (response.access_token) {
                await login(response.access_token);
                // Fetch user directly here to decide redirect immediately
                const userProfile = await authService.getMe();
                const role = userProfile.data.role;

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
            }
        } catch (error: any) {
            console.error("Login failed:", error);
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
                        id: "inactive-account-error" // Prevents stacking
                    }
                );
            } else {
                toast.error(
                    <div>
                        <b>Error de Credenciales</b>
                        <br />
                        <span className="text-sm">Verifica tu email y contraseña.</span>
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
                    <CardHeader className="space-y-1">
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
                                    name="email"
                                    label="Correo Electrónico"
                                >
                                    {(field) => (
                                        <Input
                                            placeholder="usuario@ejemplo.com"
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
