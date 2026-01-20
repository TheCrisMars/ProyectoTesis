import axios from 'axios';

// --- Configuration ---
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Interceptor to add Token ---
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Auth Services ---
export const authService = {
    async login(email: string, password: string) {
        // OAuth2PasswordRequestForm expects form-data, not JSON
        const formData = new FormData();
        formData.append('username', email); // FASTAPI expects 'username' field
        formData.append('password', password);

        const response = await api.post('/token', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
        }
        return response.data;
    },

    async register(data: any) {
        return api.post('/users/', {
            email: data.email,
            password: data.password,
            full_name: data.fullName
        });
    },

    async getMe() {
        return api.get('/users/me');
    },

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    async updateProfile(data: { full_name?: string, email?: string, password?: string }) {
        return api.put('/users/me', data);
    },

    async uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/users/me/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    async deleteAvatar() {
        return api.delete('/users/me/avatar');
    },

    async deleteAccount() {
        return api.delete('/users/me');
    }
};

// --- Irrigation Types ---
export interface IrrigationZone {
    id: number;
    name: string;
    is_pump_active: boolean;
    mode: 'manual' | 'timer';
    last_watered: string | null;
    timer_seconds_remaining: number;
}

export const irrigationService = {
    async getZones() {
        const response = await api.get<IrrigationZone[]>('/irrigation/zones');
        return response.data;
    },

    async updateZone(id: number, data: Partial<IrrigationZone>) {
        const response = await api.put<IrrigationZone>(`/irrigation/zones/${id}`, data);
        return response.data;
    },

    async togglePump(id: number) {
        const response = await api.post<IrrigationZone>(`/irrigation/zones/${id}/toggle`);
        return response.data;
    },

    async setTimer(id: number, seconds: number) {
        const response = await api.post<IrrigationZone>(`/irrigation/zones/${id}/timer`, null, {
            params: { seconds }
        });
        return response.data;
    }
};

// --- Admin Services ---
export interface AdminStats {
    total_users: number;
    active_users_24h: number;
    system_uptime: string;
    inactive_users_7d: number;
}

export interface UserMessage {
    id: number;
    user_id: number;
    subject: string;
    message: string;
    created_at: string;
    is_read: boolean;
    user_email?: string;
}

export const adminService = {
    async getUsers() {
        // Updated path
        const response = await api.get('/admin/users');
        return response.data;
    },
    async updateUser(id: number, data: any) {
        // Updated path
        return api.put(`/admin/users/${id}`, data);
    },
    async getStats() {
        const response = await api.get<AdminStats>('/admin/stats');
        return response.data;
    },
    async getMessages() {
        const response = await api.get<UserMessage[]>('/admin/messages');
        return response.data;
    },
    async deleteUser(id: number) {
        return api.delete(`/admin/users/${id}`);
    }
};

export const userService = {
    async sendMessage(data: { subject: string, message: string }) {
        return api.post('/messages', data);
    }
}

export default api;
