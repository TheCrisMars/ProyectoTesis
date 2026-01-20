"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, LogOut, LayoutDashboard, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription } from "@/components/ui/sheet"
import { useAuth } from "@/context/AuthContext"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "@/components/ui/alert-dialog"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false) // State for Left Sidebar
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const navLinks = [
        { name: "Inicio", path: "/" },
        { name: "Características", path: "#features" },
        { name: "Nosotros", path: "#about" },
    ]

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    // Dashboard Links
    const dashboardLinks = [
        { name: "Mi Perfil", path: "/profile", icon: User },
        ...(user?.role === 'admin' ? [
            { name: "Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
            { name: "Usuarios", path: "/admin/users", icon: Users }
        ] : [
            { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        ])
    ]

    return (
        <nav className="border-b border-border/50 bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/50 sticky top-0 z-50 shadow-lg shadow-primary/5">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    {/* Logged In Left Menu (Sidebar trigger) */}
                    {isAuthenticated && (
                        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <SheetHeader>
                                    <SheetTitle>Menú Principal</SheetTitle>
                                    <SheetDescription>Accede a tus herramientas de monitoreo</SheetDescription>
                                </SheetHeader>
                                <div className="flex flex-col gap-4 mt-8">
                                    {dashboardLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setIsSidebarOpen(false)} // Close sidebar on click
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-lg font-medium"
                                        >
                                            <link.icon className="h-5 w-5 text-primary" />
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}

                    <Link
                        to="/"
                        className="flex items-center gap-3 font-bold text-xl hover:opacity-80 transition-all duration-300 hover:scale-105 group"
                    >
                        <img
                            src="/LOGO-ULEAM.png"
                            alt="ULEAM Logo"
                            className="h-10 w-auto group-hover:rotate-6 transition-transform duration-300"
                        />
                        <span className="text-primary text-2xl font-extrabold tracking-tight">
                            ULEAM IoT
                        </span>
                    </Link>
                </div>

                {/* Desktop Menu (Public) */}
                {!isAuthenticated ? (
                    <div className="hidden md:flex gap-10 items-center">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="text-base font-semibold text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}
                        <div className="flex gap-4 ml-6">
                            <Link to="/login">
                                <Button variant="ghost" className="font-semibold hover:bg-primary/10 transition-all duration-300">
                                    Iniciar Sesión
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button className="font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-accent">
                                    Registrarse
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Logged In User Menu (Right side) */
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium leading-none">Bienvenido</p>
                            <p className="text-sm text-muted-foreground">{user?.full_name || user?.email}</p>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={user?.profile_image_url ? (user.profile_image_url.startsWith('http') ? user.profile_image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${user.profile_image_url}`) : ""}
                                            alt={user?.full_name || "User"}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {user?.full_name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.full_name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/dashboard" className="cursor-pointer">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/profile" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Mi Perfil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 cursor-pointer focus:text-red-500">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Cerrar Sesión</span>
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                ¿Estás seguro de que quieres salir de tu cuenta?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleLogout}>Salir</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                {/* Mobile Menu (Public only - Logged in uses Left Sheet) */}
                {!isAuthenticated && (
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetTitle className="hidden">Menú de navegación</SheetTitle>
                                <div className="flex flex-col gap-6 mt-8">
                                    {navLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg font-medium hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                    <hr className="my-2 border-border/50" />
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full font-medium bg-transparent">
                                            Iniciar Sesión
                                        </Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full font-medium">Registrarse</Button>
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                )}
            </div>
        </nav>
    )
}
