const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/admin/customers`;

export const customerService = {
    // Tüm müşterileri getir (sayfalama ile)
    async getAllCustomers(page = 0, size = 10, sortBy = "createdAt", sortDir = "desc") {
        const token = localStorage.getItem("token");
        const res = await fetch(
            `${BASE_URL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
            {
                headers: { "Authorization": `Bearer ${token}` }
            }
        );

        if (!res.ok) throw new Error(`Müşteriler yüklenemedi: ${res.status}`);
        return res.json();
    },

    // Tüm müşterileri getir (sayfalama olmadan - export için)
    async getAllCustomersWithoutPagination() {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/all`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(`Müşteriler yüklenemedi: ${res.status}`);
        return res.json();
    },

    // Müşteri ara
    async searchCustomers(query: string, page = 0, size = 10, sortBy = "createdAt", sortDir = "desc") {
        const token = localStorage.getItem("token");
        const res = await fetch(
            `${BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
            {
                headers: { "Authorization": `Bearer ${token}` }
            }
        );

        if (!res.ok) throw new Error(`Arama başarısız: ${res.status}`);
        return res.json();
    },

    // Role göre filtrele
    async getCustomersByRole(role: string, page = 0, size = 10, sortBy = "createdAt", sortDir = "desc") {
        const token = localStorage.getItem("token");
        const res = await fetch(
            `${BASE_URL}/filter/role?role=${role}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
            {
                headers: { "Authorization": `Bearer ${token}` }
            }
        );

        if (!res.ok) throw new Error(`Filtreleme başarısız: ${res.status}`);
        return res.json();
    },

    // Tarih aralığına göre filtrele
    async getCustomersByDateRange(
        start: string,
        end: string,
        page = 0,
        size = 10,
        sortBy = "createdAt",
        sortDir = "desc"
    ) {
        const token = localStorage.getItem("token");
        const res = await fetch(
            `${BASE_URL}/filter/date?start=${start}&end=${end}&page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
            {
                headers: { "Authorization": `Bearer ${token}` }
            }
        );

        if (!res.ok) throw new Error(`Tarih filtresi başarısız: ${res.status}`);
        return res.json();
    },

    // Müşteri detaylarını getir
    async getCustomerById(id: string) {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(`Müşteri detayı yüklenemedi: ${res.status}`);
        return res.json();
    },

    // Müşteri rolünü güncelle
    async updateRole(id: string, role: string) {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/${id}/role`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role })
        });

        if (!res.ok) throw new Error(`Rol güncellemesi başarısız: ${res.status}`);
        return res.json();
    },

    // Toplu rol güncelleme
    async bulkUpdateRole(customerIds: number[], role: string) {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/bulk/role`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ customerIds, role })
        });

        if (!res.ok) throw new Error(`Toplu rol güncellemesi başarısız: ${res.status}`);
        return res.json();
    },

    // Müşteri hesabını dondur/aktifleştir
    async toggleCustomerStatus(id: string, isActive: boolean) {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/${id}/status`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ isActive })
        });

        if (!res.ok) throw new Error(`Durum değişikliği başarısız: ${res.status}`);
        return res.json();
    },

    // Müşteri sil
    async deleteCustomer(id: string) {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(`Müşteri silinemedi: ${res.status}`);
        return res.json();
    },

    // Toplu müşteri silme
    async bulkDeleteCustomers(customerIds: number[]) {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/bulk`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ customerIds })
        });

        if (!res.ok) throw new Error(`Toplu silme başarısız: ${res.status}`);
        return res.json();
    },

    // Dashboard istatistikleri
    async getStatistics() {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/stats`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(`İstatistikler yüklenemedi: ${res.status}`);
        return res.json();
    }
};