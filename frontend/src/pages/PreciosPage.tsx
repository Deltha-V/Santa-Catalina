export function PreciosPage() {
  return (
    <section className="hero-home">
      <p className="pill dark">PRECIOS</p>
      <h1>Precios</h1>
      <h1 className="accent">Santa Catalina</h1>
      <p className="lead center">Segunda Preventa · valores orientativos</p>
      <div className="finance-grid" style={{ marginTop: "1rem" }}>
        <article className="card">
          <h3>Lotes desde</h3>
          <h2>USD 19.900</h2>
          <p className="lead">Pago contado con descuento.</p>
        </article>
        <article className="card">
          <h3>Planes</h3>
          <h2>12 y 36 cuotas</h2>
          <p className="lead">Con entrega inicial y financiación en ARS/USD.</p>
        </article>
      </div>
    </section>
  );
}
