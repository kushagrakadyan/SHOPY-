// ---------------------------------------------------------------------------
// Central API client.
//
// Today: every service function in src/services resolves against local
// mock data (see src/data) through the `mockRequest` helper below, so the
// whole UI works with zero backend.
//
// Later: swap `mockRequest` calls for real calls through this `http` client.
// Nothing outside src/services needs to change — pages/components/hooks/
// Redux slices only ever import from services/*Service.js, never from
// src/data directly and never from fetch/axios directly.
// ---------------------------------------------------------------------------

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("shopy_token");
}

/**
 * Thin fetch wrapper for the FUTURE real backend.
 * Not called anywhere yet — kept here so the swap-over is a one-line change
 * per service function (mockRequest(...) -> http.get("/products")).
 */
export const http = {
  async request(path, { method = "GET", body, headers = {} } = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new ApiError(errBody.message || res.statusText, res.status);
    }
    return res.json();
  },
  get(path) {
    return this.request(path);
  },
  post(path, body) {
    return this.request(path, { method: "POST", body });
  },
  put(path, body) {
    return this.request(path, { method: "PUT", body });
  },
  patch(path, body) {
    return this.request(path, { method: "PATCH", body });
  },
  delete(path) {
    return this.request(path, { method: "DELETE" });
  },
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Simulates network latency + occasional structure of a real API response,
 * so components already handle loading/error states correctly.
 * `resolver` runs synchronously against mock data and returns a plain value.
 */
export function mockRequest(resolver, { delay = 400, failRate = 0 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failRate > 0 && Math.random() < failRate) {
        reject(new ApiError("Something went wrong. Please try again.", 500));
        return;
      }
      try {
        resolve(resolver());
      } catch (err) {
        reject(err);
      }
    }, delay);
  });
}
