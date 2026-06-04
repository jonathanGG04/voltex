/* ==============================
   CONFIGURACIÓN SUPABASE
============================== */
const SUPABASE_URL = "https://pfqnktvuletywssnmewv.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcW5rdHZ1bGV0eXdzc25tZXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MDk5MTcsImV4cCI6MjA5NjA4NTkxN30.sNOsM37_X0J76SiWp2qpIUUB1veiqh5Ypz-8CMdQzRc";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

/* ==============================
   ELEMENTOS DEL DOM
============================== */
const loginScreen = document.getElementById("login-screen");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginMessage = document.getElementById("login-message");

const logoutBtn = document.getElementById("logout-btn");

const quotesGrid = document.getElementById("quotes-grid");
const panelMessage = document.getElementById("panel-message");

const estadoFilter = document.getElementById("estado-filter");
const prioridadFilter = document.getElementById("prioridad-filter");
const searchInput = document.getElementById("search-input");
const refreshBtn = document.getElementById("refresh-btn");

const totalCotizaciones = document.getElementById("total-cotizaciones");
const totalNuevas = document.getElementById("total-nuevas");
const totalAltaPrioridad = document.getElementById("total-alta-prioridad");
const valorTotalEstimado = document.getElementById("valor-total-estimado");
const utilidadTotalEstimada = document.getElementById("utilidad-total-estimada");

let cotizaciones = [];

