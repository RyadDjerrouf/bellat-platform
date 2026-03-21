/**
 * Central API client for Bellat frontend.
 * Normalizes backend camelCase responses → frontend snake_case types
 * so existing components work without modification.
 *
 * Server components:  use fetchProducts / fetchProductById / fetchCategories directly.
 * Client components:  same functions — NEXT_PUBLIC_API_URL is exposed to the browser.
 */

import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';

const TOKEN_KEY = 'bellat_token';
const REFRESH_KEY = 'bellat_refresh_token';

/** Attempt a silent token refresh. Returns the new access token, or null on failure. */
async function tryRefresh(): Promise<string | null> {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null;
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const { accessToken } = await res.json();
    localStorage.setItem(TOKEN_KEY, accessToken);
    return accessToken;
  } catch {
    return null;
  }
}

/** Fetch wrapper that auto-refreshes the access token on 401 and retries once. */
async function authFetch(url: string, init: RequestInit, token: string): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}` },
  });
  if (res.status !== 401) return res;

  const newToken = await tryRefresh();
  if (!newToken) return res; // refresh failed — return original 401

  return fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${newToken}` },
  });
}

// ── Normalizers ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProduct(p: any): Product {
  return {
    id: p.id,
    name_fr: p.nameFr,
    name_ar: p.nameAr,
    category: p.categoryId ?? '',
    image: p.imageUrl ?? '/images/placeholder.jpg',
    price: Number(p.price),
    unit: p.unit ?? '',
    stock_status: p.stockStatus,
    description_fr: p.descriptionFr ?? '',
    description_ar: p.descriptionAr ?? '',
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCategory(c: any): Category {
  return {
    id: c.id,
    name_fr: c.nameFr,
    name_ar: c.nameAr,
    icon: c.icon ?? '',
    image: c.imageUrl ?? '',
    description_fr: '',
    description_ar: '',
  };
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function fetchProducts(params?: Record<string, string>): Promise<Product[]> {
  const url = new URL(`${API_BASE}/api/products`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).map(normalizeProduct);
  } catch {
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`${API_BASE}/api/products/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return undefined;
    return normalizeProduct(await res.json());
  } catch {
    return undefined;
  }
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/api/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (Array.isArray(json) ? json : []).map(normalizeCategory);
  } catch {
    return [];
  }
}

// ── Orders ────────────────────────────────────────────────────────────────────

export interface PlaceOrderPayload {
  items: { productId: string; quantity: number }[];
  deliveryAddress: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    wilaya: string;
    commune: string;
  };
  deliverySlotDate: string;
  deliverySlotTime: string;
  paymentMethod?: string;
}

export interface PlacedOrder {
  id: string;
  total: number | string;
  status: string;
}

export async function placeOrder(payload: PlaceOrderPayload, token: string): Promise<PlacedOrder> {
  const res = await authFetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, token);

  const json = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(json.message) ? json.message.join(', ') : (json.message ?? 'Erreur serveur');
    throw new Error(msg);
  }
  return json as PlacedOrder;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: string | number;
  product?: { nameFr: string; nameAr: string; imageUrl?: string; unit?: string };
}

export interface Order {
  id: string;
  status: string;
  subtotal: string | number;
  deliveryFee: string | number;
  total: string | number;
  deliveryAddress: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    wilaya: string;
    commune: string;
  };
  deliverySlotDate: string;
  deliverySlotTime: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export async function fetchOrders(token: string, params?: { status?: string; page?: number }): Promise<{ data: Order[]; meta: { total: number; page: number; totalPages: number } }> {
  const url = new URL(`${API_BASE}/api/orders`);
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.page) url.searchParams.set('page', String(params.page));

  const res = await authFetch(url.toString(), { cache: 'no-store' }, token);
  if (!res.ok) return { data: [], meta: { total: 0, page: 1, totalPages: 0 } };
  return res.json();
}

export async function fetchOrder(token: string, orderId: string): Promise<Order | null> {
  const res = await authFetch(`${API_BASE}/api/orders/${orderId}`, { cache: 'no-store' }, token);
  if (!res.ok) return null;
  return res.json();
}

export async function cancelOrder(token: string, orderId: string): Promise<Order | null> {
  const res = await authFetch(`${API_BASE}/api/orders/${orderId}/cancel`, { method: 'PATCH' }, token);
  if (!res.ok) return null;
  return res.json();
}

export async function reorderOrder(token: string, orderId: string): Promise<PlacedOrder> {
  const res = await authFetch(`${API_BASE}/api/orders/${orderId}/reorder`, { method: 'POST' }, token);
  const json = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(json.message) ? json.message.join(', ') : (json.message ?? 'Erreur serveur');
    throw new Error(msg);
  }
  return json as PlacedOrder;
}

export async function loginUser(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Identifiants incorrects');
  return json;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export interface AdminOrder {
  id: string;
  status: string;
  total: string | number;
  subtotal: string | number;
  deliveryFee: string | number;
  createdAt: string;
  paymentMethod: string;
  deliveryAddress: { fullName: string; wilaya: string; commune: string; phoneNumber: string; addressLine1: string };
  deliverySlotDate: string;
  deliverySlotTime: string;
  customer: { fullName: string; email: string; phoneNumber?: string };
  items: OrderItem[];
}

export interface InventoryProduct {
  id: string;
  nameFr: string;
  nameAr: string;
  categoryId: string | null;
  price: string | number;
  unit: string | null;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  updatedAt: string;
}

export interface InventoryResponse {
  data: InventoryProduct[];
  meta: { total: number; page: number; totalPages: number };
  summary: { inStock: number; lowStock: number; outOfStock: number };
}

/** Login and verify the user has admin role — throws if not admin. */
export async function adminLogin(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? 'Identifiants incorrects');
  // Decode payload (no signature verify needed — server will validate on each request)
  const payload = JSON.parse(atob(json.accessToken.split('.')[1]));
  if (payload.role !== 'admin') throw new Error('Accès refusé — compte non-administrateur');
  return json;
}

export async function fetchAdminOrders(
  token: string,
  params?: { status?: string; page?: number },
): Promise<{ data: AdminOrder[]; meta: { total: number; page: number; totalPages: number } }> {
  const url = new URL(`${API_BASE}/api/admin/orders`);
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.page) url.searchParams.set('page', String(params.page));
  const res = await authFetch(url.toString(), { cache: 'no-store' }, token);
  if (!res.ok) return { data: [], meta: { total: 0, page: 1, totalPages: 0 } };
  return res.json();
}

export async function fetchAdminOrder(token: string, orderId: string): Promise<AdminOrder | null> {
  const res = await authFetch(`${API_BASE}/api/admin/orders/${orderId}`, { cache: 'no-store' }, token);
  if (!res.ok) return null;
  return res.json();
}

export async function adminUpdateOrderStatus(token: string, orderId: string, status: string): Promise<AdminOrder | null> {
  const res = await authFetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }, token);
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message ?? 'Erreur mise à jour statut');
  }
  return res.json();
}

export async function fetchAdminInventory(
  token: string,
  params?: { stockStatus?: string; page?: number; limit?: number },
): Promise<InventoryResponse> {
  const url = new URL(`${API_BASE}/api/admin/inventory`);
  if (params?.stockStatus) url.searchParams.set('stockStatus', params.stockStatus);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));
  const res = await authFetch(url.toString(), { cache: 'no-store' }, token);
  if (!res.ok) return { data: [], meta: { total: 0, page: 1, totalPages: 0 }, summary: { inStock: 0, lowStock: 0, outOfStock: 0 } };
  return res.json();
}

export interface AdminProductPayload {
  id?: string;
  nameFr: string;
  nameAr: string;
  descriptionFr?: string;
  descriptionAr?: string;
  categoryId?: string;
  imageUrl?: string;
  price: number;
  unit?: string;
  stockStatus?: string;
}

export async function adminCreateProduct(token: string, data: AdminProductPayload & { id: string }): Promise<InventoryProduct> {
  const res = await authFetch(`${API_BASE}/api/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }, token);
  const json = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(json.message) ? json.message.join(', ') : (json.message ?? 'Erreur création produit');
    throw new Error(msg);
  }
  return json;
}

