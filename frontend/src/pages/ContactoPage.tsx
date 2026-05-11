export function ContactoPage() {
  return (
    <section>
      <p className="pill">CONTACTO</p>
      <h1 className="title-center">¿Te interesa un lote?</h1>
      <p className="lead center">Completá el formulario y un asesor te va a contactar.</p>
      <div className="contact-grid">
        <form className="card contact-form">
          <label>Nombre completo *<input placeholder="Juan Pérez" /></label>
          <label>Teléfono / WhatsApp *<input placeholder="+54 9 379 4 000000" /></label>
          <label>Tipo de lote de interés
            <select><option>Seleccionar...</option></select>
          </label>
          <label>Mensaje (opcional)<textarea rows={5} placeholder="¿Tenés alguna pregunta específica sobre el proyecto?" /></label>
          <button type="button" className="btn-primary full">Enviar consulta</button>
        </form>
        <div>
          <article className="card contact-info">
            <h3>RE/MAX PAYE</h3>
            <p>Corrientes Capital<br />Argentina</p>
            <p>Desarrollador: PAYE<br />Ordenanza N.° 7403</p>
            <p>Etapa: Segunda Preventa<br />Precios actualizados mayo 2026</p>
          </article>
          <a className="wa-large" href="https://wa.me/5491112345678" target="_blank" rel="noreferrer">Escribir por WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
