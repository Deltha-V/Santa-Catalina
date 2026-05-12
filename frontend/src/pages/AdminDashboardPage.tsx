import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  clearAdminToken,
  createLote,
  deleteLote,
  deleteLoteImagen,
  getLoteImagenes,
  getLotes,
  imageUrl,
  updateLote,
  uploadLoteImagenes,
} from "../api/client";
import { EstadoLote, Lote, LoteImagen } from "../api/types";

type FormState = {
  numero_lote: string;
  manzana: string;
  estado: EstadoLote;
  comercializable: boolean;
  frente_m: number;
  fondo_m: number;
  area_m2: number;
};

const EMPTY_FORM: FormState = {
  numero_lote: "",
  manzana: "",
  estado: "disponible",
  comercializable: true,
  frente_m: 10,
  fondo_m: 30,
  area_m2: 300,
};

const ESTADOS: EstadoLote[] = ["disponible", "reservado", "vendido", "acuerdo_privado", "no_disponible"];

export function AdminDashboardPage() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [galleryLote, setGalleryLote] = useState("");
  const [galleryImages, setGalleryImages] = useState<LoteImagen[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);

  async function loadLotes() {
    setLoading(true);
    setError(null);
    try {
      const rows = await getLotes();
      setLotes(rows);
    } catch {
      setError("No se pudieron cargar los lotes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLotes();
  }, []);

  const ordered = useMemo(
    () => [...lotes].sort((a, b) => a.numero_lote.localeCompare(b.numero_lote, "es", { numeric: true })),
    [lotes]
  );

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditId(null);
  }

  function fillFrom(lote: Lote) {
    setForm({
      numero_lote: lote.numero_lote,
      manzana: lote.manzana,
      estado: lote.estado,
      comercializable: lote.comercializable,
      frente_m: lote.frente_m,
      fondo_m: lote.fondo_m,
      area_m2: lote.area_m2,
    });
    setEditId(lote.numero_lote);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editId) {
        await updateLote(editId, {
          manzana: form.manzana,
          estado: form.estado,
          comercializable: form.comercializable,
          frente_m: Number(form.frente_m),
          fondo_m: Number(form.fondo_m),
          area_m2: Number(form.area_m2),
        });
      } else {
        await createLote({
          numero_lote: form.numero_lote.trim(),
          manzana: form.manzana.trim(),
          estado: form.estado,
          comercializable: form.comercializable,
          frente_m: Number(form.frente_m),
          fondo_m: Number(form.fondo_m),
          area_m2: Number(form.area_m2),
        });
      }
      await loadLotes();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el lote.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(numeroLote: string) {
    const ok = window.confirm(`Eliminar ${numeroLote}? Esta accion no se puede deshacer.`);
    if (!ok) return;
    setError(null);
    try {
      await deleteLote(numeroLote);
      if (editId === numeroLote) resetForm();
      await loadLotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el lote.");
    }
  }

  function onLogout() {
    clearAdminToken();
    window.location.href = "/admin/login";
  }

  async function loadGallery(numeroLote: string) {
    if (!numeroLote) {
      setGalleryImages([]);
      return;
    }
    setGalleryLoading(true);
    setGalleryError(null);
    try {
      const rows = await getLoteImagenes(numeroLote);
      setGalleryImages(rows);
    } catch {
      setGalleryImages([]);
      setGalleryError("No se pudieron cargar las imagenes de este lote.");
    } finally {
      setGalleryLoading(false);
    }
  }

  async function onUploadGallery(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = document.getElementById("gallery-files") as HTMLInputElement | null;
    const files = input?.files ? Array.from(input.files) : [];
    if (!galleryLote || files.length === 0) return;
    setGalleryUploading(true);
    setGalleryError(null);
    try {
      await uploadLoteImagenes(galleryLote, files);
      await loadGallery(galleryLote);
      if (input) input.value = "";
    } catch (err) {
      setGalleryError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setGalleryUploading(false);
    }
  }

  async function onDeleteImage(imageId: number) {
    if (!galleryLote) return;
    const ok = window.confirm("Eliminar esta imagen?");
    if (!ok) return;
    setGalleryError(null);
    try {
      await deleteLoteImagen(galleryLote, imageId);
      await loadGallery(galleryLote);
    } catch (err) {
      setGalleryError(err instanceof Error ? err.message : "No se pudo eliminar la imagen.");
    }
  }

  return (
    <section>
      <p className="pill">ADMIN</p>
      <h1 className="title-center">Panel de Lotes (CRUD)</h1>

      <div className="card">
        <div className="admin-actions">
          <Link to="/lotes" className="btn-ghost admin-ghost">Ver mapa publico</Link>
          <button onClick={onLogout} className="btn-primary">Cerrar sesion</button>
        </div>
      </div>

      <div className="card admin-crud-grid">
        <div>
          <h3>{editId ? `Editar: ${editId}` : "Crear nuevo lote"}</h3>
          <form onSubmit={onSubmit} className="admin-form">
            <label>
              Numero de lote
              <input
                value={form.numero_lote}
                onChange={(e) => setForm((prev) => ({ ...prev, numero_lote: e.target.value }))}
                disabled={Boolean(editId)}
                required
              />
            </label>
            <label>
              Manzana
              <input value={form.manzana} onChange={(e) => setForm((prev) => ({ ...prev, manzana: e.target.value }))} required />
            </label>
            <label>
              Estado
              <select value={form.estado} onChange={(e) => setForm((prev) => ({ ...prev, estado: e.target.value as EstadoLote }))}>
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </label>
            <label>
              Comercializable
              <select
                value={form.comercializable ? "si" : "no"}
                onChange={(e) => setForm((prev) => ({ ...prev, comercializable: e.target.value === "si" }))}
              >
                <option value="si">Si</option>
                <option value="no">No</option>
              </select>
            </label>
            <label>
              Frente (m)
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={form.frente_m}
                onChange={(e) => setForm((prev) => ({ ...prev, frente_m: Number(e.target.value) }))}
                required
              />
            </label>
            <label>
              Fondo (m)
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={form.fondo_m}
                onChange={(e) => setForm((prev) => ({ ...prev, fondo_m: Number(e.target.value) }))}
                required
              />
            </label>
            <label>
              Area (m2)
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={form.area_m2}
                onChange={(e) => setForm((prev) => ({ ...prev, area_m2: Number(e.target.value) }))}
                required
              />
            </label>
            <div className="admin-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Guardando..." : editId ? "Guardar cambios" : "Crear lote"}
              </button>
              {editId && (
                <button type="button" onClick={resetForm} className="btn-ghost admin-ghost">
                  Cancelar edicion
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h3>Lotes cargados</h3>
          {loading && <p>Cargando...</p>}
          {error && <p>{error}</p>}
          {!loading && ordered.length === 0 && <p>No hay lotes para mostrar.</p>}
          <div className="admin-list">
            {ordered.map((lote) => (
              <article key={lote.numero_lote} className="admin-item">
                <div>
                  <strong>{lote.numero_lote}</strong>
                  <p>
                    MZ {lote.manzana} | {lote.estado} | {lote.area_m2} m2
                  </p>
                </div>
                <div className="admin-actions">
                  <button type="button" className="btn-ghost admin-ghost" onClick={() => fillFrom(lote)}>
                    Editar
                  </button>
                  <button type="button" className="btn-primary" onClick={() => void onDelete(lote.numero_lote)}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Banco de imagenes por lote</h3>
        <div className="admin-actions">
          <select
            value={galleryLote}
            onChange={(e) => {
              const lote = e.target.value;
              setGalleryLote(lote);
              void loadGallery(lote);
            }}
          >
            <option value="">Elegir lote</option>
            {ordered.map((lote) => (
              <option key={lote.numero_lote} value={lote.numero_lote}>
                {lote.numero_lote}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={onUploadGallery} className="admin-form" style={{ marginTop: "0.8rem" }}>
          <label>
            Subir imagenes (una o varias)
            <input id="gallery-files" type="file" accept=".png,.jpg,.jpeg,.webp" multiple disabled={!galleryLote || galleryUploading} />
          </label>
          <button type="submit" className="btn-primary" disabled={!galleryLote || galleryUploading}>
            {galleryUploading ? "Subiendo..." : "Subir al lote"}
          </button>
        </form>

        {galleryLoading && <p>Cargando imagenes...</p>}
        {galleryError && <p>{galleryError}</p>}
        {!galleryLoading && galleryLote && (
          <div className="admin-gallery-grid">
            {galleryImages.map((img) => (
              <article key={img.id} className="admin-gallery-item">
                <img src={imageUrl(img.image_url) || ""} alt={`Lote ${img.lote_numero}`} className="admin-gallery-image" />
                <button type="button" className="btn-primary" onClick={() => void onDeleteImage(img.id)}>
                  Eliminar
                </button>
              </article>
            ))}
            {galleryImages.length === 0 && <p>Este lote todavia no tiene imagenes.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
