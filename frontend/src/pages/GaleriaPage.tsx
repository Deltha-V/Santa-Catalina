const images = [
  "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80",
];

export function GaleriaPage() {
  return (
    <section className="gallery-page">
      <p className="pill dark">GALERÍA</p>
      <h1 className="title-center white">Fotos del desarrollo</h1>
      <div className="gallery-panel">
        <div className="gallery-grid">
          {images.map((src, i) => (
            <img key={src} src={src} alt={`Proyecto imagen ${i + 1}`} className="gallery-image" />
          ))}
        </div>
      </div>
      <div className="contact-cta">
        <p className="pill">CONTACTO</p>
        <h2>¿Te interesa un lote?</h2>
        <p className="lead center">Completá el formulario y un asesor te va a contactar.</p>
      </div>
    </section>
  );
}
