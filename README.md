# 🎓 Plataforma de Tesis

Este proyecto es una aplicación web completa desarrollada para gestionar y visualizar datos relacionados con tesis. Consta de un backend robusto en Python y un frontend moderno en React.

## 🚀 Tecnologías Utilizadas

### Backend (API)
- **Framework:** FastAPI
- **Base de Datos:** PostgreSQL (con SQLAlchemy ORM)
- **Autenticación:** OAuth2 con JWT
- **Librerías Clave:** Pydantic, Alembic (migraciones), Python-Jose

### Frontend (Cliente Web)
- **Framework:** React 19 (con TypeScript)
- **Build Tool:** Vite
- **Estilos:** Tailwind CSS
- **Componentes:** Shadcn UI (basado en Radix UI)
- **Gráficos:** Recharts
- **Gestión de Estado/Formularios:** React Hook Form, Zod, Axios

---

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:
- [Git](https://git-scm.com/)
- [Python 3.10+](https://www.python.org/)
- [Node.js](https://nodejs.org/) (se recomienda v18+)
- [pnpm](https://pnpm.io/) (Gestor de paquetes)
- [PostgreSQL](https://www.postgresql.org/) (Base de datos)

---

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/TheCrisMars/ProyectoTesis.git
cd ProyectoTesis
```

### 2. Configurar el Backend (Carpeta `backend`)

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Crea un entorno virtual:
   ```bash
   python -m venv venv
   ```
3. Activa el entorno virtual:
   - **Windows:** `venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`
4. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
5. Configura las variables de entorno:
   - Crea un archivo `.env` basado en `.env.example`.
   - Asegúrate de configurar correctamente la `DATABASE_URL` de PostgreSQL.

### 3. Configurar el Frontend (Carpeta `fronted`)

1. Navega a la carpeta del frontend:
   ```bash
   cd ../fronted
   ```
2. Instala las dependencias:
   ```bash
   pnpm install
   ```
3. (Opcional) Configura el archivo `.env` si es necesario para la URL del backend.

---

## ▶️ Ejecución del Proyecto

Necesitarás dos terminales abiertas para correr el proyecto completo.

### Terminal 1: Backend
```bash
cd backend
# Asegúrate de tener el entorno virtual activado (venv\Scripts\activate)
python -m uvicorn app.main:app --reload --port 8080
```
El backend correrá en `http://localhost:8080`.

### Terminal 2: Frontend
```bash
cd fronted
pnpm run dev
```
El frontend correrá generalmente en `http://localhost:5173`.

---

## 🤝 Contribución

1. Haz un Fork del proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Haz Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
