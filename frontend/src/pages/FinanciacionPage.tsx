export function FinanciacionPage() {
  return (
    <section>
      <p className="pill">FINANCIACIÓN</p>
      <h1 className="title-center">Opciones de pago</h1>
      <div className="finance-grid">
        <article className="card">
          <p className="mini-pill blue">OPCIÓN 1</p>
          <h2>12 cuotas</h2>
          <p className="lead">30% de entrega + 12 cuotas mensuales</p>
          <table className="table">
            <thead><tr><th>Lote</th><th>Moneda</th><th>Entrega</th><th>Cuota</th></tr></thead>
            <tbody>
              <tr><td>12 × 26 m</td><td>Pesos</td><td>$ 6.885.000</td><td>$ 1.338.750</td></tr>
              <tr><td>12 × 28 m</td><td>Pesos</td><td>$ 7.402.500</td><td>$ 1.439.370</td></tr>
              <tr><td>12 × 30 m</td><td>USD</td><td>USD 5.295</td><td>USD 1.030</td></tr>
            </tbody>
          </table>
        </article>
        <article className="card">
          <p className="mini-pill blue">OPCIÓN 2</p>
          <h2>36 cuotas</h2>
          <p className="lead">Entrega + 36 cuotas mensuales en USD</p>
          <table className="table">
            <thead><tr><th>Lote</th><th>Entrega</th><th>Cuota</th><th>Disponibilidad</th></tr></thead>
            <tbody>
              <tr><td>12 × 26 m</td><td>USD 1.500</td><td>USD 640</td><td><span className="tag red">Sin unidades</span></td></tr>
              <tr><td>12 × 28 m</td><td>USD 2.000</td><td>USD 670</td><td><span className="tag green">4 lotes disponibles</span></td></tr>
              <tr><td>12 × 30 m</td><td>USD 2.000</td><td>USD 730</td><td><span className="tag yellow">Consultar</span></td></tr>
            </tbody>
          </table>
          <div className="warn">Confirmar disponibilidad de financiación a 36 cuotas antes de ofrecer al cliente.</div>
        </article>
      </div>
    </section>
  );
}
