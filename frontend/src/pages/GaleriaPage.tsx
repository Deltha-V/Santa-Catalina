import { useEffect, useState } from "react";
import { getBancoImagenes, imageUrl } from "../api/client";

const fallbackImages = [
  "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
];

export function GaleriaPage() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const rows = await getBancoImagenes();
        if (rows.length === 0) {
          setImages(fallbackImages);
          return;
        }
        setImages(rows.map((row) => imageUrl(row.image_url) || "").filter(Boolean));
      } catch {
        setImages(fallbackImages);
      }
    }
    void load();
  }, []);

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
