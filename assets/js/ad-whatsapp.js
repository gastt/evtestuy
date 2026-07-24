(function () {
  "use strict";

  // Editá acá el destino de WhatsApp y el texto de cada publicidad.
  // Usá el número en formato internacional, sin +, espacios ni guiones.
  const AD_WHATSAPP_CONFIG = {
    top: {
      phone: "+59899001989",
      message: "Hola, quiero consultar por instalaciones eléctricas de MYLO que encontré en EVUruguay."
    },
    bottom: {
      phone: "+59895640938",
      message: "Hola, quiero consultar por instalaciones eléctricas de VOLTARK que encontré en EVUruguay."
    }
  };

  function buildWhatsAppUrl(adConfig) {
    const phone = String(adConfig.phone || "").replace(/\D/g, "");
    const message = encodeURIComponent(adConfig.message || "");
    return `https://wa.me/${phone}${message ? `?text=${message}` : ""}`;
  }

  document.querySelectorAll("[data-ad-whatsapp]").forEach((link) => {
    const adKey = link.getAttribute("data-ad-whatsapp");
    const adConfig = AD_WHATSAPP_CONFIG[adKey];

    if (!adConfig) return;

    link.href = buildWhatsAppUrl(adConfig);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = "Enviar mensaje por WhatsApp";
    link.setAttribute("aria-label", "Enviar mensaje por WhatsApp");
  });
})();