/* ==============================
   FUNCIONES DE FORMATO
============================== */
const formatoDinero = (valor) => {
  const numero = Number(valor || 0);

  return `B/. ${numero.toLocaleString("es-PA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatoNumero = (valor, decimales = 2) => {
  const numero = Number(valor || 0);
  return numero.toFixed(decimales);
};

const formatoFecha = (fecha) => {
  if (!fecha) return "Sin fecha";

  const date = new Date(fecha);

  return date.toLocaleString("es-PA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const escaparHtml = (texto) => {
  if (texto === null || texto === undefined) return "";

  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const normalizarWhatsapp = (whatsapp) => {
  if (!whatsapp) return "";

  const soloNumeros = String(whatsapp).replace(/\D/g, "");

  if (soloNumeros.startsWith("507")) {
    return soloNumeros;
  }

  return `507${soloNumeros}`;
};

const mostrarMensaje = (mensaje, tipo = "normal") => {
    const generarCotizacion = (item) => {
  const fechaActual = new Date().toLocaleDateString("es-PA", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const cotizacionHTML = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Cotización Voltex - ${escaparHtml(item.nombre || "Cliente")}</title>

      <style>
        * {
          box-sizing: border-box;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
          margin: 0;
          padding: 40px;
          color: #222;
          background: #f4f7fa;
          line-height: 1.6;
        }

        .document {
          max-width: 900px;
          margin: auto;
          background: white;
          padding: 45px;
          border-radius: 14px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }

        .header {
          display: flex;
          justify-content: space-between;
          gap: 25px;
          align-items: flex-start;
          border-bottom: 4px solid #00c8ff;
          padding-bottom: 22px;
          margin-bottom: 30px;
        }

        .brand h1 {
          margin: 0;
          color: #081c2f;
          font-size: 30px;
        }

        .brand h1 span {
          color: #00c8ff;
        }

        .brand p {
          margin: 6px 0 0;
          color: #555;
        }

        .quote-info {
          text-align: right;
          font-size: 14px;
          color: #444;
        }

        h2 {
          color: #081c2f;
          font-size: 22px;
          margin-top: 32px;
          border-bottom: 1px solid #dce4ea;
          padding-bottom: 8px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px 22px;
        }

        .item {
          background: #f4f7fa;
          padding: 12px;
          border-radius: 8px;
        }

        .item span {
          display: block;
          color: #555;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .item strong {
          color: #081c2f;
          font-size: 15px;
        }

        .price-box {
          background: #081c2f;
          color: white;
          padding: 24px;
          border-radius: 12px;
          margin-top: 20px;
        }

        .price-box span {
          display: block;
          color: #d6d6d6;
          margin-bottom: 8px;
        }

        .price-box strong {
          color: #00c8ff;
          font-size: 30px;
        }

        ul {
          padding-left: 22px;
        }

        li {
          margin-bottom: 8px;
        }

        .note {
          background: #fff8e1;
          border-left: 5px solid #ffc107;
          padding: 16px;
          border-radius: 8px;
          margin-top: 20px;
          color: #4d3b00;
        }

        .signatures {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 50px;
          margin-top: 60px;
        }

        .signature-line {
          border-top: 1px solid #222;
          padding-top: 8px;
          text-align: center;
          font-size: 14px;
        }

        .actions {
          max-width: 900px;
          margin: 20px auto;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn {
          border: none;
          padding: 12px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .print-btn {
          background: #00c8ff;
          color: #081c2f;
        }

        .close-btn {
          background: #081c2f;
          color: white;
        }

        @media print {
          body {
            background: white;
            padding: 0;
          }

          .document {
            box-shadow: none;
            border-radius: 0;
            padding: 25px;
          }

          .actions {
            display: none;
          }
        }
      </style>
    </head>

    <body>
      <div class="actions">
        <button class="btn print-btn" onclick="window.print()">Imprimir / Guardar PDF</button>
        <button class="btn close-btn" onclick="window.close()">Cerrar</button>
      </div>

      <main class="document">
        <section class="header">
          <div class="brand">
            <h1><span>Voltex</span> Innovations PA</h1>
            <p>Soluciones eléctricas, solares e industriales</p>
            <p>voltexinnovationspa@gmail.com | +507 6338-9243</p>
          </div>

          <div class="quote-info">
            <strong>Cotización preliminar</strong><br />
            Fecha: ${fechaActual}<br />
            Estado: ${escaparHtml(item.estado || "Nuevo")}
          </div>
        </section>

        <h2>1. Datos del cliente</h2>

        <div class="grid">
          <div class="item">
            <span>Cliente</span>
            <strong>${escaparHtml(item.nombre || "No indicado")}</strong>
          </div>

          <div class="item">
            <span>WhatsApp</span>
            <strong>${escaparHtml(item.whatsapp || "No indicado")}</strong>
          </div>

          <div class="item">
            <span>Correo</span>
            <strong>${escaparHtml(item.correo || "No indicado")}</strong>
          </div>

          <div class="item">
            <span>Ubicación</span>
            <strong>${escaparHtml(item.ubicacion || "No indicada")}</strong>
          </div>

          <div class="item">
            <span>Distribuidora</span>
            <strong>${escaparHtml(item.distribuidora || "No indicada")}</strong>
          </div>

          <div class="item">
            <span>Fecha de solicitud</span>
            <strong>${formatoFecha(item.fecha)}</strong>
          </div>
        </div>

        <h2>2. Resumen de consumo eléctrico</h2>

        <div class="grid">
          <div class="item">
            <span>Consumo mensual</span>
            <strong>${formatoNumero(item.consumo_kwh, 0)} kWh/mes</strong>
          </div>

          <div class="item">
            <span>Factura mensual aproximada</span>
            <strong>${formatoDinero(item.factura_mensual)}</strong>
          </div>

          <div class="item">
            <span>Tarifa promedio estimada</span>
            <strong>${formatoDinero(item.tarifa_promedio)} / kWh</strong>
          </div>

          <div class="item">
            <span>Porcentaje a cubrir</span>
            <strong>${formatoNumero(item.porcentaje_cobertura, 0)}%</strong>
          </div>
        </div>

        <h2>3. Sistema solar estimado</h2>

        <div class="grid">
          <div class="item">
            <span>Potencia recomendada</span>
            <strong>${formatoNumero(item.kwp_recomendado, 2)} kWp</strong>
          </div>

          <div class="item">
            <span>Cantidad estimada de paneles</span>
            <strong>${item.cantidad_paneles || 0} paneles</strong>
          </div>

          <div class="item">
            <span>Potencia del panel</span>
            <strong>${formatoNumero(item.potencia_panel, 0)} W</strong>
          </div>

          <div class="item">
            <span>Generación mensual estimada</span>
            <strong>${formatoNumero(item.generacion_mensual, 0)} kWh/mes</strong>
          </div>

          <div class="item">
            <span>Tipo de sistema</span>
            <strong>${escaparHtml(item.tipo_sistema || "No indicado")}</strong>
          </div>

          <div class="item">
            <span>Baterías</span>
            <strong>${escaparHtml(item.nivel_bateria || "No indicado")}</strong>
          </div>

          <div class="item">
            <span>Excedentes a red</span>
            <strong>${escaparHtml(item.excedentes_red || "No indicado")}</strong>
          </div>

          <div class="item">
            <span>Área aproximada requerida</span>
            <strong>${formatoNumero(item.area_requerida, 1)} m²</strong>
          </div>
        </div>

        <h2>4. Ahorro e inversión estimada</h2>

        <div class="grid">
          <div class="item">
            <span>Ahorro mensual estimado</span>
            <strong>${formatoDinero(item.ahorro_mensual)}</strong>
          </div>

          <div class="item">
            <span>Ahorro anual estimado</span>
            <strong>${formatoDinero(item.ahorro_anual)}</strong>
          </div>

          <div class="item">
            <span>Retorno aproximado</span>
            <strong>${formatoNumero(item.retorno_min, 1)} - ${formatoNumero(
    item.retorno_max,
    1
  )} años</strong>
          </div>

          <div class="item">
            <span>Rango estimado instalado</span>
            <strong>${formatoDinero(item.inversion_min)} - ${formatoDinero(
    item.inversion_max
  )}</strong>
          </div>
        </div>

        <div class="price-box">
          <span>Precio recomendado preliminar</span>
          <strong>${formatoDinero(item.precio_cobro_recomendado)}</strong>
        </div>

        <h2>5. Alcance preliminar del servicio</h2>

        <ul>
          <li>Suministro e instalación de paneles solares fotovoltaicos.</li>
          <li>Estructura de montaje según condiciones del techo o superficie disponible.</li>
          <li>Inversor solar o inversor híbrido, según el tipo de sistema definido.</li>
          <li>Protecciones eléctricas en corriente continua y corriente alterna.</li>
          <li>Cableado, canalización y accesorios requeridos para la instalación.</li>
          <li>Configuración básica, puesta en marcha y verificación funcional.</li>
          <li>Recomendaciones de operación y mantenimiento.</li>
        </ul>

        <h2>6. Condiciones por verificar</h2>

        <div class="grid">
          <div class="item">
            <span>Tipo de techo</span>
            <strong>${escaparHtml(item.tipo_techo || "Pendiente")}</strong>
          </div>

          <div class="item">
            <span>Complejidad estimada</span>
            <strong>${escaparHtml(
              item.complejidad_instalacion || "Pendiente"
            )}</strong>
          </div>
        </div>

        <div class="note">
          Esta cotización es preliminar y debe validarse mediante visita técnica.
          El precio final puede variar según sombras, estado del techo, distancia
          al tablero, protecciones eléctricas, canalización, inversor, baterías,
          permisos, interconexión y condiciones reales del sitio.
        </div>

        <h2>7. Condiciones comerciales</h2>

        <ul>
          <li>Validez preliminar: 15 días calendario.</li>
          <li>Los precios pueden variar según disponibilidad de equipos y materiales.</li>
          <li>La instalación queda sujeta a inspección técnica y aceptación de la propuesta final.</li>
          <li>La inyección de excedentes depende de evaluación y aprobación de la distribuidora correspondiente.</li>
        </ul>

        <div class="signatures">
          <div class="signature-line">
            Cliente
          </div>

          <div class="signature-line">
            Voltex Innovations PA
          </div>
        </div>
      </main>
    </body>
    </html>
  `;

  const ventana = window.open("", "_blank", "noopener,noreferrer");

  if (!ventana) {
    alert("El navegador bloqueó la ventana emergente. Permite pop-ups para generar la cotización.");
    return;
  }

  ventana.document.open();
  ventana.document.write(cotizacionHTML);
  ventana.document.close();
};

  panelMessage.textContent = mensaje;

  if (tipo === "error") {
    panelMessage.style.color = "#d93636";
  } else if (tipo === "success") {
    panelMessage.style.color = "#008a3d";
  } else {
    panelMessage.style.color = "#081c2f";
  }
};

