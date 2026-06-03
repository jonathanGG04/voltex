document.addEventListener("DOMContentLoaded", () => {
  /* ==============================
     CONFIGURACIÓN SUPABASE
     Nota: esta es la anon public key.
     Nunca coloques aquí la service_role key.
  ============================== */
  const SUPABASE_REST_URL =
    "https://pfqnktvuletywssnmewv.supabase.co/rest/v1/cotizaciones_solares";

  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcW5rdHZ1bGV0eXdzc25tZXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MDk5MTcsImV4cCI6MjA5NjA4NTkxN30.sNOsM37_X0J76SiWp2qpIUUB1veiqh5Ypz-8CMdQzRc";

  const guardarCotizacionSupabase = async (datosCotizacion) => {
    const respuesta = await fetch(SUPABASE_REST_URL, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(datosCotizacion),
    });

    if (!respuesta.ok) {
      const error = await respuesta.text();
      console.error("Error al guardar en Supabase:", error);
      throw new Error("No se pudo guardar la cotización en la base de datos.");
    }

    return true;
  };

  /* ==============================
     MENÚ MÓVIL
  ============================== */
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

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

  /* ==============================
     FORMULARIO GENERAL DE COTIZACIÓN
  ============================== */
  const quoteForm = document.getElementById("quote-form");

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

  /* ==============================
     CALCULADORA SOLAR AVANZADA
  ============================== */
  const solarForm = document.getElementById("solar-calculator-form");

  if (solarForm) {
    const coberturaInput = document.getElementById("cobertura-solar");
    const coberturaValor = document.getElementById("cobertura-valor");
    const tipoSistemaInput = document.getElementById("tipo-sistema");
    const nivelBateriaInput = document.getElementById("nivel-bateria");
    const solarWhatsapp = document.getElementById("solar-whatsapp");

    let ultimaCotizacionSolar = null;
    let ultimaUrlWhatsapp = "#";

    const formatoDinero = (valor) => {
      return `B/. ${valor.toLocaleString("es-PA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };

    const obtenerCostoBateria = (nivelBateria) => {
      switch (nivelBateria) {
        case "Respaldo básico":
          return { min: 2500, max: 4000 };

        case "Respaldo medio":
          return { min: 4000, max: 7000 };

        case "Respaldo alto":
          return { min: 7000, max: 12000 };

        default:
          return { min: 0, max: 0 };
      }
    };

    const obtenerRangoPrecioPorWatt = (tipoSistema) => {
      switch (tipoSistema) {
        case "Conectado a red con baterías":
          return { min: 1.35, max: 2.20 };

        case "Sistema aislado con baterías":
          return { min: 1.70, max: 2.80 };

        default:
          return { min: 1.30, max: 2.10 };
      }
    };

    const obtenerFactorComplejidad = (complejidad) => {
      switch (complejidad) {
        case "Media":
          return 1.08;

        case "Alta":
          return 1.15;

        default:
          return 1.0;
      }
    };

    const ajustarSelectorBaterias = () => {
      if (tipoSistemaInput.value === "Conectado a red sin baterías") {
        nivelBateriaInput.value = "Sin baterías";
        nivelBateriaInput.disabled = true;
      } else {
        nivelBateriaInput.disabled = false;

        if (nivelBateriaInput.value === "Sin baterías") {
          nivelBateriaInput.value = "Respaldo básico";
        }
      }
    };

    coberturaInput.addEventListener("input", () => {
      coberturaValor.textContent = `${coberturaInput.value}%`;
    });

    tipoSistemaInput.addEventListener("change", ajustarSelectorBaterias);

    solarForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const clienteNombre = document
        .getElementById("cliente-nombre")
        .value.trim();

      const clienteWhatsapp = document
        .getElementById("cliente-whatsapp")
        .value.trim();

      const clienteCorreo = document
        .getElementById("cliente-correo")
        .value.trim();

      const clienteUbicacion = document
        .getElementById("cliente-ubicacion")
        .value.trim();

      const distribuidora = document.getElementById("distribuidora").value;

      const consumoMensual = parseFloat(
        document.getElementById("consumo-kwh").value
      );

      const facturaMensual = parseFloat(
        document.getElementById("factura-mensual").value
      );

      const cobertura =
        parseFloat(document.getElementById("cobertura-solar").value) / 100;

      const tipoSistema = document.getElementById("tipo-sistema").value;
      const nivelBateria = document.getElementById("nivel-bateria").value;
      const excedentesRed = document.getElementById("excedentes-red").value;
      const tipoTecho = document.getElementById("tipo-techo").value;

      const complejidad = document.getElementById(
        "complejidad-instalacion"
      ).value;

      const potenciaPanel = parseFloat(
        document.getElementById("potencia-panel").value
      );

      const horasSol = parseFloat(document.getElementById("horas-sol").value);

      const eficiencia =
        parseFloat(document.getElementById("eficiencia-sistema").value) / 100;

      const aceptaDatos = document.getElementById("acepta-datos").checked;

      if (!aceptaDatos) {
        alert(
          "Debes aceptar el uso de datos para que Voltex pueda preparar la cotización."
        );
        return;
      }

      if (
        !clienteNombre ||
        !clienteWhatsapp ||
        !clienteUbicacion ||
        !distribuidora ||
        !tipoSistema ||
        consumoMensual <= 0 ||
        facturaMensual <= 0 ||
        potenciaPanel <= 0 ||
        horasSol <= 0 ||
        eficiencia <= 0
      ) {
        alert("Por favor, completa todos los datos obligatorios correctamente.");
        return;
      }

      const consumoACubrir = consumoMensual * cobertura;
      const consumoDiarioACubrir = consumoACubrir / 30;

      const kwpNecesarios = consumoDiarioACubrir / (horasSol * eficiencia);
      const cantidadPaneles = Math.ceil((kwpNecesarios * 1000) / potenciaPanel);
      const sistemaRealKwp = (cantidadPaneles * potenciaPanel) / 1000;

      const generacionMensual = sistemaRealKwp * horasSol * eficiencia * 30;

      const tarifaPromedio = facturaMensual / consumoMensual;
      const energiaAprovechada = Math.min(generacionMensual, consumoACubrir);

      const ahorroMensual = energiaAprovechada * tarifaPromedio;
      const ahorroAnual = ahorroMensual * 12;

      const areaPorPanel = 2.6;
      const areaRequerida = cantidadPaneles * areaPorPanel;

      const wattsSistema = sistemaRealKwp * 1000;
      const rangoPrecioWatt = obtenerRangoPrecioPorWatt(tipoSistema);
      const costoBateria = obtenerCostoBateria(nivelBateria);
      const factorComplejidad = obtenerFactorComplejidad(complejidad);

      const inversionMin =
        wattsSistema * rangoPrecioWatt.min * factorComplejidad +
        costoBateria.min;

      const inversionMax =
        wattsSistema * rangoPrecioWatt.max * factorComplejidad +
        costoBateria.max;

      const retornoMin = ahorroAnual > 0 ? inversionMin / ahorroAnual : 0;
      const retornoMax = ahorroAnual > 0 ? inversionMax / ahorroAnual : 0;

      document.getElementById(
        "resultado-kwp"
      ).textContent = `${sistemaRealKwp.toFixed(2)} kWp`;

      document.getElementById(
        "resultado-paneles"
      ).textContent = `${cantidadPaneles} paneles de ${potenciaPanel} W`;

      document.getElementById(
        "resultado-generacion"
      ).textContent = `${generacionMensual.toFixed(0)} kWh/mes`;

      document.getElementById("resultado-ahorro-mensual").textContent =
        formatoDinero(ahorroMensual);

      document.getElementById("resultado-ahorro-anual").textContent =
        formatoDinero(ahorroAnual);

      document.getElementById("resultado-inversion").textContent = `${formatoDinero(
        inversionMin
      )} - ${formatoDinero(inversionMax)}`;

      document.getElementById(
        "resultado-retorno"
      ).textContent = `${retornoMin.toFixed(1)} - ${retornoMax.toFixed(
        1
      )} años`;

      document.getElementById(
        "resultado-area"
      ).textContent = `${areaRequerida.toFixed(1)} m²`;

      document.getElementById("resultado-tipo-sistema").textContent =
        tipoSistema;

      document.getElementById("resultado-baterias").textContent = nivelBateria;

      ultimaCotizacionSolar = {
        nombre: clienteNombre,
        whatsapp: clienteWhatsapp,
        correo: clienteCorreo || null,
        ubicacion: clienteUbicacion,
        distribuidora: distribuidora,

        consumo_kwh: consumoMensual,
        factura_mensual: facturaMensual,
        tarifa_promedio: tarifaPromedio,
        porcentaje_cobertura: cobertura * 100,

        tipo_sistema: tipoSistema,
        nivel_bateria: nivelBateria,
        excedentes_red: excedentesRed,
        tipo_techo: tipoTecho,
        complejidad_instalacion: complejidad,

        potencia_panel: potenciaPanel,
        horas_sol: horasSol,
        eficiencia_sistema: eficiencia * 100,

        kwp_recomendado: sistemaRealKwp,
        cantidad_paneles: cantidadPaneles,
        generacion_mensual: generacionMensual,
        ahorro_mensual: ahorroMensual,
        ahorro_anual: ahorroAnual,
        area_requerida: areaRequerida,
        inversion_min: inversionMin,
        inversion_max: inversionMax,
        retorno_min: retornoMin,
        retorno_max: retornoMax,

        prioridad_cliente: "Nuevo",
        estado: "Nuevo",
        observaciones:
          "Cotización generada desde calculadora solar web. Pendiente de revisión técnica.",
        origen: "Calculadora web",
        acepto_uso_datos: aceptaDatos,
      };

      const numeroWhatsApp = "50763389243";

      const mensaje = `Hola, Voltex Innovations PA. Realicé una estimación solar en la página web y deseo una cotización.

Datos del cliente:
Nombre: ${clienteNombre}
WhatsApp: ${clienteWhatsapp}
Correo: ${clienteCorreo || "No indicado"}
Ubicación: ${clienteUbicacion}
Distribuidora: ${distribuidora}

Datos eléctricos:
Consumo mensual: ${consumoMensual} kWh
Factura mensual: ${formatoDinero(facturaMensual)}
Tarifa promedio estimada: ${formatoDinero(tarifaPromedio)} / kWh
Porcentaje a cubrir: ${(cobertura * 100).toFixed(0)}%

Sistema solicitado:
Tipo de sistema: ${tipoSistema}
Baterías: ${nivelBateria}
Inyección de excedentes: ${excedentesRed}
Tipo de techo: ${tipoTecho}
Complejidad estimada: ${complejidad}

Resultado estimado:
Sistema recomendado: ${sistemaRealKwp.toFixed(2)} kWp
Cantidad de paneles: ${cantidadPaneles} paneles de ${potenciaPanel} W
Generación mensual estimada: ${generacionMensual.toFixed(0)} kWh/mes
Ahorro mensual estimado: ${formatoDinero(ahorroMensual)}
Ahorro anual estimado: ${formatoDinero(ahorroAnual)}
Inversión estimada instalada: ${formatoDinero(inversionMin)} - ${formatoDinero(
        inversionMax
      )}
Retorno aproximado: ${retornoMin.toFixed(1)} - ${retornoMax.toFixed(1)} años
Área aproximada requerida: ${areaRequerida.toFixed(1)} m²

Nota: Entiendo que esta es una estimación preliminar y que la cotización final depende de una evaluación técnica.`;

      ultimaUrlWhatsapp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
        mensaje
      )}`;

      solarWhatsapp.href = "#";
      solarWhatsapp.textContent = "Enviar resultado a Voltex";
      solarWhatsapp.classList.remove("disabled-link");
    });

    solarWhatsapp.addEventListener("click", async (event) => {
      event.preventDefault();

      if (!ultimaCotizacionSolar || ultimaUrlWhatsapp === "#") {
        alert("Primero debes calcular el sistema solar.");
        return;
      }

      solarWhatsapp.textContent = "Guardando y abriendo WhatsApp...";

      try {
        await guardarCotizacionSupabase(ultimaCotizacionSolar);

        window.open(ultimaUrlWhatsapp, "_blank", "noopener,noreferrer");

        solarWhatsapp.textContent = "Resultado enviado a Voltex";
      } catch (error) {
        console.error(error);

        const abrirWhatsapp = confirm(
          "No se pudo guardar la información en la base de datos. ¿Deseas enviar el resultado por WhatsApp de todas formas?"
        );

        if (abrirWhatsapp) {
          window.open(ultimaUrlWhatsapp, "_blank", "noopener,noreferrer");
        }

        solarWhatsapp.textContent = "Enviar resultado a Voltex";
      }
    });

    ajustarSelectorBaterias();
  }

  console.log("Sitio web de Voltex Innovations PA cargado correctamente.");
});