// Future endpoints:
//   GET  /api/stores?search=&category=
//   GET  /api/stores/:slug
//   PUT  /api/stores/:id           (vendor - store settings)
//   POST /api/stores               (created on vendor registration)
import { mockRequest } from "./api.js";
import { mockStores } from "../data/mockStores.js";

let stores = [...mockStores];

export const storeService = {
  list({ search = "", category = "all" } = {}) {
    return mockRequest(() => {
      let result = stores.filter((s) => s.status === "active");
      if (search) {
        const q = search.toLowerCase();
        result = result.filter((s) => s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q));
      }
      if (category !== "all") result = result.filter((s) => s.categories.includes(category));
      return result;
    });
  },

  getBySlug(slug) {
    return mockRequest(() => {
      const store = stores.find((s) => s.slug === slug);
      if (!store) throw new Error("Store not found.");
      return store;
    }, { delay: 300 });
  },

  getById(id) {
    return mockRequest(() => {
      const store = stores.find((s) => s.id === id);
      if (!store) throw new Error("Store not found.");
      return store;
    }, { delay: 200 });
  },

  getByOwnerId(ownerId) {
    return mockRequest(() => stores.find((s) => s.ownerId === ownerId) || stores[0], { delay: 200 });
  },

  update(id, data) {
    return mockRequest(() => {
      const idx = stores.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error("Store not found.");
      stores[idx] = { ...stores[idx], ...data };
      return stores[idx];
    });
  },

  updateStatus(id, status) {
    return mockRequest(() => {
      const idx = stores.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error("Store not found.");
      stores[idx].status = status;
      return stores[idx];
    });
  },

  all() {
    return mockRequest(() => stores, { delay: 250 });
  },
};