/* ==============================
   AUTENTICACIÓN
============================== */
const verificarSesion = async () => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (session) {
    loginScreen.classList.add("hidden");
    dashboard.classList.remove("hidden");
    await cargarCotizaciones();
  } else {
    loginScreen.classList.remove("hidden");
    dashboard.classList.add("hidden");
  }
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginMessage.textContent = "Verificando credenciales...";

  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    loginMessage.textContent =
      "No se pudo iniciar sesión. Verifica el correo o la contraseña.";
    return;
  }

  loginMessage.textContent = "";
  loginForm.reset();

  loginScreen.classList.add("hidden");
  dashboard.classList.remove("hidden");

  await cargarCotizaciones();
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();

  dashboard.classList.add("hidden");
  loginScreen.classList.remove("hidden");
});

/* ==============================
   CARGA DE COTIZACIONES
============================== */
const cargarCotizaciones = async () => {
  mostrarMensaje("Cargando solicitudes...");

  const { data, error } = await supabaseClient
    .from("cotizaciones_solares")
    .select(
      `
      id,
      fecha,
      nombre,
      whatsapp,
      correo,
      ubicacion,
      distribuidora,
      consumo_kwh,
      factura_mensual,
      tarifa_promedio,
      porcentaje_cobertura,
      tipo_sistema,
      nivel_bateria,
      excedentes_red,
      tipo_techo,
      complejidad_instalacion,
      potencia_panel,
      horas_sol,
      eficiencia_sistema,
      kwp_recomendado,
      cantidad_paneles,
      generacion_mensual,
      ahorro_mensual,
      ahorro_anual,
      area_requerida,
      inversion_min,
      inversion_max,
      precio_minimo_recomendado,
      precio_cobro_recomendado,
      precio_premium,
      margen_interno,
      mano_obra_porcentaje,
      imprevistos_porcentaje,
      costo_interno_estimado,
      utilidad_estimada,
      retorno_min,
      retorno_max,
      prioridad_cliente,
      estado,
      observaciones,
      origen
      `
    )
    .order("fecha", { ascending: false });

  if (error) {
    console.error(error);
    mostrarMensaje(
      "No se pudieron cargar las solicitudes. Revisa permisos o conexión.",
      "error"
    );
    return;
  }

  cotizaciones = data || [];

  actualizarResumen();
  renderizarCotizaciones();

  mostrarMensaje("Solicitudes cargadas correctamente.", "success");
};

