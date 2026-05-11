import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { createSimulacion, getLotes, importLotesExcel } from "../api/client";
import { Lote, Modality } from "../api/types";

type PlanResult = {
  modalidad: Modality;
  moneda: "USD" | "ARS";
  total: number;
  entrega: number;
  financiado: number;
  cuotas: number;
  valorCuota: number;
};

const MODALITY_LABELS: Record<Modality, string> = {
  contado: "Contado (5% desc.)",
  "12_pesos": "12 cuotas - Pesos",
  "12_usd": "12 cuotas - USD",
  "36_usd": "36 cuotas - USD",
};

function fmt(n: number, currency: "USD" | "ARS" = "USD") {
  return currency === "USD"
    ? `USD ${n.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`
    : `$ ${n.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`;
}

function buildPlan(modality: Modality, priceUsd: number, usdToArs: number): PlanResult {
  if (modality === "contado") {
    const total = priceUsd * 0.95;
    return { modalidad: modality, moneda: "USD", total, entrega: total, financiado: 0, cuotas: 1, valorCuota: total };
  }
  if (modality === "12_pesos") {
    const totalArs = priceUsd * usdToArs;
    const entrega = totalArs * 0.3;
    const financiado = totalArs - entrega;
    return { modalidad: modality, moneda: "ARS", total: totalArs, entrega, financiado, cuotas: 12, valorCuota: financiado / 12 };
  }
  if (modality === "12_usd") {
    const entrega = priceUsd * 0.3;
    const financiado = priceUsd - entrega;
    return { modalidad: modality, moneda: "USD", total: priceUsd, entrega, financiado, cuotas: 12, valorCuota: financiado / 12 };
  }
  const entrega = priceUsd * 0.3;
  const financiado = priceUsd - entrega;
  return { modalidad: modality, moneda: "USD", total: priceUsd, entrega, financiado, cuotas: 36, valorCuota: financiado / 36 };
}

