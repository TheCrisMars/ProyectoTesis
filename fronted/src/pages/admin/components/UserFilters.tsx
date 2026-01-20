import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AutoComplete } from "@/components/ui/autocomplete";

interface UserFiltersProps {
    filters: {
        search: string;
        userId: number | null;
        role: string;
        status: string;
    };
    setFilters: (filters: any) => void;
    users: any[]; // Receive full list for autocomplete
}

export function UserFilters({ filters, setFilters, users }: UserFiltersProps) {
    const handleRoleChange = (role: string) => {
        setFilters({ ...filters, role });
    };

    const handleStatusChange = (status: string) => {
        setFilters({ ...filters, status });
    };

    // Transform users to options for autocomplete
    // Key is ID (Unique), Label is "Name (Email)" (Unique & Descriptive)
    const userOptions = users.map(u => ({
        key: String(u.id),
        label: `${u.full_name} (${u.email})`
    }));

    const handleSearchChange = (value: string) => {
        // value is the Key (ID) selected by AutoComplete
        const selectedId = value ? Number(value) : null;
        setFilters({ ...filters, userId: selectedId, search: "" });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <AutoComplete
                    data={userOptions}
                    value={filters.userId ? String(filters.userId) : ""}
                    onChange={handleSearchChange}
                    customPlaceholder="Buscar por nombre..."
                />
            </div>

            <div className="flex gap-4">
                <Select value={filters.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los Roles</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="user">Usuario</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={filters.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los Estados</SelectItem>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
