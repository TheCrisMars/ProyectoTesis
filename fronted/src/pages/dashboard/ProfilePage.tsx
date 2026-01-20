import { useState } from "react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { userService, authService } from "@/services/api"
import { toast } from "react-hot-toast"
import { Camera, Trash2, Loader2, AlertTriangle, ShieldCheck, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

// Helper to construct full image URL
const getImageUrl = (path: string | null) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const baseUrl = import.meta.env.VITE_API_URL;
    return `${baseUrl}${path}`;
}

const profileFormSchema = z.object({
    fullName: z.string()
        .min(3, { message: "El nombre debe tener al menos 3 caracteres." })
        .max(50, { message: "El nombre no puede exceder los 50 caracteres." }),
    email: z.string().email(),
    password: z.string()
        .max(50, { message: "La contraseña no puede exceder los 50 caracteres." })
        .optional()
        .or(z.literal("")),
}).refine(data => {
    if (data.password && data.password.length > 0 && data.password.length < 6) {
        return false;
    }
    return true;
}, {
    message: "La contraseña debe tener al menos 6 caracteres si decides cambiarla.",
    path: ["password"]
});

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfilePage() {
    const { user, logout, refreshUser } = useAuth();
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: user?.full_name || "",
            email: user?.email || "",
            password: "",
        },
        mode: "onChange",
    })

    // --- Image Upload Handler ---
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await authService.uploadAvatar(file);
            await refreshUser();
            toast.success("Foto de perfil actualizada");
        } catch (error) {
            console.error(error);
            toast.error("Error al subir imagen");
        } finally {
            setIsUploading(false);
        }
    };

    // --- Profile Update Handler ---
    async function onSubmit(data: ProfileFormValues) {
        try {
            const updateData: any = { full_name: data.fullName };

            if (data.password && data.password.length >= 6) {
                updateData.password = data.password;
            }

            await authService.updateProfile(updateData);
            await refreshUser();

            toast.success("Perfil actualizado correctamente");
            form.setValue("password", "");
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar perfil");
        }
    }

    // --- Delete Account Handler ---
    const handleDeleteAccount = async () => {
        try {
            await authService.deleteAccount();
            logout();
            toast.success("Cuenta eliminada permanentemente");
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar cuenta");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

            <Card className="overflow-hidden">
                <div className="grid md:grid-cols-[300px_1fr] divide-y md:divide-y-0 md:divide-x divide-border">
                    {/* Sidebar / Avatar Section */}
                    <div className="p-8 flex flex-col items-center text-center bg-muted/10">
                        <div className="group relative mb-6 h-40 w-40 cursor-pointer rounded-full overflow-hidden ring-4 ring-background shadow-xl transition-all hover:ring-primary/20">
                            <Avatar className="h-full w-full">
                                <AvatarImage
                                    src={getImageUrl(user?.profile_image_url || null)}
                                    alt={user?.full_name || "Profile"}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-5xl bg-primary/5 text-primary">
                                    {user?.full_name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>

                            {/* Overlay */}
                            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer text-white">
                                {isUploading ? (
                                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                ) : (
                                    <Camera className="h-8 w-8 mb-2" />
                                )}
                                <span className="text-xs font-medium">Cambiar Foto</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>

                        {/* Delete Avatar Button */}
                        {user?.profile_image_url && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="mb-4 text-destructive hover:text-destructive hover:bg-destructive/10 h-8">
                                        <Trash2 className="w-4 h-4 mr-2" /> Eliminar foto
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Eliminar foto de perfil?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción eliminará tu foto actual y volverás a tener el avatar por defecto.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={async () => {
                                            try {
                                                await authService.deleteAvatar();
                                                await refreshUser();
                                                toast.success("Foto eliminada");
                                            } catch (error) {
                                                console.error(error);
                                                toast.error("Error al eliminar foto");
                                            }
                                        }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Eliminar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}



                        <div className="space-y-1 mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">{user?.full_name}</h2>
                            <p className="text-sm text-muted-foreground break-all">{user?.email}</p>
                        </div>

                        <div className="flex gap-2 justify-center w-full">
                            <Badge variant={user?.role === 'admin' ? "default" : "secondary"} className="uppercase tracking-widest text-[10px]">
                                {user?.role === 'admin' ? (
                                    <><ShieldCheck className="w-3 h-3 mr-1" /> Admin</>
                                ) : "Usuario"}
                            </Badge>
                            <Badge variant={user?.is_active ? "outline" : "destructive"} className="uppercase tracking-widest text-[10px] border-green-500/50 text-green-700 bg-green-50">
                                {user?.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>
                    </div>

                    {/* Main Content / Form Section */}
                    <div className="p-8">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium leading-none mb-1">Editar Información</h3>
                            <p className="text-sm text-muted-foreground">
                                Actualiza tus datos personales y credenciales de acceso.
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(() => document.getElementById("trigger-profile-update")?.click())} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre Completo</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-background/50" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Correo Electrónico</FormLabel>
                                                <FormControl>
                                                    <Input {...field} disabled className="bg-muted opacity-80" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="max-w-md">
                                            <FormLabel>Contraseña</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} className="bg-background/50" />
                                            </FormControl>
                                            <p className="text-[0.8rem] text-muted-foreground">
                                                Déjalo en blanco si no quieres cambiarla. Mínimo 6 caracteres.
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-between items-center border-t border-border/50">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full sm:w-auto">
                                                <MessageSquare className="w-4 h-4 mr-2" /> Contactar Soporte
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Contactar al Administrador</DialogTitle>
                                                <DialogDescription>
                                                    Envía un mensaje directo al soporte técnico.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={async (e) => {
                                                e.preventDefault();
                                                const formData = new FormData(e.currentTarget);
                                                try {
                                                    await userService.sendMessage({
                                                        subject: formData.get("subject") as string,
                                                        message: formData.get("message") as string
                                                    });
                                                    toast.success("Mensaje enviado");
                                                    (document.querySelector('[data-state="open"]') as HTMLElement)?.click(); // Hack to close dialog or use state control
                                                } catch (err) {
                                                    toast.error("Error al enviar mensaje");
                                                }
                                            }} className="space-y-4 pt-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="subject">Asunto</Label>
                                                    <Input id="subject" name="subject" required placeholder="Ayuda con..." />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="message">Mensaje</Label>
                                                    <Textarea id="message" name="message" required placeholder="Describe tu problema..." />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">Enviar Mensaje</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button type="button" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto">
                                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar Cuenta
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <div className="flex items-center gap-2 text-destructive mb-2">
                                                    <AlertTriangle className="h-6 w-6" />
                                                    <AlertDialogTitle>Zona de Peligro</AlertDialogTitle>
                                                </div>
                                                <div className="space-y-2">
                                                    <AlertDialogDescription>
                                                        Estás a punto de eliminar tu cuenta permanentemente. Esta acción <strong>no se puede deshacer</strong>.
                                                    </AlertDialogDescription>
                                                    <div className="rounded-md bg-destructive/10 p-4 mt-2">
                                                        <p className="text-sm font-medium text-destructive">
                                                            Advertencia: Perderás acceso a todos sus sensores y datos históricos.
                                                        </p>
                                                    </div>
                                                </div>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Mejor no</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                    Sí, eliminar cuenta
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    {/* Update Profile Confirmation Dialog */}
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button id="trigger-profile-update" className="hidden">Trigger</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Guardar cambios?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Estás a punto de actualizar tu información de perfil.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
                                                    Confirmar cambios
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <Button type="button" onClick={() => document.getElementById("trigger-profile-update")?.click()} disabled={form.formState.isSubmitting} className="w-full sm:w-auto min-w-[150px] shadow-lg hover:shadow-primary/25">
                                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Guardar Cambios
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </Card>
        </div>
    )
}
