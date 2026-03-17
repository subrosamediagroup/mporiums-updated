// ============================================================
// src/utils/api.js
// ============================================================
// A central helper that all your React pages use to talk to
// the testing API.
//
// HOW IT WORKS:
//   - Reads the API URL from an environment variable
//   - Automatically attaches the auth token to every request
//   - Returns parsed JSON or throws a clean error
//
// USAGE in any component:
//   import { apiFetch } from "../utils/api";
//
//   // GET request
//   const products = await apiFetch("/products");
//
//   // POST request
//   const order = await apiFetch("/orders", {
//     method: "POST",
//     body: JSON.stringify({ items: cart }),
//   });
//
// SETUP:
//   Create a .env file in your mporiums/ root with:
//     VITE_API_URL=http://localhost:4000/api      (local)
//     VITE_API_URL=https://your-app.railway.app/api  (deployed)
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5173/api";

export async function apiFetch(path, options = {}) {
  // Attach saved auth token if it exists
  const token = localStorage.getItem("mporiums-token");

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Parse the response
  const data = await response.json().catch(() => ({}));

  // Throw a clean error if the request failed
  if (!response.ok) {
    throw new Error(data.message || `API error: ${response.status}`);
  }

  return data;
}

// ── Auth helpers ─────────────────────────────────────────────

// Login — saves token to localStorage on success
export async function login(email, password) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("mporiums-token", data.token);
  localStorage.setItem("mporiums-user", JSON.stringify(data.user));
  return data.user;
}

// Register — saves token to localStorage on success
export async function register(email, password, displayName, sellerType = "standard") {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName, sellerType }),
  });
  localStorage.setItem("mporiums-token", data.token);
  localStorage.setItem("mporiums-user", JSON.stringify(data.user));
  return data.user;
}

// Logout — clears token and user from localStorage
export function logout() {
  localStorage.removeItem("mporiums-token");
  localStorage.removeItem("mporiums-user");
}

// Get the currently logged-in user from localStorage
// (doesn't make an API call — just reads from storage)
export function getCurrentUser() {
  try {
    const user = localStorage.getItem("mporiums-user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// Check if a user is logged in
export function isLoggedIn() {
  return !!localStorage.getItem("mporiums-token");
}