const actualizarResumen = () => {
  const total = cotizaciones.length;

  const nuevas = cotizaciones.filter(
    (item) => item.estado === "Nuevo"
  ).length;

  const altaPrioridad = cotizaciones.filter(
    (item) => item.prioridad_cliente === "Alta"
  ).length;

  const valorTotal = cotizaciones.reduce((suma, item) => {
    return suma + Number(item.precio_cobro_recomendado || 0);
  }, 0);

  const utilidadTotal = cotizaciones.reduce((suma, item) => {
    return suma + Number(item.utilidad_estimada || 0);
  }, 0);

  totalCotizaciones.textContent = total;
  totalNuevas.textContent = nuevas;
  totalAltaPrioridad.textContent = altaPrioridad;
  valorTotalEstimado.textContent = formatoDinero(valorTotal);
  utilidadTotalEstimada.textContent = formatoDinero(utilidadTotal);
};

/* ==============================
   FILTRADO Y RENDER
============================== */
const obtenerCotizacionesFiltradas = () => {
  const estadoSeleccionado = estadoFilter.value;
  const prioridadSeleccionada = prioridadFilter.value;
  const busqueda = searchInput.value.trim().toLowerCase();

  return cotizaciones.filter((item) => {
    const coincideEstado =
      estadoSeleccionado === "Todos" || item.estado === estadoSeleccionado;

    const coincidePrioridad =
      prioridadSeleccionada === "Todas" ||
      item.prioridad_cliente === prioridadSeleccionada;

    const textoBusqueda = `
      ${item.nombre || ""}
      ${item.whatsapp || ""}
      ${item.ubicacion || ""}
      ${item.tipo_sistema || ""}
      ${item.nivel_bateria || ""}
    `.toLowerCase();

    const coincideBusqueda =
      busqueda === "" || textoBusqueda.includes(busqueda);

    return coincideEstado && coincidePrioridad && coincideBusqueda;
  });
};

