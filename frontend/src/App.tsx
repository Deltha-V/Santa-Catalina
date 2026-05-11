import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { ContactoPage } from "./pages/ContactoPage";
import { FinanciacionPage } from "./pages/FinanciacionPage";
import { GaleriaPage } from "./pages/GaleriaPage";
import { HomePage } from "./pages/HomePage";
import { LotesPage } from "./pages/LotesPage";
import { PreciosPage } from "./pages/PreciosPage";
import { ProyectoPage } from "./pages/ProyectoPage";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/el-proyecto" element={<ProyectoPage />} />
        <Route path="/galeria" element={<GaleriaPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/lotes" element={<LotesPage />} />
        <Route path="/financiacion" element={<FinanciacionPage />} />
        <Route path="/precios" element={<PreciosPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}
