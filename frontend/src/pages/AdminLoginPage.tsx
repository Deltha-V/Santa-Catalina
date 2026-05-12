import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/client";

export function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/admin";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginAdmin(username, password);
      navigate(from, { replace: true });
    } catch {
      setError("Usuario o clave incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-auth-wrap">
      <div className="card admin-auth-card">
        <h1 style={{ fontSize: "2rem" }}>Ingreso Admin</h1>
        <p className="lead">Accede al panel privado para gestionar lotes.</p>
        <form onSubmit={onSubmit} className="admin-form">
          <label>
            Usuario
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Clave
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p>{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </section>
  );
}
