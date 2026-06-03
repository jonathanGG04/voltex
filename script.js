document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  const quoteForm = document.getElementById("quote-form");

  /* Menú móvil */
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");

      const menuAbierto = nav.classList.contains("active");

      menuToggle.textContent = menuAbierto ? "×" : "☰";
      menuToggle.setAttribute(
        "aria-label",
        menuAbierto ? "Cerrar menú" : "Abrir menú"
      );
    });

    const navLinks = document.querySelectorAll(".nav a");

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  /* Formulario de cotización por WhatsApp */
  if (quoteForm) {
    quoteForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const servicio = document.getElementById("servicio").value.trim();
      const ubicacion = document.getElementById("ubicacion").value.trim();
      const descripcion = document.getElementById("descripcion").value.trim();

      const numeroWhatsApp = "50763389243";

      const mensaje = `Hola, Voltex Innovations PA. Me gustaría solicitar una cotización.

Nombre: ${nombre}
Servicio solicitado: ${servicio}
Ubicación: ${ubicacion}
Descripción del trabajo: ${descripcion}

Quedo atento a su respuesta.`;

      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
        mensaje
      )}`;

      window.open(url, "_blank", "noopener,noreferrer");

      quoteForm.reset();
    });
  }

  console.log("Sitio web de Voltex Innovations PA cargado correctamente.");
});
document.addEventListener("DOMContentLoaded", () => {
  const solarForm = document.getElementById("solar-calculator-form");

  if (!solarForm) return;

  const coberturaInput = document.getElementById("cobertura-solar");
  const coberturaValor = document.getElementById("cobertura-valor");

  coberturaInput.addEventListener("input", () => {
    coberturaValor.textContent = `${coberturaInput.value}%`;
  });

  solarForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const consumoMensual = parseFloat(document.getElementById("consumo-kwh").value);
    const facturaMensual = parseFloat(document.getElementById("factura-mensual").value);
    const cobertura = parseFloat(document.getElementById("cobertura-solar").value) / 100;
    const potenciaPanel = parseFloat(document.getElementById("potencia-panel").value);
    const horasSol = parseFloat(document.getElementById("horas-sol").value);
    const eficiencia = parseFloat(document.getElementById("eficiencia-sistema").value) / 100;

    if (
      consumoMensual <= 0 ||
      facturaMensual <= 0 ||
      potenciaPanel <= 0 ||
      horasSol <= 0 ||
      eficiencia <= 0
    ) {
      alert("Por favor, completa todos los datos correctamente.");
      return;
    }

    const consumoACubrir = consumoMensual * cobertura;
    const consumoDiarioACubrir = consumoACubrir / 30;

    const kwpNecesarios = consumoDiarioACubrir / (horasSol * eficiencia);
    const cantidadPaneles = Math.ceil((kwpNecesarios * 1000) / potenciaPanel);
    const sistemaRealKwp = (cantidadPaneles * potenciaPanel) / 1000;

    const generacionMensual = sistemaRealKwp * horasSol * eficiencia * 30;

    const tarifaPromedio = facturaMensual / consumoMensual;
    const energiaAprovechada = Math.min(generacionMensual, consumoMensual);
    const ahorroMensual = energiaAprovechada * tarifaPromedio;
    const ahorroAnual = ahorroMensual * 12;

    const areaPorPanel = 2.6;
    const areaRequerida = cantidadPaneles * areaPorPanel;

    document.getElementById("resultado-kwp").textContent = `${sistemaRealKwp.toFixed(2)} kWp`;
    document.getElementById("resultado-paneles").textContent = `${cantidadPaneles} paneles de ${potenciaPanel} W`;
    document.getElementById("resultado-generacion").textContent = `${generacionMensual.toFixed(0)} kWh/mes`;
    document.getElementById("resultado-ahorro-mensual").textContent = `B/. ${ahorroMensual.toFixed(2)}`;
    document.getElementById("resultado-ahorro-anual").textContent = `B/. ${ahorroAnual.toFixed(2)}`;
    document.getElementById("resultado-area").textContent = `${areaRequerida.toFixed(1)} m²`;

    const numeroWhatsApp = "50763389243";

    const mensaje = `Hola, Voltex Innovations PA. Realicé una estimación solar en la página web y deseo una cotización.

Consumo mensual: ${consumoMensual} kWh
Factura mensual: B/. ${facturaMensual.toFixed(2)}
Porcentaje a cubrir: ${(cobertura * 100).toFixed(0)}%
Potencia del panel: ${potenciaPanel} W
Horas solares pico usadas: ${horasSol}
Eficiencia considerada: ${(eficiencia * 100).toFixed(0)}%

Resultado estimado:
Sistema recomendado: ${sistemaRealKwp.toFixed(2)} kWp
Cantidad de paneles: ${cantidadPaneles}
Generación mensual estimada: ${generacionMensual.toFixed(0)} kWh/mes
Ahorro mensual estimado: B/. ${ahorroMensual.toFixed(2)}
Área aproximada requerida: ${areaRequerida.toFixed(1)} m²

Quedo atento para coordinar una evaluación técnica.`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    const solarWhatsapp = document.getElementById("solar-whatsapp");
    solarWhatsapp.href = url;
  });
});