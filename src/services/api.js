import axios from "axios";

// ─── Instance Axios ─────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 12000,
});

// ─── Intercepteurs ──────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ivoire_admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Une erreur est survenue. Veuillez réessayer.";
    if (error.response?.status === 401) {
      localStorage.removeItem("ivoire_admin_token");
      localStorage.removeItem("ivoire_admin_user");
    }
    return Promise.reject(new Error(msg));
  },
);

// ─── Produits ────────────────────────────────────────────────────────────────

export async function getProducts(params = {}) {
  const res = await api.get("/products", { params });
  return res.data;
}

export async function getProduct(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function createProduct(data) {
  const res = await api.post("/products", data);
  return res.data;
}

export async function updateProduct(id, data) {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res.data;
}

// ─── Boutiques ───────────────────────────────────────────────────────────────

export async function getBoutiques(params = {}) {
  const res = await api.get("/boutiques", { params });
  return res.data;
}

export async function getBoutique(id) {
  const res = await api.get(`/boutiques/${id}`);
  return res.data;
}

export async function createBoutique(data) {
  const res = await api.post("/boutiques", data);
  return res.data;
}

export async function updateBoutique(id, data) {
  const res = await api.put(`/boutiques/${id}`, data);
  return res.data;
}

export async function deleteBoutique(id) {
  const res = await api.delete(`/boutiques/${id}`);
  return res.data;
}

// ─── Commandes ───────────────────────────────────────────────────────────────

export async function createOrder(data) {
  const res = await api.post("/orders", data);
  return res.data;
}

export async function getOrders(params = {}) {
  const res = await api.get("/orders", { params });
  return res.data;
}

export async function updateOrderStatus(id, status) {
  const res = await api.put(`/orders/${id}/status`, { status });
  return res.data;
}

// ─── Authentification Admin ──────────────────────────────────────────────────

export async function loginAdmin({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function getAdminProfile() {
  const res = await api.get("/auth/me");
  return res.data;
}

// ─── Statistiques Admin ───────────────────────────────────────────────────────

export async function getAdminStats() {
  const res = await api.get("/admin/stats");
  return res.data;
}

// ─── Upload Images ──────────────────────────────────────────────────────────

export async function uploadImage(endpoint, file, onProgress) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return res.data; // { success, url }
}
// ─── Avis (Reviews) ─────────────────────────────────────────────────────────

export async function getAvis(params = {}) {
  const res = await api.get("/avis", { params });
  return res.data;
}

export async function createAvis(data) {
  const res = await api.post("/avis", data);
  return res.data;
}

export default api;
