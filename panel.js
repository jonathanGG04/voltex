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
   MONITOREO ENERGÉTICO
============================== */

const energyDeviceSelect = document.getElementById(
  "energy-device-select"
);

const energyPeriodSelect = document.getElementById(
  "energy-period-select"
);

const energyRefreshBtn = document.getElementById(
  "energy-refresh-btn"
);

const energyMessage = document.getElementById(
  "energy-message"
);

const energyDeviceName = document.getElementById(
  "energy-device-name"
);

const energyDeviceStatus = document.getElementById(
  "energy-device-status"
);

const energyLastContact = document.getElementById(
  "energy-last-contact"
);

const energyVoltage = document.getElementById(
  "energy-voltage"
);

const energyCurrent = document.getElementById(
  "energy-current"
);

const energyPower = document.getElementById(
  "energy-power"
);

const energyTotal = document.getElementById(
  "energy-total"
);

const energyFrequency = document.getElementById(
  "energy-frequency"
);

const energyPf = document.getElementById(
  "energy-pf"
);

const energyRssi = document.getElementById(
  "energy-rssi"
);

const energyPeriodConsumption = document.getElementById(
  "energy-period-consumption"
);

const energyEstimatedCost = document.getElementById(
  "energy-estimated-cost"
);

const energyReadingsBody = document.getElementById(
  "energy-readings-body"
);

let dispositivosEnergia = [];

let graficasEnergia = {
  potencia: null,
  consumo: null,
  voltaje: null,
  corriente: null,
};

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
   GENERAR COTIZACIÓN EDITABLE
