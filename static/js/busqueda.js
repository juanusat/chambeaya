(function () {
    // Separa la ruta y elimina segmentos vacíos
    const pathParts = window.location.pathname.split("/").filter(Boolean);

    let fetchUrl;

    // Ruta "/buscar/termino_busqueda"
    if (pathParts[0] === "buscar" && pathParts[1]) {
        const termino = pathParts[1];
        fetchUrl = `/api/publicaciones/${termino}`;

    // Ruta "/categoria/termino_busqueda"
    } else if (pathParts[0] === "categoria" && pathParts[1]) {
        const termino = pathParts[1];
        fetchUrl = `/api/publicaciones/categoria/${termino}`;

    // Si no coincide con ninguno, salimos
    } else {
        return;
    }

    // Realiza la petición al endpoint correspondiente
    fetch(fetchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos:", data);

            const container = document.querySelector(".job-cards-list");
            if (!container) {
                console.error("Contenedor .job-cards-list no encontrado en el DOM.");
                return;
            }

            // Limpia el contenedor antes de agregar nuevas publicaciones
            container.innerHTML = "";

            // Si no hay resultados
            if (data.length === 0) {
                container.innerHTML = `<p>No se encontraron publicaciones para "${pathParts[1]}".</p>`;
                return;
            }

            // Renderiza cada publicación
            data.forEach(pub => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <div class="card-header">
                        <h3 class="job-title">${pub.titulo}</h3>
                        <div class="tag"><i class="fa-solid fa-tag"></i>${pub.categoria}</div>
                    </div>

                    <div class="card-details-row">
                        <div class="provider-info">
                            <span class="provider-name">${pub.nombre_usuario}</span>
                            <div class="provider-circle"></div>
                        </div>
                        <div class="price-tag">Precio: <span>${pub.precio || "No disponible"}</span></div>
                        <div class="fecha-post">Publicado el: <span>${new Date(pub.fecha_creacion).toLocaleDateString()}</span></div>
                    </div>

                    <div class="job-description">
                        <p>${pub.descripcion || "Sin descripción disponible."}</p>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error al cargar publicaciones:", error);
            const container = document.querySelector(".job-cards-list");
            if (container) {
                container.innerHTML = `<p>Ocurrió un error al cargar las publicaciones. Por favor, intenta nuevamente más tarde.</p>`;
            }
        });
})();
