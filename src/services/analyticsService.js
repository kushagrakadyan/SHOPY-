// Future endpoints:
//   GET /api/analytics/vendor/:storeId
//   GET /api/analytics/platform
import { mockRequest } from "./api.js";
import { vendorSalesSeries, platformSeries, topProducts } from "../data/mockAnalytics.js";
import { mockOrders } from "../data/mockOrders.js";
import { mockProducts } from "../data/mockProducts.js";
import { mockStores } from "../data/mockStores.js";
import { mockUsers } from "../data/mockUsers.js";

export const analyticsService = {
  vendorOverview(storeId) {
    return mockRequest(() => {
      const storeOrders = mockOrders.filter((o) => o.storeId === storeId);
      const storeProducts = mockProducts.filter((p) => p.storeId === storeId);
      const revenue = storeOrders.reduce((sum, o) => sum + o.total, 0);
      const lowStock = storeProducts.filter((p) => p.stock > 0 && p.stock <= 10).length;
      const outOfStock = storeProducts.filter((p) => p.stock === 0).length;
      return {
        totalSales: revenue,
        totalOrders: storeOrders.length,
        totalProducts: storeProducts.length,
        lowStockCount: lowStock,
        outOfStockCount: outOfStock,
        recentOrders: storeOrders.slice(0, 5),
        salesSeries: vendorSalesSeries,
        topProducts: topProducts.slice(0, 3),
      };
    }, { delay: 450 });
  },

  platformOverview() {
    return mockRequest(() => {
      const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0);
      return {
        totalVendors: mockUsers.filter((u) => u.role === "vendor").length + 154,
        totalCustomers: mockUsers.filter((u) => u.role === "customer").length + 4820,
        totalStores: mockStores.length + 154,
        totalProducts: mockProducts.length + 1180,
        totalOrders: mockOrders.length + 3260,
        totalRevenue: totalRevenue + 9800000,
        series: platformSeries,
        topProducts,
      };
    }, { delay: 500 });
  },
};
