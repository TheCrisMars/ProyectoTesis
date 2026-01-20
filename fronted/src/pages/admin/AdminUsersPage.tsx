import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { adminService } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MoreHorizontal, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { UserFilters } from "./components/UserFilters";


interface UserData {
    id: number;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
    profile_image_url: string | null;
    created_at: string;
}

export function AdminUsersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // --- Filters State ---
    const [filters, setFilters] = useState({
        search: "",
        userId: null as number | null, // Added userId for precise selection
        role: "all",
        status: "all"
    });

    // --- Actions State ---
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // --- Edit Form State ---
    const [editForm, setEditForm] = useState({
        full_name: "",
        role: "user",
        is_active: true,
        password: ""
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminService.getUsers();
            setUsers(response);
        } catch (err) {
            console.error(err);
            setError("Error al cargar usuarios.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === "admin") {
            fetchUsers();
        } else {
            setLoading(false);
            setError("Acceso Denegado.");
        }
    }, [user]);

    // --- Filtering Logic ---
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            // User ID Filter (Precise Selection)
            if (filters.userId !== null) {
                return u.id === filters.userId;
            }

            // Search Filter (Legacy/Fallback)
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
                u.full_name.toLowerCase().includes(searchLower) ||
                u.email.toLowerCase().includes(searchLower);

            // Role Filter
            const matchesRole = filters.role === "all" || u.role === filters.role;

            // Status Filter
            let matchesStatus = true;
            if (filters.status === "active") matchesStatus = u.is_active;
            if (filters.status === "inactive") matchesStatus = !u.is_active;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, filters]);

    // --- Handlers ---
    const handleEditClick = (u: UserData) => {
        setSelectedUser(u);
        setEditForm({
            full_name: u.full_name || "",
            role: u.role,
            is_active: u.is_active,
            password: ""
        });
        setIsEditOpen(true);
    };

    const handleDeleteClick = (u: UserData) => {
        setSelectedUser(u);
        setIsDeleteOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;
        setActionLoading(true);
        try {
            const updatePayload: any = {
                full_name: editForm.full_name,
                role: editForm.role,
                is_active: editForm.is_active
            };
            if (editForm.password && editForm.password.length >= 6) {
                updatePayload.password = editForm.password;
            }

            await adminService.updateUser(selectedUser.id, updatePayload);
            toast.success("Usuario actualizado");
            setIsEditOpen(false);
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar usuario");
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;
        setActionLoading(true);
        try {
            await adminService.deleteUser(selectedUser.id);
            toast.success("Usuario eliminado");
            setIsDeleteOpen(false);
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar usuario");
        } finally {
            setActionLoading(false);
        }
    };

    const getImageUrl = (path: string | null) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        return `${baseUrl}${path}`;
    }

    if (loading) return <div className="flex h-[50vh] justify-center items-center"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="p-6 text-destructive">{error}</div>;

    return (
        <div className="container mx-auto p-6 max-w-6xl animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                    <p className="text-muted-foreground">
                        Administra los usuarios registrados en la plataforma.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-muted px-3 py-1 rounded-md text-sm font-medium">
                        Mostrando: {filteredUsers.length} / {users.length}
                    </span>
                    <DropdownMenu>
                        {/* ... (Menu content remains same if any) ... */}
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => fetchUsers()}>
                                Recargar Datos
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <UserFilters filters={filters} setFilters={setFilters} users={users} />

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Avatar</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No se encontraron usuarios con estos filtros.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={getImageUrl(u.profile_image_url)} />
                                                <AvatarFallback>{u.full_name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{u.full_name}</span>
                                                <span className="text-xs text-muted-foreground">{u.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={u.role === 'admin' ? "default" : "secondary"}>
                                                {u.role === 'admin' ? 'Administrador' : 'Usuario'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {u.is_active ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                                <span className="text-sm">{u.is_active ? 'Activo' : 'Inactivo'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEditClick(u)}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDeleteClick(u)} className="text-destructive focus:text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                        <DialogDescription>Modifica los permisos y datos del usuario.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input
                                id="name"
                                value={editForm.full_name}
                                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Rol</Label>
                            <Select
                                value={editForm.role}
                                onValueChange={(val: string) => setEditForm({ ...editForm, role: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">Usuario</SelectItem>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between border p-3 rounded-md">
                            <div className="space-y-0.5">
                                <Label className="text-base">Cuenta Activa</Label>
                                <p className="text-sm text-muted-foreground">Desactivar para bloquear acceso.</p>
                            </div>
                            <Switch
                                checked={editForm.is_active}
                                onCheckedChange={(checked: boolean) => setEditForm({ ...editForm, is_active: checked })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Nueva Contraseña (Opcional)</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Dejar en blanco para no cambiar"
                                value={editForm.password}
                                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveEdit} disabled={actionLoading}>
                            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario
                            <span className="font-bold"> {selectedUser?.email}</span> y todos sus datos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
