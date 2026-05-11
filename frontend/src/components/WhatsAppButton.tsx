export function WhatsAppButton({ phone }: { phone: string }) {
  const text = encodeURIComponent("Hola, quiero informacion sobre lotes y financiacion.");
  const link = `https://wa.me/${phone}?text=${text}`;

  return (
    <a href={link} target="_blank" rel="noreferrer" className="whatsapp-btn" aria-label="Contactar por WhatsApp">
      WhatsApp
    </a>
  );
}
