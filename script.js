const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");

  if (nav.classList.contains("active")) {
    menuToggle.textContent = "×";
    menuToggle.setAttribute("aria-label", "Cerrar menú");
  } else {
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Abrir menú");
  }
});

/* Cerrar el menú cuando se presiona una opción */
const navLinks = document.querySelectorAll(".nav a");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Abrir menú");
  });
});

/* Formulario de cotización por WhatsApp */
const quoteForm = document.getElementById("quote-form");

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

  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
});

console.log("Sitio web de Voltex Innovations PA cargado correctamente.");