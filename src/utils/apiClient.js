// Simple API client for Momentum React app
// - Reads JWT from localStorage (keys: 'authToken' or 'token')
// - Adds Authorization: Bearer <token> to requests
// - Uses Vite env var VITE_API_BASE_URL, defaults to production Cloud Run URL

export const API_BASE_URL = import.meta.env.VITE_DEV
  ? import.meta.env.VITE_DEV_API_URL
  : import.meta.env.VITE_PROD_API_URL;

export const getToken = () =>
  localStorage.getItem("authToken") || localStorage.getItem("token") || null;

export const setToken = (token) => {
  if (token) localStorage.setItem("authToken", token);
};

export const clearToken = () => {
  localStorage.removeItem("authToken");
  // don't remove generic 'token' to avoid interfering if another part of app manages it
};

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Generic GET helper; add others as needed
export async function apiPost(path, body, { headers = {}, signal } = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: JSON.stringify(body),
    signal,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const responseBody = isJson
    ? await res.json().catch(() => null)
    : await res.text();

  if (!res.ok) {
    // Extract error message from response body
    const errorMessage =
      responseBody?.error ||
      responseBody?.message ||
      `Request failed: ${res.status}`;
    throw new ApiError(errorMessage, {
      status: res.status,
      data: responseBody,
    });
  }
  return responseBody;
}

export async function apiDelete(path, { headers = {}, signal } = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    signal,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const responseBody = isJson
    ? await res.json().catch(() => null)
    : await res.text();

  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status}`, {
      status: res.status,
      data: responseBody,
    });
  }
  return responseBody;
}

export async function apiGet(path, { headers = {}, signal } = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    signal,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const responseBody = isJson
    ? await res.json().catch(() => null)
    : await res.text();

  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status}`, {
      status: res.status,
      data: responseBody,
    });
  }
  return responseBody;
}

export async function apiPut(path, body, { headers = {}, signal } = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: JSON.stringify(body),
    signal,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const responseBody = isJson
    ? await res.json().catch(() => null)
    : await res.text();

  if (!res.ok) {
    const errorMessage =
      responseBody?.error ||
      responseBody?.message ||
      `Request failed: ${res.status}`;
    throw new ApiError(errorMessage, {
      status: res.status,
      data: responseBody,
    });
  }
  return responseBody;
}