export async function adminUpdateProduct(token: string, productId: string, data: Partial<AdminProductPayload>): Promise<InventoryProduct> {
  const res = await authFetch(`${API_BASE}/api/admin/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }, token);
  const json = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(json.message) ? json.message.join(', ') : (json.message ?? 'Erreur mise à jour produit');
    throw new Error(msg);
  }
  return json;
}

export async function adminDeleteProduct(token: string, productId: string): Promise<void> {
  await authFetch(`${API_BASE}/api/admin/products/${productId}`, { method: 'DELETE' }, token);
}

export async function adminUpdateStock(
  token: string,
  productId: string,
  stockStatus: string,
): Promise<InventoryProduct | null> {
  const res = await authFetch(`${API_BASE}/api/admin/inventory/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stockStatus }),
  }, token);
  if (!res.ok) return null;
  return res.json();
}

// ── User Profile & Addresses ──────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  wilaya: string;
  commune: string;
  isDefault: boolean;
}

export async function fetchProfile(token: string): Promise<UserProfile | null> {
  const res = await authFetch(`${API_BASE}/api/users/me`, { cache: 'no-store' }, token);
  if (!res.ok) return null;
  return res.json();
}

export async function updateProfile(
  token: string,
  data: { fullName?: string; phoneNumber?: string; currentPassword?: string; newPassword?: string },
): Promise<UserProfile> {
  const res = await authFetch(`${API_BASE}/api/users/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }, token);
  const json = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(json.message) ? json.message.join(', ') : (json.message ?? 'Erreur');
    throw new Error(msg);
  }
  return json;
}

export async function fetchAddresses(token: string): Promise<Address[]> {
  const res = await authFetch(`${API_BASE}/api/users/me/addresses`, { cache: 'no-store' }, token);
  if (!res.ok) return [];
  return res.json();
}

export async function createAddress(token: string, data: Omit<Address, 'id'>): Promise<Address> {
  const res = await authFetch(`${API_BASE}/api/users/me/addresses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }, token);
  const json = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(json.message) ? json.message.join(', ') : (json.message ?? 'Erreur');
    throw new Error(msg);
  }
  return json;
}

