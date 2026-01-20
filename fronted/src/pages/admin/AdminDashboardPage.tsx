"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Wifi, Bell, Settings, Database, Download } from "lucide-react"

import { DashboardStats } from "./components/dashboard/DashboardStats"
import { UsersTab } from "./components/dashboard/UsersTab"
import { SensorsTab } from "./components/dashboard/SensorsTab"
import { LogsTab } from "./components/dashboard/LogsTab"
import { AlertsTab } from "./components/dashboard/AlertsTab"
import { ConfigTab } from "./components/dashboard/ConfigTab"

export function AdminDashboardPage() {
    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                        Panel de Administración
                    </h1>
                    <p className="text-muted-foreground mt-1">Gestión completa de usuarios, sensores y sistema IoT</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Exportar Datos
                    </Button>
                    <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                        <Settings className="h-4 w-4" />
                        Configuración
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <DashboardStats />

            {/* Main Tabs */}
            <Tabs defaultValue="users" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                    <TabsTrigger value="users" className="gap-2">
                        <Users className="h-4 w-4" />
                        Usuarios
                    </TabsTrigger>
                    <TabsTrigger value="sensors" className="gap-2">
                        <Wifi className="h-4 w-4" />
                        Sensores
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="gap-2">
                        <Database className="h-4 w-4" />
                        Logs
                    </TabsTrigger>
                    <TabsTrigger value="alerts" className="gap-2">
                        <Bell className="h-4 w-4" />
                        Alertas
                    </TabsTrigger>
                    <TabsTrigger value="config" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Config
                    </TabsTrigger>
                </TabsList>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-6">
                    <UsersTab />
                </TabsContent>

                {/* Sensors Tab */}
                <TabsContent value="sensors" className="space-y-6">
                    <SensorsTab />
                </TabsContent>

                {/* Logs Tab */}
                <TabsContent value="logs" className="space-y-6">
                    <LogsTab />
                </TabsContent>

                {/* Alerts Tab */}
                <TabsContent value="alerts" className="space-y-6">
                    <AlertsTab />
                </TabsContent>

                {/* Config Tab */}
                <TabsContent value="config" className="space-y-6">
                    <ConfigTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
