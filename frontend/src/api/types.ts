export type EstadoLote =
  | "disponible"
  | "vendido"
  | "reservado"
  | "no_disponible"
  | "acuerdo_privado";

export interface Lote {
  numero_lote: string;
  manzana: string;
  estado: EstadoLote;
  comercializable: boolean;
  frente_m: number;
  fondo_m: number;
  area_m2: number;
  plano_imagen_url?: string | null;
}

export interface LoteCreate extends Omit<Lote, "plano_imagen_url"> {}

export interface LoteImagen {
  id: number;
  lote_numero: string;
  image_url: string;
  orden: number;
}

export type Modality = "contado" | "12_pesos" | "12_usd" | "36_usd";
export type Currency = "USD" | "ARS";

export interface SimulacionCreate {
  cliente_id?: number | null;
  lote_numero?: string | null;
  modalidad: Modality;
  moneda_base: Currency;
  precio_lista: number;
  entrega_inicial: number;
  monto_financiado: number;
  cuotas: number;
  valor_cuota: number;
}
