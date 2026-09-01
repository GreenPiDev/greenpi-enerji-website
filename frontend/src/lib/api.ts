export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4100";

export type Location = {
  id: string;
  adTr: string;
  adEn: string | null;
  adRu: string | null;
  adAr: string | null;
  adAz: string | null;
  sira: number;
  xPercent: number | null;
  yPercent: number | null;
};
export type Category = { id: string; ad: string; sira: number };
export type Product = {
  id: string;
  marka: string;
  urun: string;
  katalogLink: string | null;
  urunWebLink: string | null;
  datasheetLink: string | null;
  gorselUrl: string | null;
  aciklama: string | null;
  yayinda: boolean;
  lokasyonlar: string[];
  kategoriler: string[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `İstek başarısız: ${res.status}`);
  }
  return res.json();
}

export function getLocations() {
  return request<Location[]>("/api/locations");
}

export function getCategories() {
  return request<Category[]>("/api/categories");
}

export function getProducts(filters?: { lokasyon?: string; kategori?: string }) {
  const params = new URLSearchParams();
  if (filters?.lokasyon) params.set("lokasyon", filters.lokasyon);
  if (filters?.kategori) params.set("kategori", filters.kategori);
  const qs = params.toString();
  return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
}