const renderizarCotizaciones = () => {
  const lista = obtenerCotizacionesFiltradas();

  quotesGrid.innerHTML = "";

  if (lista.length === 0) {
    quotesGrid.innerHTML = `
      <div class="quote-card">
        <h3>No hay solicitudes para mostrar</h3>
        <p>Prueba cambiando los filtros o actualizando el panel.</p>
      </div>
    `;
    return;
  }

  lista.forEach((item) => {
    const numeroWhatsapp = normalizarWhatsapp(item.whatsapp);

    const mensajeWhatsapp = `Hola ${item.nombre || ""}, le saluda Voltex Innovations PA. Recibimos su solicitud de cotización solar y queremos coordinar la revisión técnica para confirmar el sistema recomendado.`;

    const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(
      mensajeWhatsapp
    )}`;

    const prioridad = item.prioridad_cliente || "Normal";
    const estado = item.estado || "Nuevo";

    const card = document.createElement("article");
    card.className = "quote-card";

    card.innerHTML = `
      <div class="quote-card-header">
        <div>
          <h3>${escaparHtml(item.nombre || "Cliente sin nombre")}</h3>
          <small>${formatoFecha(item.fecha)}</small>
        </div>

        <div>
          <span class="priority-badge priority-${escaparHtml(prioridad)}">
            ${escaparHtml(prioridad)}
          </span>
          <span class="status-badge">
            ${escaparHtml(estado)}
          </span>
        </div>
      </div>

      <div class="quote-details">
        <div class="detail-item">
          <span>WhatsApp</span>
          <strong>${escaparHtml(item.whatsapp || "No indicado")}</strong>
        </div>

        <div class="detail-item">
          <span>Ubicación</span>
          <strong>${escaparHtml(item.ubicacion || "No indicada")}</strong>
        </div>

        <div class="detail-item">
          <span>Distribuidora</span>
          <strong>${escaparHtml(item.distribuidora || "No indicada")}</strong>
        </div>

        <div class="detail-item">
          <span>Consumo mensual</span>
          <strong>${formatoNumero(item.consumo_kwh, 0)} kWh</strong>
        </div>

        <div class="detail-item">
          <span>Factura mensual</span>
          <strong>${formatoDinero(item.factura_mensual)}</strong>
        </div>

        <div class="detail-item">
          <span>Tipo de sistema</span>
          <strong>${escaparHtml(item.tipo_sistema || "No indicado")}</strong>
        </div>

        <div class="detail-item">
          <span>Baterías</span>
          <strong>${escaparHtml(item.nivel_bateria || "No indicado")}</strong>
        </div>

        <div class="detail-item">
          <span>Sistema recomendado</span>
          <strong>${formatoNumero(item.kwp_recomendado, 2)} kWp</strong>
        </div>

        <div class="detail-item">
          <span>Paneles</span>
          <strong>${item.cantidad_paneles || 0} paneles</strong>
        </div>

        <div class="detail-item">
          <span>Generación mensual</span>
          <strong>${formatoNumero(item.generacion_mensual, 0)} kWh/mes</strong>
        </div>

        <div class="detail-item">
          <span>Ahorro mensual</span>
          <strong>${formatoDinero(item.ahorro_mensual)}</strong>
        </div>

        <div class="detail-item">
          <span>Precio recomendado</span>
          <strong>${formatoDinero(item.precio_cobro_recomendado)}</strong>
        </div>

        <div class="detail-item">
          <span>Precio premium</span>
          <strong>${formatoDinero(item.precio_premium)}</strong>
        </div>

        <div class="detail-item">
          <span>Utilidad estimada</span>
          <strong>${formatoDinero(item.utilidad_estimada)}</strong>
        </div>

        <div class="detail-item">
          <span>Retorno aproximado</span>
          <strong>${formatoNumero(item.retorno_min, 1)} - ${formatoNumero(
      item.retorno_max,
      1
    )} años</strong>
        </div>
      </div>

      <div class="quote-actions">
        <a class="whatsapp-btn" href="${urlWhatsapp}" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>

        <button class="quote-doc-btn" data-id="${item.id}">
  Generar cotización
</button>

        <button class="state-btn" data-id="${item.id}" data-estado="Contactado">
          Contactado
        </button>

        <button class="state-btn" data-id="${item.id}" data-estado="Visita programada">
          Visita programada
        </button>

        <button class="state-btn" data-id="${item.id}" data-estado="Cotizado">
          Cotizado
        </button>

        <button class="state-btn" data-id="${item.id}" data-estado="Ganado">
          Ganado
        </button>

        <button class="state-btn" data-id="${item.id}" data-estado="Perdido">
          Perdido
        </button>
      </div>

      <div class="notes-box">
        <label for="nota-${item.id}">Nota interna</label>
        <textarea id="nota-${item.id}" placeholder="Escribe una nota interna...">${escaparHtml(
      item.observaciones || ""
    )}</textarea>

        <button class="save-note-btn" data-id="${item.id}">
          Guardar nota
        </button>
      </div>
    `;

    quotesGrid.appendChild(card);
  });

  activarBotonesEstado();
activarBotonesNotas();
activarBotonesCotizacion();
};

const activarBotonesEstado = () => {
  const botones = document.querySelectorAll(".state-btn");

  botones.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.dataset.id;
      const nuevoEstado = boton.dataset.estado;

      await actualizarEstado(id, nuevoEstado);
    });
  });
};

const activarBotonesNotas = () => {
  const botones = document.querySelectorAll(".save-note-btn");

  botones.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const id = boton.dataset.id;
      const textarea = document.getElementById(`nota-${id}`);
      const nota = textarea.value.trim();

      await actualizarNota(id, nota);
    });
  });
};

/* ==============================
   ACTUALIZACIONES
============================== */
const actualizarEstado = async (id, nuevoEstado) => {
  mostrarMensaje("Actualizando estado...");

  const { error } = await supabaseClient
    .from("cotizaciones_solares")
    .update({ estado: nuevoEstado })
    .eq("id", id);

  if (error) {
    console.error(error);
    mostrarMensaje("No se pudo actualizar el estado.", "error");
    return;
  }

  cotizaciones = cotizaciones.map((item) => {
    if (item.id === id) {
      return { ...item, estado: nuevoEstado };
    }

    return item;
  });

  actualizarResumen();
  renderizarCotizaciones();

  mostrarMensaje("Estado actualizado correctamente.", "success");
};

const actualizarNota = async (id, nota) => {
  mostrarMensaje("Guardando nota...");

  const { error } = await supabaseClient
    .from("cotizaciones_solares")
    .update({ observaciones: nota })
    .eq("id", id);

  if (error) {
    console.error(error);
    mostrarMensaje("No se pudo guardar la nota.", "error");
    return;
  }

  cotizaciones = cotizaciones.map((item) => {
    if (item.id === id) {
      return { ...item, observaciones: nota };
    }

    return item;
  });

  mostrarMensaje("Nota guardada correctamente.", "success");
};

/* ==============================
   EVENTOS DE FILTROS
============================== */
estadoFilter.addEventListener("change", renderizarCotizaciones);
prioridadFilter.addEventListener("change", renderizarCotizaciones);
searchInput.addEventListener("input", renderizarCotizaciones);

refreshBtn.addEventListener("click", async () => {
  await cargarCotizaciones();
});

/* ==============================
   INICIO
============================== */
verificarSesion();