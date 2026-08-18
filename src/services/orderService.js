// Future endpoints:
//   GET  /api/orders?customerId=&storeId=
//   GET  /api/orders/:id
//   POST /api/orders                        (checkout)
//   PATCH /api/orders/:id/status             (vendor)
import { mockRequest } from "./api.js";
import { mockOrders } from "../data/mockOrders.js";

let orders = [...mockOrders];

export const orderService = {
  listForCustomer(customerId) {
    return mockRequest(() => orders.filter((o) => o.customerId === customerId));
  },

  listForStore(storeId) {
    return mockRequest(() => orders.filter((o) => o.storeId === storeId));
  },

  getById(id) {
    return mockRequest(() => {
      const order = orders.find((o) => o.id === id);
      if (!order) throw new Error("Order not found.");
      return order;
    }, { delay: 250 });
  },

  create(orderData) {
    return mockRequest(() => {
      const newOrder = {
        id: `ORD-${Math.floor(90000 + Math.random() * 9000)}`,
        status: "pending",
        placedAt: new Date().toISOString().slice(0, 10),
        ...orderData,
      };
      orders = [newOrder, ...orders];
      return newOrder;
    }, { delay: 900 });
  },

  updateStatus(id, status) {
    return mockRequest(() => {
      const idx = orders.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error("Order not found.");
      orders[idx] = { ...orders[idx], status };
      return orders[idx];
    }, { delay: 300 });
  },
};
