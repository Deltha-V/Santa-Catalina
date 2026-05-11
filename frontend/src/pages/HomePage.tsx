import { useEffect, useMemo, useState } from "react";
import { getLotes } from "../api/client";
import { Lote } from "../api/types";

export function HomePage() {
  const [lotes, setLotes] = useState<Lote[]>([]);

  useEffect(() => {
    void getLotes().then(setLotes).catch(() => setLotes([]));
  }, []);

  const stats = useMemo(() => {
    const disponibles = lotes.filter((l) => l.estado === "disponible").length;
    const totalM2 = lotes.reduce((acc, lote) => acc + lote.area_m2, 0);
    const promedioM2 = lotes.length ? totalM2 / lotes.length : 0;

    return {
      disponibles,
      promedioM2,
      totalM2,
    };
  }, [lotes]);

  return (
    <section className="hero-home">
      <p className="pill dark">RE/MAX PAYE · Corrientes Capital</p>
      <h1>Predios</h1>
      <h1 className="accent">Santa Catalina</h1>
      <p className="lead center">Segunda Preventa</p>
      <p className="lead center">Junto a viviendas del PROCREAR, zona de expansión urbana de Corrientes</p>
      <div className="hero-actions">
        <a href="/lotes" className="btn-primary">Ver lotes disponibles</a>
        <a href="/precios" className="btn-ghost">Ver precios</a>
      </div>
      <div className="hero-stats">
        <article>
          <p className="big-red">14</p>
          <p>Manzanas</p>
        </article>
        <article>
          <p className="big-white">{stats.promedioM2 > 0 ? `${Math.floor(stats.promedioM2)}–${Math.ceil(stats.promedioM2 + 155)}` : "312–467"}</p>
          <p>m2 por lote</p>
        </article>
        <article>
          <p className="big-white">USD</p>
          <p>Financiación disponible</p>
        </article>
      </div>
    </section>
  );
}