export function LotesPage() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [selected, setSelected] = useState<Lote | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [priceUsd, setPriceUsd] = useState<number>(50000);
  const [usdToArs, setUsdToArs] = useState<number>(1200);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  async function loadLotes() {
    try {
      const rows = await getLotes();
      setLotes(rows);
      setLoadError(null);
    } catch {
      setLotes([]);
      setLoadError("No se pudo conectar con el backend. Revisa que el API este corriendo en http://127.0.0.1:8000.");
    }
  }

  useEffect(() => {
    void loadLotes();
  }, []);

  const manzanas = useMemo(() => {
    const grouped: Record<string, Lote[]> = {};
    lotes.forEach((lote) => {
      const key = lote.manzana || "Sin manzana";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(lote);
    });
    return Object.entries(grouped)
      .sort((a, b) => a[0].localeCompare(b[0], "es"))
      .map(([name, items]) => ({
        name,
        items: items.sort((a, b) => a.numero_lote.localeCompare(b.numero_lote, "es", { numeric: true })),
      }));
  }, [lotes]);

  const plans = useMemo(
    () => ["contado", "12_pesos", "12_usd", "36_usd"].map((m) => buildPlan(m as Modality, priceUsd, usdToArs)),
    [priceUsd, usdToArs]
  );
  const counters = useMemo(() => {
    const c = { total: lotes.length, disponible: 0, reservado: 0, vendido: 0, acuerdo_privado: 0, no_disponible: 0 };
    lotes.forEach((l) => {
      c[l.estado] += 1;
    });
    return c;
  }, [lotes]);

  async function onTrack(plan: PlanResult) {
    if (!selected) return;
    setSavingId(plan.modalidad);
    try {
      await createSimulacion({
        lote_numero: selected.numero_lote,
        modalidad: plan.modalidad,
        moneda_base: plan.moneda,
        precio_lista: plan.total,
        entrega_inicial: plan.entrega,
        monto_financiado: plan.financiado,
        cuotas: plan.cuotas,
        valor_cuota: plan.valorCuota,
      });
    } finally {
      setSavingId(null);
    }
  }

  async function onImportExcel(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportMessage(null);
    try {
      const result = await importLotesExcel(file);
      setImportMessage(
        `Importacion completada. Nuevos: ${result.inserted}, actualizados: ${result.updated}, omitidos: ${result.skipped}.`
      );
      await loadLotes();
    } catch (err) {
      setImportMessage(err instanceof Error ? err.message : "Error al importar el archivo.");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }

  return (
    <section>
      <p className="pill">DISPONIBILIDAD</p>
      <h1 className="title-center">Mapa interactivo del loteo</h1>
      <p className="lead center">Pasá el cursor sobre cada lote para ver su estado. Hacé click para consultar.</p>
      <div className="chips-row">
        <span className="chip dark">Todos <b>{counters.total}</b></span>
        <span className="chip">Disponible <b>{counters.disponible}</b></span>
        <span className="chip">Reservado <b>{counters.reservado}</b></span>
        <span className="chip">Vendido <b>{counters.vendido}</b></span>
        <span className="chip">Acuerdo privado <b>{counters.acuerdo_privado}</b></span>
        <span className="chip">No comercializable <b>{counters.no_disponible}</b></span>
      </div>
      <div className="card">
        <h3>Importar Lotes desde Excel</h3>
        <p>Sube el archivo .xlsx de disponibilidad para cargar o actualizar lotes masivamente.</p>
        <input type="file" accept=".xlsx" onChange={onImportExcel} disabled={importing} />
        {importing && <p>Importando archivo...</p>}
        {importMessage && <p>{importMessage}</p>}
      </div>
      {loadError && (
        <div className="card">
          <p>{loadError}</p>
        </div>
      )}
      {manzanas.length === 0 && (
        <div className="card">
          <p>No hay lotes cargados todavia. Carga lotes desde backend para visualizar el mapa por manzanas.</p>
        </div>
      )}
      <div className="block-map card">
        {manzanas.map((manzana) => (
          <article key={manzana.name} className="manzana-card">
            <h3>Manzana {manzana.name}</h3>
            <div className="manzana-grid">
              {manzana.items.map((lote) => (
                <button
                  key={lote.numero_lote}
                  className={`manzana-lote status-${lote.estado}`}
                  onClick={() => setSelected(lote)}
                >
                  {lote.numero_lote}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>Cerrar</button>
            <h2>Lote {selected.numero_lote}</h2>
            <p><strong>Manzana:</strong> {selected.manzana}</p>
            <p><strong>Estado:</strong> {selected.estado}</p>
            <p><strong>Comercializable:</strong> {selected.comercializable ? "Si" : "No"}</p>
            <p><strong>Frente/Fondo:</strong> {selected.frente_m}m x {selected.fondo_m}m</p>
            <p><strong>Area:</strong> {selected.area_m2} m2</p>

            <h3>Financiamiento</h3>
            <div className="form-row">
              <label>
                Precio lista (USD)
                <input type="number" min="1" value={priceUsd} onChange={(e) => setPriceUsd(Number(e.target.value || 0))} />
              </label>
              <label>
                Tipo de cambio (ARS)
                <input type="number" min="1" value={usdToArs} onChange={(e) => setUsdToArs(Number(e.target.value || 0))} />
              </label>
            </div>

            <div className="plans-grid">
              {plans.map((plan) => (
                <article key={plan.modalidad} className="plan-card">
                  <p><strong>{MODALITY_LABELS[plan.modalidad]}</strong></p>
                  <p>Total: {fmt(plan.total, plan.moneda)}</p>
                  <p>Entrega: {fmt(plan.entrega, plan.moneda)}</p>
                  <p>Financiado: {fmt(plan.financiado, plan.moneda)}</p>
                  <p>{plan.cuotas} cuota/s de {fmt(plan.valorCuota, plan.moneda)}</p>
                  <button onClick={() => void onTrack(plan)} disabled={savingId === plan.modalidad}>
                    {savingId === plan.modalidad ? "Guardando..." : "Registrar interes"}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
