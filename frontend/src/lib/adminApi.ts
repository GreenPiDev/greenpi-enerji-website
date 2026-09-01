import { API_BASE_URL, type Location, type Category, type Product } from './api'

export type { Location, Category, Product }

export type ProductInput = {
  marka: string
  urun: string
  katalogLink: string | null
  urunWebLink: string | null
  datasheetLink: string | null
  gorselUrl: string | null
  aciklama: string | null
  yayinda: boolean
  lokasyonlar: string[]
  kategoriler: string[]
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(typeof body.error === 'string' ? body.error : `İstek başarısız: ${res.status}`)
  }
  return res.json()
}

export function adminLogin(password: string) {
  return request<{ ok: true }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}

export function adminLogout() {
  return request<{ ok: true }>('/admin/logout', { method: 'POST' })
}

export function adminMe() {
  return request<{ ok: true }>('/admin/me')
}

export function adminGetProducts() {
  return request<Product[]>('/admin/products')
}

export function adminCreateProduct(data: ProductInput) {
  return request<Product>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function adminUpdateProduct(id: string, data: ProductInput) {
  return request<Product>(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function adminDeleteProduct(id: string) {
  return request<{ ok: true }>(`/admin/products/${id}`, { method: 'DELETE' })
}

export type LocationInput = {
  adTr: string
  adEn?: string | null
  adRu?: string | null
  adAr?: string | null
  adAz?: string | null
  sira?: number
  xPercent?: number | null
  yPercent?: number | null
}

export function adminGetLocations() {
  return request<Location[]>('/admin/locations')
}

export function adminCreateLocation(data: LocationInput) {
  return request<Location>('/admin/locations', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function adminUpdateLocation(id: string, data: LocationInput) {
  return request<Location>(`/admin/locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function adminDeleteLocation(id: string) {
  return request<{ ok: true }>(`/admin/locations/${id}`, { method: 'DELETE' })
}

export async function adminUploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${API_BASE_URL}/admin/upload?folder=product-images`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(typeof body.error === 'string' ? body.error : `Yükleme başarısız: ${res.status}`)
  }
  return res.json()
}
