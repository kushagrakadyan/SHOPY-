// Future endpoints:
//   GET    /api/products?search=&category=&storeId=&sort=&page=
//   GET    /api/products/:id
//   POST   /api/products                (vendor)
//   PUT    /api/products/:id            (vendor)
//   DELETE /api/products/:id            (vendor)
import { mockRequest } from "./api.js";
import { mockProducts, categories as mockCategories } from "../data/mockProducts.js";

let products = [...mockProducts];

export const productService = {
  list({ search = "", category = "all", storeId, sort = "relevance", minPrice, maxPrice, page = 1, pageSize = 12 } = {}) {
    return mockRequest(() => {
      let result = [...products];
      if (storeId) result = result.filter((p) => p.storeId === storeId);
      if (search) {
        const q = search.toLowerCase();
        result = result.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      }
      if (category && category !== "all") result = result.filter((p) => p.category === category);
      if (minPrice != null) result = result.filter((p) => p.price >= minPrice);
      if (maxPrice != null) result = result.filter((p) => p.price <= maxPrice);

      switch (sort) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          result.sort((a, b) => b.id.localeCompare(a.id));
          break;
        default:
          break;
      }

      const total = result.length;
      const start = (page - 1) * pageSize;
      const paginated = result.slice(start, start + pageSize);
      return { items: paginated, total, page, pageSize, hasMore: start + pageSize < total };
    });
  },

  getById(id) {
    return mockRequest(() => {
      const product = products.find((p) => p.id === id);
      if (!product) throw new Error("Product not found.");
      return product;
    }, { delay: 300 });
  },

  getRelated(product, limit = 4) {
    return mockRequest(() => {
      return products
        .filter((p) => p.id !== product.id && (p.category === product.category || p.storeId === product.storeId))
        .slice(0, limit);
    }, { delay: 250 });
  },

  featured(limit = 8) {
    return mockRequest(() => products.filter((p) => p.featured).slice(0, limit), { delay: 300 });
  },

  trending(limit = 8) {
    return mockRequest(() => products.filter((p) => p.trending).slice(0, limit), { delay: 300 });
  },

  categories() {
    return mockRequest(() => mockCategories, { delay: 100 });
  },

  create(storeId, data) {
    return mockRequest(() => {
      const newProduct = {
        id: `p-${Date.now()}`,
        storeId,
        rating: 0,
        reviewCount: 0,
        images: data.images?.length ? data.images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop"],
        variants: data.variants || {},
        featured: false,
        trending: false,
        ...data,
      };
      products = [newProduct, ...products];
      return newProduct;
    });
  },

  update(id, data) {
    return mockRequest(() => {
      const idx = products.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Product not found.");
      products[idx] = { ...products[idx], ...data };
      return products[idx];
    });
  },

  remove(id) {
    return mockRequest(() => {
      products = products.filter((p) => p.id !== id);
      return { success: true };
    });
  },
};
