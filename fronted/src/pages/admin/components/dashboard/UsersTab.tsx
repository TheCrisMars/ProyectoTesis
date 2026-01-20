
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Users, Search, Filter, MoreVertical, Edit, Shield, Ban, Trash2 } from "lucide-react"

// Mock data - Should be replaced with real API data
const mockUsers = [
    {
        id: "1",
        name: "Carlos Mendoza",
        email: "carlos.m@uleam.edu.ec",
        role: "Usuario",
        status: "active",
        lastLogin: "2026-01-12 10:30",
        devices: 3,
    },
    // ... rest of mock users from original file if needed, keeping it short for brevity or full if desired.
    // I will include all for consistency.
    { id: "2", name: "María González", email: "maria.g@uleam.edu.ec", role: "Usuario", status: "active", lastLogin: "2026-01-12 09:15", devices: 2 },
    { id: "3", name: "José Vera", email: "jose.v@uleam.edu.ec", role: "Admin", status: "active", lastLogin: "2026-01-12 11:45", devices: 5 },
    { id: "4", name: "Ana Torres", email: "ana.t@uleam.edu.ec", role: "Usuario", status: "inactive", lastLogin: "2026-01-05 14:20", devices: 1 },
    { id: "5", name: "Luis Ramírez", email: "luis.r@uleam.edu.ec", role: "Usuario", status: "banned", lastLogin: "2025-12-28 16:45", devices: 0 },
]

export function UsersTab() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [roleFilter, setRoleFilter] = useState("all")

    const filteredUsers = mockUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || user.status === statusFilter
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        return matchesSearch && matchesStatus && matchesRole
    })

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <CardTitle>Gestión de Usuarios</CardTitle>
                        <CardDescription>Administra usuarios, roles y permisos del sistema</CardDescription>
                    </div>
                    <Button className="gap-2">
                        <Users className="h-4 w-4" />
                        Agregar Usuario
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-[250px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="active">Activos</SelectItem>
                            <SelectItem value="inactive">Inactivos</SelectItem>
                            <SelectItem value="banned">Bloqueados</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los roles</SelectItem>
                            <SelectItem value="Admin">Administrador</SelectItem>
                            <SelectItem value="Usuario">Usuario</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                {/* Users Table */}
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox />
                                </TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Dispositivos</TableHead>
                                <TableHead>Último Acceso</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.status === "active"
                                                    ? "default"
                                                    : user.status === "inactive"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                        >
                                            {user.status === "active"
                                                ? "Activo"
                                                : user.status === "inactive"
                                                    ? "Inactivo"
                                                    : "Bloqueado"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.devices}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2">
                                                    <Edit className="h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2">
                                                    <Shield className="h-4 w-4" />
                                                    Cambiar Rol
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2">
                                                    <Ban className="h-4 w-4" />
                                                    Bloquear
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Mostrando {filteredUsers.length} de {mockUsers.length} usuarios
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            Anterior
                        </Button>
                        <Button variant="outline" size="sm">
                            Siguiente
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