============================== */
const generarCotizacion = (item) => {
  const fechaActual = new Date().toLocaleDateString("es-PA", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const firmaUrl = new URL("img/firma-voltex.png", window.location.href).href;

  const numeroWhatsappCliente = normalizarWhatsapp(item.whatsapp);

  const mensajeWhatsappCliente = `Hola ${item.nombre || ""}, le saluda Voltex Innovations PA.

Le compartimos la cotización preliminar de su sistema solar fotovoltaico.

Sistema estimado: ${formatoNumero(item.kwp_recomendado, 2)} kWp
Cantidad estimada de paneles: ${item.cantidad_paneles || 0}
Precio recomendado preliminar: ${formatoDinero(item.precio_cobro_recomendado)}

Esta cotización está sujeta a revisión técnica del sitio, condiciones del techo, protecciones, inversor, baterías e interconexión.

Quedamos atentos para coordinar los siguientes pasos.`;

  const urlWhatsappCliente = `https://wa.me/${numeroWhatsappCliente}?text=${encodeURIComponent(
    mensajeWhatsappCliente
  )}`;

  const asuntoCorreo = `Cotización preliminar Voltex Innovations PA - ${
    item.nombre || "Cliente"
  }`;

  const cuerpoCorreo = `Saludos ${item.nombre || ""},

Le compartimos la cotización preliminar de su sistema solar fotovoltaico.

Sistema estimado: ${formatoNumero(item.kwp_recomendado, 2)} kWp
Cantidad estimada de paneles: ${item.cantidad_paneles || 0}
Precio recomendado preliminar: ${formatoDinero(item.precio_cobro_recomendado)}

Esta cotización debe validarse mediante visita técnica, revisión del techo, sombras, protecciones, inversor, baterías e interconexión.

Quedamos atentos para coordinar los siguientes pasos.

Atentamente,
Voltex Innovations PA
voltexinnovationspa@gmail.com
+507 6338-9243`;

  const mailtoUrl = `mailto:${item.correo || ""}?subject=${encodeURIComponent(
    asuntoCorreo
  )}&body=${encodeURIComponent(cuerpoCorreo)}`;

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

        .actions {
          max-width: 900px;
          margin: 20px auto;
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 12px;
        }

        .btn {
          border: none;
          padding: 12px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          text-decoration: none;
          font-size: 14px;
        }

        .print-btn {
          background: #00c8ff;
          color: #081c2f;
        }

        .whatsapp-btn {
          background: #25d366;
          color: white;
        }

        .email-btn {
          background: #ffb703;
          color: #081c2f;
        }

        .close-btn {
          background: #081c2f;
          color: white;
        }

        .edit-note {
          max-width: 900px;
          margin: 0 auto 15px;
          background: #fff8e1;
          border-left: 5px solid #ffc107;
          padding: 12px 16px;
          border-radius: 8px;
          color: #4d3b00;
          font-size: 14px;
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

        .editable {
          outline: 1px dashed transparent;
          padding: 2px 4px;
          border-radius: 4px;
          cursor: text;
        }

        .editable:hover,
        .editable:focus {
          outline: 1px dashed #00c8ff;
          background: #eefaff;
        }

        .signatures {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 50px;
          margin-top: 60px;
          align-items: end;
        }

        .signature-box {
          text-align: center;
        }

        .signature-img {
          max-width: 260px;
          max-height: 95px;
          object-fit: contain;
          display: block;
          margin: 0 auto 8px;
        }

        .signature-line {
          border-top: 1px solid #222;
          padding-top: 8px;
          text-align: center;
          font-size: 14px;
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

          .actions,
          .edit-note {
            display: none;
          }

          .editable:hover,
          .editable:focus {
            outline: none;
            background: transparent;
          }
        }
      </style>
    </head>

    <body>
      <div class="actions">
        <button class="btn print-btn" onclick="window.print()">Imprimir / Guardar PDF</button>
        <a class="btn whatsapp-btn" href="${urlWhatsappCliente}" target="_blank" rel="noopener noreferrer">Enviar por WhatsApp</a>
        <a class="btn email-btn" href="${mailtoUrl}">Preparar correo</a>
        <button class="btn close-btn" onclick="window.close()">Cerrar</button>
      </div>

      <div class="edit-note">
        Puedes editar los campos resaltables antes de imprimir o guardar como PDF.
        Haz clic sobre el texto que deseas cambiar. Para enviar el PDF por WhatsApp o correo,
        primero guárdalo como PDF y luego adjúntalo manualmente.
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
            Estado:
            <span class="editable" contenteditable="true">${escaparHtml(
              item.estado || "Nuevo"
            )}</span>
          </div>
        </section>

        <h2>1. Datos del cliente</h2>

        <div class="grid">
          <div class="item">
            <span>Cliente</span>
            <strong class="editable" contenteditable="true">${escaparHtml(
              item.nombre || "No indicado"
            )}</strong>
          </div>

          <div class="item">
            <span>WhatsApp</span>
            <strong class="editable" contenteditable="true">${escaparHtml(
              item.whatsapp || "No indicado"
            )}</strong>
          </div>

          <div class="item">
            <span>Correo</span>
            <strong class="editable" contenteditable="true">${escaparHtml(
              item.correo || "No indicado"
            )}</strong>
          </div>

          <div class="item">
            <span>Ubicación</span>
            <strong class="editable" contenteditable="true">${escaparHtml(
              item.ubicacion || "No indicada"
            )}</strong>
          </div>

          <div class="item">
            <span>Distribuidora</span>
            <strong class="editable" contenteditable="true">${escaparHtml(
              item.distribuidora || "No indicada"
            )}</strong>
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
            <strong class="editable" contenteditable="true">${formatoNumero(
              item.consumo_kwh,
              0
            )} kWh/mes</strong>
          </div>

          <div class="item">
            <span>Factura mensual aproximada</span>
            <strong class="editable" contenteditable="true">${formatoDinero(
              item.factura_mensual
            )}</strong>
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
            <strong class="editable" contenteditable="true">${formatoNumero(
              item.kwp_recomendado,
              2
            )} kWp</strong>
          </div>

          <div class="item">
            <span>Cantidad estimada de paneles</span>
            <strong class="editable" contenteditable="true">${
              item.cantidad_paneles || 0
            } paneles</strong>
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
            <strong class="editable" contenteditable="true">${escaparHtml(
              item.tipo_sistema || "No indicado"
            )}</strong>
          </div>

          <div class="item">
            <span>Baterías</span>
            <strong class="editable" contenteditable="true">${escaparHtml(
              item.nivel_bateria || "No indicado"
            )}</strong>
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
          <strong class="editable" contenteditable="true">${formatoDinero(
            item.precio_cobro_recomendado
          )}</strong>
        </div>

        <h2>5. Alcance preliminar del servicio</h2>

        <ul class="editable" contenteditable="true">
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
            <strong class="editable" contenteditable="true">${escaparHtml(
              item.tipo_techo || "Pendiente"
            )}</strong>
          </div>

          <div class="item">
            <span>Complejidad estimada</span>
            <strong class="editable" contenteditable="true">${escaparHtml(
              item.complejidad_instalacion || "Pendiente"
            )}</strong>
          </div>
        </div>

        <div class="note editable" contenteditable="true">
          Esta cotización es preliminar y debe validarse mediante visita técnica.
          El precio final puede variar según sombras, estado del techo, distancia
          al tablero, protecciones eléctricas, canalización, inversor, baterías,
          permisos, interconexión y condiciones reales del sitio.
        </div>

        <h2>7. Condiciones comerciales</h2>

        <ul class="editable" contenteditable="true">
          <li>Validez preliminar: 15 días calendario.</li>
          <li>Los precios pueden variar según disponibilidad de equipos y materiales.</li>
          <li>La instalación queda sujeta a inspección técnica y aceptación de la propuesta final.</li>
          <li>La inyección de excedentes depende de evaluación y aprobación de la distribuidora correspondiente.</li>
        </ul>

        <div class="signatures">
          <div class="signature-box">
            <div class="signature-line">Cliente</div>
          </div>

          <div class="signature-box">
            <img
              src="${firmaUrl}"
              alt="Firma Voltex"
              class="signature-img"
              onerror="this.insertAdjacentHTML('afterend', '<p style=&quot;color:#777;font-size:12px;&quot;>Firma no encontrada</p>'); this.style.display='none';"
            />
            <div class="signature-line">Voltex Innovations PA</div>
          </div>
        </div>
      </main>
    </body>
    </html>
  `;

  const ventana = window.open("", "_blank");

  if (!ventana) {
    alert(
      "El navegador bloqueó la ventana emergente. Permite pop-ups para generar la cotización."
    );
    return;
  }

  ventana.document.open();
  ventana.document.write(cotizacionHTML);
  ventana.document.close();
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
    await cargarDispositivosEnergia();
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
  await cargarDispositivosEnergia();
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

  const nuevas = cotizaciones.filter((item) => item.estado === "Nuevo").length;

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

    const mensajeWhatsapp = `Hola ${
      item.nombre || ""
    }, le saluda Voltex Innovations PA. Recibimos su solicitud de cotización solar y queremos coordinar la revisión técnica para confirmar el sistema recomendado.`;

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
   EVENTO GLOBAL PARA GENERAR COTIZACIÓN
============================== */
quotesGrid.addEventListener("click", (event) => {
  const botonCotizacion = event.target.closest(".quote-doc-btn");

  if (!botonCotizacion) return;

  const id = botonCotizacion.dataset.id;
  const cotizacion = cotizaciones.find((item) => item.id === id);

  if (!cotizacion) {
    alert("No se encontró la información de esta cotización.");
    return;
  }

  generarCotizacion(cotizacion);
});

/* ==============================
   FUNCIONES DEL MONITOREO ENERGÉTICO
============================== */

const mostrarMensajeEnergia = (
  mensaje,
  tipo = ""
) => {
  if (!energyMessage) return;

  energyMessage.textContent = mensaje;
  energyMessage.className = "panel-message";

  if (tipo) {
    energyMessage.classList.add(tipo);
  }
};

const formatoFechaEnergia = (fecha) => {
  if (!fecha) return "--";

  const date = new Date(fecha);

  return date.toLocaleString("es-PA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const valorNumerico = (
  valor,
  decimales = 2,
  unidad = ""
) => {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return `--${unidad ? ` ${unidad}` : ""}`;
  }

  return `${numero.toFixed(decimales)}${
    unidad ? ` ${unidad}` : ""
  }`;
};

const actualizarEstadoDispositivo = (
  dispositivo
) => {
  if (
    !energyDeviceStatus ||
    !energyLastContact
  ) {
    return;
  }

  energyDeviceStatus.className = "";

  if (!dispositivo?.ultimo_contacto) {
    energyDeviceStatus.textContent = "Sin datos";
    energyDeviceStatus.classList.add(
      "energy-status-offline"
    );

    energyLastContact.textContent = "--";
    return;
  }

  const ultimoContacto = new Date(
    dispositivo.ultimo_contacto
  );

  const diferenciaSegundos =
    (Date.now() - ultimoContacto.getTime()) /
    1000;

  const intervalo = Number(
    dispositivo.intervalo_envio_segundos || 60
  );

  if (diferenciaSegundos <= intervalo * 3) {
    energyDeviceStatus.textContent = "En línea";
    energyDeviceStatus.classList.add(
      "energy-status-online"
    );
  } else if (diferenciaSegundos <= 600) {
    energyDeviceStatus.textContent =
      "Sin actualización reciente";

    energyDeviceStatus.classList.add(
      "energy-status-warning"
    );
  } else {
    energyDeviceStatus.textContent =
      "Fuera de línea";

    energyDeviceStatus.classList.add(
      "energy-status-offline"
    );
  }

  energyLastContact.textContent =
    formatoFechaEnergia(
      dispositivo.ultimo_contacto
    );
};

const calcularConsumoPeriodo = (
  lecturas
) => {
  if (!lecturas || lecturas.length < 2) {
    return 0;
  }

  let consumo = 0;
  let energiaAnterior = null;

  lecturas.forEach((lectura) => {
    const energiaActual = Number(
      lectura.energia_kwh
    );

    if (!Number.isFinite(energiaActual)) {
      return;
    }

    if (energiaAnterior !== null) {
      const diferencia =
        energiaActual - energiaAnterior;

      if (diferencia >= 0) {
        consumo += diferencia;
      } else {
        /*
          Si el PZEM fue reiniciado y la energía
          volvió a cero, se suma el nuevo valor.
        */
        consumo += energiaActual;
      }
    }

    energiaAnterior = energiaActual;
  });

  return consumo;
};

const calcularCostoPorBloques = (
  consumoMensual,
  tarifa
) => {
  const consumo = Math.max(
    Number(consumoMensual || 0),
    0
  );

  const bloque1 = Math.min(consumo, 300);

  const bloque2 = Math.min(
    Math.max(consumo - 300, 0),
    450
  );

  const bloque3 = Math.max(
    consumo - 750,
    0
  );

  return (
    Number(tarifa.cargo_fijo || 0) +
    bloque1 *
      Number(tarifa.precio_bloque_1 || 0) +
    bloque2 *
      Number(tarifa.precio_bloque_2 || 0) +
    bloque3 *
      Number(tarifa.precio_bloque_3 || 0)
  );
};

const obtenerTarifaDispositivo = async (
  dispositivo
) => {
  if (!dispositivo?.distribuidora) {
    return {
      tarifa: null,
      aproximada: true,
    };
  }

  const categoria =
    dispositivo.categoria_tarifaria || "BTS";

  const fechaActual = new Date()
    .toISOString()
    .slice(0, 10);

  const {
    data: tarifaVigente,
    error: errorVigente,
  } = await supabaseClient
    .from("tarifas_energia")
    .select(
      `
      distribuidora,
      categoria,
      vigente_desde,
      vigente_hasta,
      cargo_fijo,
      precio_bloque_1,
      precio_bloque_2,
      precio_bloque_3
      `
    )
    .eq(
      "distribuidora",
      dispositivo.distribuidora
    )
    .eq("categoria", categoria)
    .lte("vigente_desde", fechaActual)
    .gte("vigente_hasta", fechaActual)
    .order("vigente_desde", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (errorVigente) {
    console.error(errorVigente);
  }

  if (tarifaVigente) {
    return {
      tarifa: tarifaVigente,
      aproximada: false,
    };
  }

  /*
    Si todavía no se ha cargado una tarifa
    para el periodo actual, utiliza la última
    tarifa registrada como aproximación.
  */

  const {
    data: ultimaTarifa,
    error: errorUltima,
  } = await supabaseClient
    .from("tarifas_energia")
    .select(
      `
      distribuidora,
      categoria,
      vigente_desde,
      vigente_hasta,
      cargo_fijo,
      precio_bloque_1,
      precio_bloque_2,
      precio_bloque_3
      `
    )
    .eq(
      "distribuidora",
      dispositivo.distribuidora
    )
    .eq("categoria", categoria)
    .order("vigente_desde", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (errorUltima) {
    console.error(errorUltima);
  }

  return {
    tarifa: ultimaTarifa || null,
    aproximada: true,
  };
};

const calcularCostoPeriodo = async (
  dispositivo,
  consumoPeriodo,
  horasPeriodo
) => {
  const resultadoTarifa =
    await obtenerTarifaDispositivo(
      dispositivo
    );

  if (resultadoTarifa.tarifa) {
    /*
      Se proyecta el consumo del periodo a un
      mes de 30 días para aplicar los bloques.
      Luego el costo mensual se prorratea.
    */

    const horasMes = 720;

    const consumoMensualEstimado =
      horasPeriodo > 0
        ? consumoPeriodo *
          (horasMes / horasPeriodo)
        : consumoPeriodo;

    const costoMensualEstimado =
      calcularCostoPorBloques(
        consumoMensualEstimado,
        resultadoTarifa.tarifa
      );

    return {
      costo:
        costoMensualEstimado *
        (horasPeriodo / horasMes),

      aproximado:
        resultadoTarifa.aproximada,
    };
  }

  const tarifaPromedio = Number(
    dispositivo.tarifa_kwh || 0
  );

  return {
    costo:
      consumoPeriodo * tarifaPromedio,

    aproximado: true,
  };
};

const obtenerLecturasPaginadas = async (
  dispositivoId,
  fechaDesde
) => {
  const lecturas = [];

  const cantidadPagina = 1000;
  let desde = 0;
  let continuar = true;

  while (continuar) {
    const hasta =
      desde + cantidadPagina - 1;

    const { data, error } =
      await supabaseClient
        .from("lecturas_energia")
        .select(
          `
          id,
          fecha_servidor,
          voltaje,
          corriente,
          potencia,
          energia_kwh,
          frecuencia,
          factor_potencia,
          rssi
          `
        )
        .eq(
          "dispositivo_id",
          dispositivoId
        )
        .gte(
          "fecha_servidor",
          fechaDesde
        )
        .order("fecha_servidor", {
          ascending: true,
        })
        .range(desde, hasta);

    if (error) {
      throw error;
    }

    const pagina = data || [];

    lecturas.push(...pagina);

    if (pagina.length < cantidadPagina) {
      continuar = false;
    } else {
      desde += cantidadPagina;
    }

    /*
      Límite de seguridad para evitar una
      descarga excesiva accidental.
    */
    if (lecturas.length >= 50000) {
      continuar = false;
    }
  }

  return lecturas;
};

const reducirLecturasParaGrafica = (
  lecturas,
  maximoPuntos = 500
) => {
  if (lecturas.length <= maximoPuntos) {
    return lecturas;
  }

  const resultado = [];
  const paso =
    (lecturas.length - 1) /
    (maximoPuntos - 1);

  for (
    let indice = 0;
    indice < maximoPuntos;
    indice++
  ) {
    resultado.push(
      lecturas[
        Math.round(indice * paso)
      ]
    );
  }

  return resultado;
};

const destruirGraficasEnergia = () => {
  Object.keys(graficasEnergia).forEach(
    (clave) => {
      if (graficasEnergia[clave]) {
        graficasEnergia[clave].destroy();
        graficasEnergia[clave] = null;
      }
    }
  );
};

const crearGraficaEnergia = (
  canvasId,
  etiqueta,
  etiquetas,
  valores,
  unidad
) => {
  const canvas =
    document.getElementById(canvasId);

  if (
    !canvas ||
    typeof Chart === "undefined"
  ) {
    return null;
  }

  return new Chart(canvas, {
    type: "line",

    data: {
      labels: etiquetas,

      datasets: [
        {
          label: `${etiqueta} (${unidad})`,
          data: valores,
          borderColor: "#00c8ff",
          backgroundColor:
            "rgba(0, 200, 255, 0.15)",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: true,
          tension: 0.2,
          spanGaps: true,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,

      interaction: {
        mode: "index",
        intersect: false,
      },

      scales: {
        x: {
          ticks: {
            maxTicksLimit: 10,
          },
        },

        y: {
          beginAtZero: false,

          title: {
            display: true,
            text: unidad,
          },
        },
      },

      plugins: {
        legend: {
          display: true,
        },
      },
    },
  });
};

const renderizarGraficasEnergia = (
  lecturas
) => {
  destruirGraficasEnergia();

  const lecturasReducidas =
    reducirLecturasParaGrafica(lecturas);

  const etiquetas =
    lecturasReducidas.map((lectura) => {
      const fecha = new Date(
        lectura.fecha_servidor
      );

      return fecha.toLocaleString(
        "es-PA",
        {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    });

  graficasEnergia.potencia =
    crearGraficaEnergia(
      "energy-power-chart",
      "Potencia",
      etiquetas,
      lecturasReducidas.map(
        (lectura) =>
          Number(lectura.potencia)
      ),
      "W"
    );

  graficasEnergia.consumo =
    crearGraficaEnergia(
      "energy-consumption-chart",
      "Energía acumulada",
      etiquetas,
      lecturasReducidas.map(
        (lectura) =>
          Number(lectura.energia_kwh)
      ),
      "kWh"
    );

  graficasEnergia.voltaje =
    crearGraficaEnergia(
      "energy-voltage-chart",
      "Voltaje",
      etiquetas,
      lecturasReducidas.map(
        (lectura) =>
          Number(lectura.voltaje)
      ),
      "V"
    );

  graficasEnergia.corriente =
    crearGraficaEnergia(
      "energy-current-chart",
      "Corriente",
      etiquetas,
      lecturasReducidas.map(
        (lectura) =>
          Number(lectura.corriente)
      ),
      "A"
    );
};

const renderizarTablaEnergia = (
  lecturas
) => {
  if (!energyReadingsBody) return;

  const ultimasLecturas = [
    ...lecturas,
  ]
    .reverse()
    .slice(0, 50);

  if (ultimasLecturas.length === 0) {
    energyReadingsBody.innerHTML = `
      <tr>
        <td colspan="7">
          No hay lecturas en el periodo seleccionado.
        </td>
      </tr>
    `;

    return;
  }

  energyReadingsBody.innerHTML =
    ultimasLecturas
      .map(
        (lectura) => `
          <tr>
            <td>
              ${formatoFechaEnergia(
                lectura.fecha_servidor
              )}
            </td>

            <td>
              ${valorNumerico(
                lectura.voltaje,
                1,
                "V"
              )}
            </td>

            <td>
              ${valorNumerico(
                lectura.corriente,
                3,
                "A"
              )}
            </td>

            <td>
              ${valorNumerico(
                lectura.potencia,
                1,
                "W"
              )}
            </td>

            <td>
              ${valorNumerico(
                lectura.energia_kwh,
                3,
                "kWh"
              )}
            </td>

            <td>
              ${valorNumerico(
                lectura.frecuencia,
                1,
                "Hz"
              )}
            </td>

            <td>
              ${valorNumerico(
                lectura.factor_potencia,
                2
              )}
            </td>
          </tr>
        `
      )
      .join("");
};

const limpiarPanelEnergia = () => {
  energyDeviceName.textContent = "--";
  energyDeviceStatus.textContent =
    "Sin datos";

  energyLastContact.textContent = "--";
  energyVoltage.textContent = "-- V";
  energyCurrent.textContent = "-- A";
  energyPower.textContent = "-- W";
  energyTotal.textContent = "-- kWh";
  energyFrequency.textContent = "-- Hz";
  energyPf.textContent = "--";
  energyRssi.textContent = "-- dBm";

  energyPeriodConsumption.textContent =
    "-- kWh";

  energyEstimatedCost.textContent =
    "B/. --";

  destruirGraficasEnergia();

  if (energyReadingsBody) {
    energyReadingsBody.innerHTML = `
      <tr>
        <td colspan="7">
          No hay mediciones para mostrar.
        </td>
      </tr>
    `;
  }
};

const cargarLecturasEnergia = async () => {
  if (
    !energyDeviceSelect ||
    !energyPeriodSelect
  ) {
    return;
  }

  const dispositivoId =
    energyDeviceSelect.value;

  const horasPeriodo = Number(
    energyPeriodSelect.value || 24
  );

  const dispositivo =
    dispositivosEnergia.find(
      (item) =>
        String(item.id) ===
        String(dispositivoId)
    );

  if (!dispositivo) {
    limpiarPanelEnergia();

    mostrarMensajeEnergia(
      "Selecciona un dispositivo.",
      "error"
    );

    return;
  }

  mostrarMensajeEnergia(
    "Cargando mediciones...",
    "loading"
  );

  energyDeviceName.textContent =
    `${dispositivo.nombre_cliente} · ${dispositivo.codigo}`;

  actualizarEstadoDispositivo(
    dispositivo
  );

  const fechaDesde = new Date(
    Date.now() -
      horasPeriodo * 60 * 60 * 1000
  ).toISOString();

  try {
    const lecturas =
      await obtenerLecturasPaginadas(
        dispositivo.id,
        fechaDesde
      );

    if (lecturas.length === 0) {
      limpiarPanelEnergia();

      energyDeviceName.textContent =
        `${dispositivo.nombre_cliente} · ${dispositivo.codigo}`;

      actualizarEstadoDispositivo(
        dispositivo
      );

      mostrarMensajeEnergia(
        "No hay lecturas en el periodo seleccionado.",
        "error"
      );

      return;
    }

    const ultimaLectura =
      lecturas[lecturas.length - 1];

    energyVoltage.textContent =
      valorNumerico(
        ultimaLectura.voltaje,
        1,
        "V"
      );

    energyCurrent.textContent =
      valorNumerico(
        ultimaLectura.corriente,
        3,
        "A"
      );

    energyPower.textContent =
      valorNumerico(
        ultimaLectura.potencia,
        1,
        "W"
      );

    energyTotal.textContent =
      valorNumerico(
        ultimaLectura.energia_kwh,
        3,
        "kWh"
      );

    energyFrequency.textContent =
      valorNumerico(
        ultimaLectura.frecuencia,
        1,
        "Hz"
      );

    energyPf.textContent =
      valorNumerico(
        ultimaLectura.factor_potencia,
        2
      );

    energyRssi.textContent =
      valorNumerico(
        ultimaLectura.rssi,
        0,
        "dBm"
      );

    const consumoPeriodo =
      calcularConsumoPeriodo(lecturas);

    energyPeriodConsumption.textContent =
      valorNumerico(
        consumoPeriodo,
        3,
        "kWh"
      );

    const resultadoCosto =
      await calcularCostoPeriodo(
        dispositivo,
        consumoPeriodo,
        horasPeriodo
      );

    energyEstimatedCost.textContent =
      formatoDinero(
        resultadoCosto.costo
      );

    renderizarGraficasEnergia(lecturas);
    renderizarTablaEnergia(lecturas);

    const avisoCosto =
      resultadoCosto.aproximado
        ? " El costo utiliza una tarifa aproximada."
        : "";

    mostrarMensajeEnergia(
      `Se cargaron ${lecturas.length} lecturas.${avisoCosto}`,
      "success"
    );
  } catch (error) {
    console.error(error);

    mostrarMensajeEnergia(
      "No se pudieron cargar las mediciones.",
      "error"
    );
  }
};

const cargarDispositivosEnergia =
  async () => {
    if (!energyDeviceSelect) return;

    mostrarMensajeEnergia(
      "Cargando dispositivos...",
      "loading"
    );

    const { data, error } =
      await supabaseClient
        .from("dispositivos_energia")
        .select(
          `
          id,
          codigo,
          nombre_cliente,
          ubicacion,
          distribuidora,
          categoria_tarifaria,
          tarifa_kwh,
          activo,
          intervalo_envio_segundos,
          ultimo_contacto
          `
        )
        .eq("activo", true)
        .order("nombre_cliente", {
          ascending: true,
        });

    if (error) {
      console.error(error);

      energyDeviceSelect.innerHTML = `
        <option value="">
          No se pudieron cargar los dispositivos
        </option>
      `;

      mostrarMensajeEnergia(
        "Error al cargar los dispositivos.",
        "error"
      );

      return;
    }

    dispositivosEnergia = data || [];

    if (dispositivosEnergia.length === 0) {
      energyDeviceSelect.innerHTML = `
        <option value="">
          No hay dispositivos registrados
        </option>
      `;

      limpiarPanelEnergia();

      mostrarMensajeEnergia(
        "No hay dispositivos activos.",
        "error"
      );

      return;
    }

    energyDeviceSelect.innerHTML =
      dispositivosEnergia
        .map(
          (dispositivo) => `
            <option value="${dispositivo.id}">
              ${escaparHtml(
                dispositivo.nombre_cliente
              )} · ${escaparHtml(
                dispositivo.codigo
              )}
            </option>
          `
        )
        .join("");

    await cargarLecturasEnergia();
  };

/* ==============================
   EVENTOS DEL MONITOREO
============================== */

if (energyDeviceSelect) {
  energyDeviceSelect.addEventListener(
    "change",
    cargarLecturasEnergia
  );
}

if (energyPeriodSelect) {
  energyPeriodSelect.addEventListener(
    "change",
    cargarLecturasEnergia
  );
}

if (energyRefreshBtn) {
  energyRefreshBtn.addEventListener(
    "click",
    cargarDispositivosEnergia
  );
}
/* ==============================
   INICIO
============================== */
verificarSesion();