export async function deleteAddress(token: string, addressId: string): Promise<void> {
  await authFetch(`${API_BASE}/api/users/me/addresses/${addressId}`, { method: 'DELETE' }, token);
}

export async function setDefaultAddress(token: string, addressId: string): Promise<Address> {
  const res = await authFetch(`${API_BASE}/api/users/me/addresses/${addressId}/default`, { method: 'PATCH' }, token);
  return res.json();
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

export async function fetchAdminUsers(
  token: string,
  params?: { page?: number; q?: string },
): Promise<{ data: AdminUser[]; meta: { total: number; page: number; totalPages: number } }> {
  const url = new URL(`${API_BASE}/api/admin/users`);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.q) url.searchParams.set('q', params.q);
  const res = await authFetch(url.toString(), { cache: 'no-store' }, token);
  if (!res.ok) return { data: [], meta: { total: 0, page: 1, totalPages: 0 } };
  return res.json();
}

export interface AnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  dailyRevenue: { date: string; revenue: number }[];
  topProducts: { productId: string; nameFr: string; revenue: number; orderCount: number }[];
}

export async function fetchAdminAnalytics(token: string): Promise<AnalyticsSummary | null> {
  const res = await authFetch(`${API_BASE}/api/admin/analytics`, { cache: 'no-store' }, token);
  if (!res.ok) return null;
  return res.json();
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
  phoneNumber?: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, phoneNumber }),
  });
  const json = await res.json();
  if (!res.ok) {
    const msg = Array.isArray(json.message) ? json.message.join(', ') : (json.message ?? 'Erreur inscription');
    throw new Error(msg);
  }
  return json;
}
