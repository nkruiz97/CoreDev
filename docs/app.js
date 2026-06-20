// Dirección de nuestra API de Django
const API_URL = "https://nicoweb.onrender.com/api/proyectos/";

async function cargarProyectos() {
  const contenedor = document.getElementById("contenedor-proyectos");

  try {
    // Hacemos la petición a Django
    const respuesta = await fetch(API_URL);
    const proyectos = await respuesta.json();

    // Limpiamos el mensaje de "Cargando..."
    contenedor.innerHTML = "";

    // Recorremos cada proyecto y creamos su HTML
    proyectos.forEach((proyecto) => {
      const tarjeta = document.createElement("div");
      tarjeta.classList.add("tarjeta-proyecto");

      tarjeta.innerHTML = `
                <h3>${proyecto.titulo}</h3>
                <span class="tecnologias">${proyecto.tecnologias}</span>
                <p>${proyecto.descripcion}</p>
                ${proyecto.link_github ? `<a href="${proyecto.link_github}" target="_blank" class="btn-github">Ver en GitHub</a>` : ""}
            `;

      contenedor.appendChild(tarjeta);
    });
  } catch (error) {
    console.error("Error al conectar con Django:", error);
    contenedor.innerHTML =
      '<p style="color: red;">Error al cargar los proyectos. ¿Está corriendo Django?</p>';
  }
}

// Ejecutamos la función cuando cargue la página
document.addEventListener("DOMContentLoaded", cargarProyectos);
