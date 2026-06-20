// URL oficial de tu backend en Render
const API_URL = "https://nicoweb.onrender.com/api/proyectos/";

// Inicializar animaciones de scroll usando IntersectionObserver
const configurarAnimaciones = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Un pequeño delay escalonado para mejorar el efecto visual
          setTimeout(() => entry.target.classList.add("in"), i * 80);
          observer.unobserve(entry.target); // Deja de observar una vez que se muestra
        }
      });
    },
    { threshold: 0.05 },
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
};

// Traer proyectos del Backend de Django e inyectarlos dinámicamente
async function obtenerProyectos() {
  const contenedor = document.getElementById("contenedor-proyectos");
  if (!contenedor) return;

  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error(`Error de red: ${respuesta.status}`);
    }

    const proyectos = await respuesta.json();

    // Limpiar el mensaje de carga o elementos estáticos previos
    contenedor.innerHTML = "";

    // Si no hay proyectos guardados en el admin de Django
    if (proyectos.length === 0) {
      contenedor.innerHTML = `<p style="color: var(--dim); grid-column: 1/-1; text-align: center;">No hay proyectos disponibles por el momento.</p>`;
      return;
    }

    // Variar las clases de color de fondo de las miniaturas (.proj-thumb) dinámicamente
    const clasesColor = ["pt1", "pt2", "pt3"];
    const thumbs = ["🛒", "📊", "💬", "🚀", "🛡️", "📱"];

    proyectos.forEach((proyecto, indice) => {
      const claseElegida = clasesColor[indice % clasesColor.length];
      const iconoElegido = thumbs[indice % thumbs.length];

      // Separar el string de tecnologías por comas si viene como "React, Django"
      const tagsHTML = proyecto.tecnologias
        ? proyecto.tecnologias
            .split(",")
            .map((tech) => `<span class="p-tag">${tech.trim()}</span>`)
            .join("")
        : '<span class="p-tag">Django</span>';

      // Creamos la tarjeta manteniendo la estructura idéntica del HTML/CSS de glasmorfismo
      const tarjeta = document.createElement("div");
      tarjeta.className = "proj-card glass reveal";

      tarjeta.innerHTML = `
        <div class="proj-thumb ${claseElegida}">${iconoElegido}</div>
        <div class="proj-body">
          <div class="proj-cat">${proyecto.categoria || "Proyecto Django"}</div>
          <h3 class="proj-name">${proyecto.titulo}</h3>
          <p class="proj-desc">${proyecto.descripcion}</p>
        </div>
        <div class="proj-foot">
          <div class="proj-stack">
            ${tagsHTML}
          </div>
          <a href="${proyecto.link_github || "#"}" target="_blank" rel="noopener noreferrer" class="proj-link">Ver Código →</a>
        </div>
      `;

      contenedor.appendChild(tarjeta);
    });

    // Activar las animaciones en las tarjetas recién creadas e inyectadas
    configurarAnimaciones();
  } catch (error) {
    console.error("Error al conectar con la API:", error);
    contenedor.innerHTML = `
      <p style="color: #FF5F57; grid-column: 1/-1; text-align: center; font-size: 0.95rem; line-height: 1.6;">
        Error al cargar los proyectos. El backend en Render puede estar despertando (gira en modo "sleep" por inactividad).<br>
        <span style="font-size: 0.8rem; color: var(--dim)">Por favor, recargá la página en unos segundos.</span>
      </p>
    `;
  }
}

// Formulario de contacto
function handleSubmit(e) {
  e.preventDefault();
  const btn =
    e.target.querySelector("button[type=submit]") ||
    document.getElementById("send-btn");
  if (!btn) return;

  const textoOriginal = btn.textContent;
  btn.textContent = "✓ Mensaje enviado";
  btn.style.background = "linear-gradient(135deg, #2A8C5A, #1a6c44)";
  btn.style.borderColor = "#2A8C5A";
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = textoOriginal;
    btn.style.background = "";
    btn.style.borderColor = "";
    btn.disabled = false;
    e.target.reset();
  }, 3500);
}

// Arrancar al cargar la página por completo
document.addEventListener("DOMContentLoaded", () => {
  obtenerProyectos();
  configurarAnimaciones(); // Ejecuta una primera pasada para el contenido estático de la página
});
