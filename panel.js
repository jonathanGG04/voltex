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
   INICIO
============================== */
verificarSesion();