import { Lote, LoteCreate, SimulacionCreate } from "./types";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || "http://127.0.0.1:8000";

export async function getLotes(): Promise<Lote[]> {
  const res = await fetch(`${API_URL}/lotes`);
  if (!res.ok) throw new Error("No se pudieron cargar los lotes");
  return res.json();
}

export async function createLote(payload: LoteCreate): Promise<Lote> {
  const res = await fetch(`${API_URL}/lotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadPlano(numeroLote: string, file: File): Promise<Lote> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/lotes/${numeroLote}/plano`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function imageUrl(path?: string | null): string | null {
  if (!path) return null;
  return `${API_URL}${path}`;
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
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
