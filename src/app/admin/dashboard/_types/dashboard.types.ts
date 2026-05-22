// Dashboard API Response Types

export interface DashboardSummaryDTO {
    sales: SalesSection;
    inventory: InventorySection;
    customers: CustomerSection;
}

export interface SalesSection {
    totalRevenue: number;
    orderCount: number;
    averageOrderValue: number;
}

export interface InventorySection {
    criticalStockCount: number;
    topProducts: TopProductDTO[];
}

export interface CustomerSection {
    totalCustomers: number;
    newCustomersThisMonth: number;
    conversionRate: number;
}

export interface TopProductDTO {
    name: string;
    salesCount?: number;
    price: number;
}