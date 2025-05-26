// public/static/js/publicaciones.js

(function () {
    const API_BASE_URL = '/api/publicaciones';
    const CONTAINER_SELECTOR = '.publicaciones';
    const DAR_BAJA_ENDPOINT = '/api/publicaciones/dar_baja_publicacion/';
    const CREAR_CONTRATO_URL_BASE = '/crear-contrato';
    
    async function fetchPublicaciones() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`Error HTTP! Estado: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error al cargar publicaciones:", error);
            alert("No se pudieron cargar las publicaciones en este momento.");
            return [];
        }
    }

    function createPublicacionCard(pub) {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.publicacionId = pub.id; // ID de la publicación en la tarjeta (invisible)
        card.innerHTML = `
            <div class="card-header">
                <h3 class="job-title">${pub.titulo}</h3>
                <div class="tag"><i class="fa-solid fa-tag"></i>${pub.categoria}</div>
                <button class="delete-btn" aria-label="Dar de baja publicación" data-id="${pub.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="price">Precio: $${pub.precio}</div>
            <p>${pub.descripcion}</p>
            <div class="nuevo-contrato-container">
                <a href="${CREAR_CONTRATO_URL_BASE}" class="nuevo-contrato-btn"
                   data-precio="${pub.precio}"
                   data-categoria-nombre="${pub.categoria}" 
                   data-publicacion-id="${pub.id}"
                   data-categoria-id="${pub.categoria_id}"
                   data-titulo-publicacion="${pub.titulo}"> Nuevo contrato
                </a>
            </div>
        `;
        return card;
    }

    async function handleDeletePublicacion(pubId, cardElement) {
        if (!confirm("¿Estás seguro de que deseas dar de baja esta publicación?")) {
            return;
        }

        try {
            const response = await fetch(`${DAR_BAJA_ENDPOINT}${pubId}`, {
                method: "PUT",
            });

            if (response.ok) {
                cardElement.remove();
                alert("Publicación dada de baja con éxito.");
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                alert(`Error al dar de baja la publicación: ${errorData.message || 'Por favor, inténtalo de nuevo.'}`);
            }
        } catch (error) {
            console.error("Error al dar de baja la publicación:", error);
            alert("Ocurrió un error de red o del servidor al intentar dar de baja la publicación.");
        }
    }

    async function handleNuevoContrato(e) {
        e.preventDefault();

        const precioRaw = this.dataset.precio;
        const categoriaNombre = this.dataset.categoriaNombre;
        const publicacionId = this.dataset.publicacionId; // Ya lo tienes
        const categoriaId = this.dataset.categoriaId; 
        const tituloPublicacion = this.dataset.tituloPublicacion; // ¡NUEVO: OBTENEMOS EL TÍTULO!

        const precio = precioRaw.match(/\d+/g)?.join("") || "";

        // Se pasan todos los parámetros necesarios a la URL
        const url = `${CREAR_CONTRATO_URL_BASE}?precio=${precio}&categoria_id=${categoriaId}&publicacion_id=${publicacionId}&categoria_nombre=${encodeURIComponent(categoriaNombre)}&titulo_publicacion=${encodeURIComponent(tituloPublicacion)}`;
        window.location.href = url;
    }

    async function initPublicaciones() {
        const container = document.querySelector(CONTAINER_SELECTOR);
        if (!container) {
            console.warn(`El contenedor con selector "${CONTAINER_SELECTOR}" no fue encontrado en el DOM.`);
            return;
        }

        container.innerHTML = '';

        const publicaciones = await fetchPublicaciones();

        if (publicaciones.length === 0) {
            container.innerHTML = '<p>No tienes publicaciones aún.</p>';
            return;
        }

        publicaciones.forEach(pub => {
            const card = createPublicacionCard(pub);

            const deleteBtn = card.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", () => handleDeletePublicacion(deleteBtn.dataset.id, card));

            const contratoBtn = card.querySelector(".nuevo-contrato-btn");
            contratoBtn.addEventListener("click", handleNuevoContrato);

            container.appendChild(card);
        });
    }

    document.addEventListener('DOMContentLoaded', initPublicaciones);

})();