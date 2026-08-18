// Future endpoints this maps to:
//   POST /api/auth/login
//   POST /api/auth/register/customer
//   POST /api/auth/register/vendor
//   POST /api/auth/forgot-password
//   POST /api/auth/reset-password
//   GET  /api/auth/me
import { mockRequest } from "./api.js";
import { mockUsers } from "../data/mockUsers.js";

let users = [...mockUsers];

function toSafeUser(user) {
  // Never expose password hashes to the client - the real backend
  // strips this at the Mongoose schema / controller level.
  const { password, ...safe } = user;
  return safe;
}

function fakeToken(user) {
  return `mock.${user.role}.${user.id}.${Date.now()}`;
}

export const authService = {
  login({ email, password }) {
    return mockRequest(() => {
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user || user.password !== password) {
        throw new Error("Invalid email or password.");
      }
      return { user: toSafeUser(user), token: fakeToken(user) };
    });
  },

  registerCustomer({ name, email, password }) {
    return mockRequest(() => {
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
      }
      const newUser = {
        id: `u-${Date.now()}`,
        name,
        email,
        password,
        role: "customer",
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      users.push(newUser);
      return { user: toSafeUser(newUser), token: fakeToken(newUser) };
    });
  },

  registerVendor({ name, email, password, storeName }) {
    return mockRequest(() => {
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
      }
      const newUser = {
        id: `u-${Date.now()}`,
        name,
        email,
        password,
        role: "vendor",
        storeId: `st-${Date.now()}`,
        pendingStoreName: storeName,
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      users.push(newUser);
      return { user: toSafeUser(newUser), token: fakeToken(newUser) };
    });
  },

  forgotPassword(email) {
    return mockRequest(() => {
      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      // Intentionally do not leak whether the account exists.
      return { sent: true, exists };
    });
  },

  resetPassword({ email, newPassword }) {
    return mockRequest(() => {
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) throw new Error("Reset link is invalid or has expired.");
      user.password = newPassword;
      return { success: true };
    });
  },

  me(userId) {
    return mockRequest(() => {
      const user = users.find((u) => u.id === userId);
      if (!user) throw new Error("Session expired.");
      return toSafeUser(user);
    }, { delay: 150 });
  },
};
