import { Lote, LoteCreate, LoteImagen, SimulacionCreate } from "./types";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || "http://127.0.0.1:8000";
const ADMIN_TOKEN_KEY = "sc_admin_token";

function adminAuthHeaders() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function saveAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isAdminLoggedIn() {
  return Boolean(localStorage.getItem(ADMIN_TOKEN_KEY));
}

export async function loginAdmin(username: string, password: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Credenciales invalidas");
  const data = (await res.json()) as { access_token: string };
  saveAdminToken(data.access_token);
}

export async function getLotes(): Promise<Lote[]> {
  const res = await fetch(`${API_URL}/lotes`);
  if (!res.ok) throw new Error("No se pudieron cargar los lotes");
  return res.json();
}

export async function createLote(payload: LoteCreate): Promise<Lote> {
  const res = await fetch(`${API_URL}/lotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...adminAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateLote(numeroLote: string, payload: Omit<LoteCreate, "numero_lote">): Promise<Lote> {
  const res = await fetch(`${API_URL}/lotes/${numeroLote}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...adminAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteLote(numeroLote: string): Promise<void> {
  const res = await fetch(`${API_URL}/lotes/${numeroLote}`, {
    method: "DELETE",
    headers: { ...adminAuthHeaders() },
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function uploadPlano(numeroLote: string, file: File): Promise<Lote> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/lotes/${numeroLote}/plano`, {
    method: "POST",
    headers: { ...adminAuthHeaders() },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function imageUrl(path?: string | null): string | null {
  if (!path) return null;
  return `${API_URL}${path}`;
}

export async function getLoteImagenes(numeroLote: string): Promise<LoteImagen[]> {
  const res = await fetch(`${API_URL}/lotes/${numeroLote}/imagenes`);
  if (!res.ok) throw new Error("No se pudieron cargar las imagenes del lote");
  return res.json();
}

export async function getBancoImagenes(loteNumero?: string): Promise<LoteImagen[]> {
  const params = loteNumero ? `?lote_numero=${encodeURIComponent(loteNumero)}` : "";
  const res = await fetch(`${API_URL}/lotes/imagenes/banco${params}`);
  if (!res.ok) throw new Error("No se pudo cargar el banco de imagenes");
  return res.json();
}

export async function uploadLoteImagenes(numeroLote: string, files: File[]): Promise<LoteImagen[]> {
  const form = new FormData();
  for (const file of files) form.append("files", file);
  const res = await fetch(`${API_URL}/lotes/${numeroLote}/imagenes`, {
    method: "POST",
    headers: { ...adminAuthHeaders() },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteLoteImagen(numeroLote: string, imageId: number): Promise<void> {
  const res = await fetch(`${API_URL}/lotes/${numeroLote}/imagenes/${imageId}`, {
    method: "DELETE",
    headers: { ...adminAuthHeaders() },
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function createSimulacion(payload: SimulacionCreate) {
  const res = await fetch(`${API_URL}/simulaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function importLotesExcel(file: File): Promise<{
  inserted: number;
  updated: number;
  skipped: number;
  errors_preview: string[];
}> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/lotes/import-excel`, {
    method: "POST",
    headers: { ...adminAuthHeaders() },
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
