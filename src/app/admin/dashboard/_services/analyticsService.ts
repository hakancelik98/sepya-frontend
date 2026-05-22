import axios from 'axios';
import type { DashboardSummaryDTO } from '../_types/dashboard.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: `${API_BASE}/admin/dashboard`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 saniye timeout
});

// Request interceptor - token ekleme
axiosInstance.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - hata yönetimi
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Sunucu yanıt verdi ama hata kodu döndü
            console.error('API Error:', error.response.status, error.response.data);

            if (error.response.status === 401) {
                // Unauthorized - token geçersiz veya yok
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            }
        } else if (error.request) {
            // İstek gönderildi ama yanıt alınamadı
            console.error('Network Error:', error.message);
        } else {
            // İstek hazırlanırken hata oluştu
            console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export const analyticsService = {
    /**
     * Dashboard özet verilerini getirir
     * @param dateRange - today, week, month, year, all, custom
     * @param startDate - Özel tarih aralığı için başlangıç (YYYY-MM-DD)
     * @param endDate - Özel tarih aralığı için bitiş (YYYY-MM-DD)
     */
    getDashboardSummary: async (
        dateRange: string = 'all',
        startDate?: string,
        endDate?: string
    ): Promise<DashboardSummaryDTO> => {
        try {
            const params: any = { dateRange };

            // Eğer custom tarih aralığı seçilmişse, startDate ve endDate ekle
            if (dateRange === 'custom' && startDate && endDate) {
                params.startDate = startDate;
                params.endDate = endDate;
            }

            const response = await axiosInstance.get<DashboardSummaryDTO>('/summary', {
                params
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch dashboard summary:', error);
            throw error;
        }
    },
};