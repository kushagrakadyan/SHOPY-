// Mock user records. In production these live in MongoDB (Users collection)
// and passwords are hashed with bcrypt.js — never stored in plain text.
export const mockUsers = [
  {
    id: "u-1001",
    name: "Aditi Rao",
    email: "customer@shopy.dev",
    password: "password123",
    role: "customer",
    avatar: "https://i.pravatar.cc/150?img=47",
    createdAt: "2025-11-02",
  },
  {
    id: "u-2001",
    name: "Kabir Mehta",
    email: "vendor@shopy.dev",
    password: "password123",
    role: "vendor",
    storeId: "st-01",
    avatar: "https://i.pravatar.cc/150?img=12",
    createdAt: "2025-08-14",
  },
  {
    id: "u-9001",
    name: "Zara Khan",
    email: "admin@shopy.dev",
    password: "password123",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?img=32",
    createdAt: "2025-01-01",
  },
];
