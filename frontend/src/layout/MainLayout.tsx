import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { WhatsAppButton } from "../components/WhatsAppButton";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/el-proyecto", label: "El Proyecto" },
  { to: "/galeria", label: "Galeria" },
  { to: "/contacto", label: "Contacto" },
  { to: "/lotes", label: "Lotes" },
  { to: "/financiacion", label: "Financiacion" },
  { to: "/precios", label: "Precios" },
];

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header className="header">
        <div className="header-inner">
          <div className="brand-wrap">
            <div className="brand-mark" />
            <div>
              <p className="brand">REMAX PAYE</p>
              <p className="brand-sub">Santa Catalina</p>
            </div>
          </div>
          <nav className="nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {item.label}
              </NavLink>
            ))}
            <a href="/contacto" className="consult-btn">Consultar</a>
          </nav>
        </div>
      </header>

      <main className="page">{children}</main>
      <WhatsAppButton phone="5491112345678" />
    </div>
  );
}
