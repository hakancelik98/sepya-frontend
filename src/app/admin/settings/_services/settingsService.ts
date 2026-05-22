import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Base URL'i bir tık yukarı, /admin seviyesine çektik
const axiosInstance = axios.create({
    baseURL: `${API_BASE}/admin`,
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Ayarlar Servisi (Settings)
export const settingsService = {
    getSettings: async () => {
        const response = await axiosInstance.get('/settings');
        return response.data;
    },
    updateSection: async (section: string, data: any) => {
        const response = await axiosInstance.patch(`/settings/${section}`, data);
        return response.data;
    },
    testSmtp: async (smtpData: any) => {
        const response = await axiosInstance.post('/settings/test-smtp', smtpData);
        return response.data;
    }
};

// Email Yönetim Servisi (Templates, Logs, Stats)
export const emailManagerService = {
    // --- TEMPLATES ---
    getTemplates: async () => {
        const response = await axiosInstance.get('/email/templates');
        return response.data;
    },

    getTemplate: async (id: number) => {
        const response = await axiosInstance.get(`/email/templates/${id}`);
        return response.data;
    },

    createTemplate: async (templateData: any) => {
        const response = await axiosInstance.post('/email/templates', templateData);
        return response.data;
    },

    updateTemplate: async (id: number, templateData: any) => {
        const response = await axiosInstance.put(`/email/templates/${id}`, templateData);
        return response.data;
    },

    deleteTemplate: async (id: number) => {
        await axiosInstance.delete(`/email/templates/${id}`);
    },

    toggleTemplate: async (id: number) => {
        const response = await axiosInstance.patch(`/email/templates/${id}/toggle`);
        return response.data;
    },

    sendTestEmail: async (templateId: number, testData: any) => {
        const response = await axiosInstance.post(`/email/templates/${templateId}/test`, testData);
        return response.data;
    },

    // --- LOGS ---
    getLogs: async (page: number = 0, size: number = 50) => {
        const response = await axiosInstance.get('/email/logs', {
            params: { page, size }
        });
        return response.data;
    },

    getLogsByOrder: async (orderId: number) => {
        const response = await axiosInstance.get(`/email/logs/order/${orderId}`);
        return response.data;
    },

    // --- STATS ---
    getStats: async () => {
        const response = await axiosInstance.get('/email/stats');
        return response.data;
    }
};