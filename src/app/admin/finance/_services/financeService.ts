import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: `${API_BASE}/admin/finance`,
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

export const financeService = {
    // --- KUPONLAR ---
    getCoupons: async () => {
        const response = await axiosInstance.get('/coupons');
        return response.data;
    },

    createCoupon: async (couponData: any) => {
        const response = await axiosInstance.post('/coupons', couponData);
        return response.data;
    },

    updateCoupon: async (id: number, couponData: any) => {
        const response = await axiosInstance.put(`/coupons/${id}`, couponData);
        return response.data;
    },

    deleteCoupon: async (id: number) => {
        await axiosInstance.delete(`/coupons/${id}`);
    },

    // --- KARGO AYARLARI ---
    getShippingRules: async () => {
        const response = await axiosInstance.get('/shipping');
        return response.data;
    },

    createShippingRule: async (data: any) => {
        const response = await axiosInstance.post('/shipping', data);
        return response.data;
    },

    updateShippingRule: async (id: number, data: any) => {
        const response = await axiosInstance.put(`/shipping/${id}`, data);
        return response.data;
    },

    deleteShippingRule: async (id: number) => {
        await axiosInstance.delete(`/shipping/${id}`);
    },

    // --- ÖDEME YÖNTEMLERİ ---
    getPaymentMethods: async () => {
        const response = await axiosInstance.get('/payment-config');
        return response.data;
    },

    updatePaymentMethodStatus: async (id: number, active: boolean) => {
        const response = await axiosInstance.put(`/payment-config/${id}`, { active });
        return response.data;
    },

    updatePaymentConfig: async (config: any) => {
        const response = await axiosInstance.post('/payment-config', config);
        return response.data;
    },

    // --- PUBLIC ENDPOINTLER ---
    calculateShipping: async (amount: number, paymentMethod: string = "CREDIT_CARD") => {
        try {
            console.log("calculateShipping çağrılıyor:", { amount, paymentMethod });

            const response = await axios.get(`${API_BASE}/public/finance/calculate-shipping`, {
                params: { amount, paymentMethod }
            });

            console.log("calculateShipping yanıtı:", response.data);

            // Backend'den dönen yapıyı kontrol et ve varsayılan değerler ekle
            return {
                shippingPrice: response.data.shippingPrice ?? 0,
                extraFee: response.data.extraFee ?? 0,
                discount: response.data.discount ?? 0,
                totalIncrease: response.data.totalIncrease ?? 0
            };
        } catch (error) {
            console.error("calculateShipping hatası:", error);
            // Hata durumunda güvenli varsayılan değerler döndür
            return {
                shippingPrice: 0,
                extraFee: 0,
                discount: 0,
                totalIncrease: 0
            };
        }
    },

    validateCoupon: async (code: string, amount: number) => {
        try {
            const response = await axios.post(`${API_BASE}/public/finance/validate-coupon`, {
                code,
                amount
            });
            return response.data;
        } catch (error: any) {
            // Hata mesajını yakalayıp döndür
            if (error.response?.data) {
                throw new Error(error.response.data);
            }
            throw error;
        }
    },

    // --- İSTATİSTİKLER (YENİ) ---
    getDashboardStats: async () => {
        const response = await axiosInstance.get('/stats/dashboard');
        return response.data;
    },

    getPaymentStats: async () => {
        const response = await axiosInstance.get('/stats/payment-success-rate');
        return response.data;
    },

    getCouponPerformance: async () => {
        const response = await axiosInstance.get('/stats/coupon-performance');
        return response.data;
    }
};