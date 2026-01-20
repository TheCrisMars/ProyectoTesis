import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Form } from "@/components/ui/form"
import { ControllerFormField } from "@/components/ControllerFormField"
import { authService } from "@/services/api"

const registerSchema = z.object({
    full_name: z.string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder los 100 caracteres"),
    email: z.string()
        .email("Correo electrónico inválido")
        .max(100, "El correo no puede exceder los 100 caracteres"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
})


export function RegisterPage() {
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            full_name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof registerSchema>) => {
        try {
            await authService.register({
                email: values.email,
                password: values.password,
                fullName: values.full_name
            })
            toast.success(
                <div>
                    <b>¡Registro Exitoso!</b>
                    <br />
                    <span className="text-sm">Tu cuenta ha sido creada correctamente.</span>
                </div>,
                { duration: 3000 }
            );
            navigate("/login")
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 400 && error.response?.data?.detail === "Email already registered") {
                toast.error(
                    <div>
                        <b>Error en el Registro</b>
                        <br />
                        <span className="text-sm">Este correo electrónico ya está registrado.</span>
                    </div>,
                    { id: "register-error" }
                );
            } else {
                toast.error(
                    <div>
                        <b>Error en el Registro</b>
                        <br />
                        <span className="text-sm">Ocurrió un error al intentar registrarte. Inténtalo de nuevo.</span>
                    </div>,
                    { id: "register-error" }
                );
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Registro</CardTitle>
                    <CardDescription>Crea una nueva cuenta para acceder</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <ControllerFormField
                                form={form}
                                name="full_name"
                                label="Nombre Completo"
                                required
                            >
                                {(field) => (
                                    <Input placeholder="Juan Pérez" {...field} />
                                )}
                            </ControllerFormField>

                            <ControllerFormField
                                form={form}
                                name="email"
                                label="Correo Electrónico"
                                required
                            >
                                {(field) => (
                                    <Input type="email" placeholder="juan@ejemplo.com" {...field} />
                                )}
                            </ControllerFormField>

                            <ControllerFormField
                                form={form}
                                name="password"
                                label="Contraseña"
                                required
                            >
                                {(field) => (
                                    <Input type="password" placeholder="******" {...field} />
                                )}
                            </ControllerFormField>

                            <ControllerFormField
                                form={form}
                                name="confirmPassword"
                                label="Confirmar Contraseña"
                                required
                            >
                                {(field) => (
                                    <Input type="password" placeholder="******" {...field} />
                                )}
                            </ControllerFormField>

                            <Button type="submit" className="w-full">Registrarse</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia Sesión</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
