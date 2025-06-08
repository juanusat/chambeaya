// public/static/js/publicaciones.js

(function () {
    // --- CONSTANTES ---
    const API_BASE_URL = '/api/publicaciones';
    const CONTAINER_SELECTOR = '.job-cards-list'; 
    const DAR_BAJA_ENDPOINT = '/api/publicaciones/dar_baja_publicacion/';
    const CREAR_CONTRATO_URL_BASE = '/crear-contrato';
    
    /**
     * Busca todas las publicaciones en la API.
     * @returns {Promise<Array>} Una promesa que resuelve a un array de publicaciones.
     */
    async function fetchPublicaciones() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`Error HTTP! Estado: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error al cargar publicaciones:", error);
            // Idealmente, usar un modal en lugar de alert.
            alert("No se pudieron cargar las publicaciones en este momento.");
            return [];
        }
    }

    /**
     * Crea el elemento HTML de la tarjeta para una publicación, incluyendo la galería.
     * @param {object} pub - El objeto de la publicación con sus datos y un array de archivos.
     * @returns {HTMLElement} El elemento de la tarjeta.
     */
    function createPublicacionCard(pub) {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.publicacionId = pub.id;

        // Generar la galería de imágenes para la tarjeta.
        const imageGalleryHTML = createImageGallery(pub.archivos, pub.titulo);

        card.innerHTML = `
            <div class="card-header">
                <div class="provider-block">
                    <div class="provider-circle"></div>
                    <div class="provider-info">
                        <h3 class="job-title">${pub.titulo}</h3>
                        <span class="provider-name">${pub.nombre_usuario || 'Usuario'}</span>
                    </div>
                </div>
                <div class="header-actions">
                    <div class="tag"><i class="fa-solid fa-tag"></i> ${pub.categoria}</div>
                    <button class="delete-btn" aria-label="Dar de baja publicación" data-id="${pub.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>

            <div class="card-content-row">
                <div class="job-image">
                    ${imageGalleryHTML}
                </div>
                <div class="job-text-content">
                    <div class="job-description">
                        <p>${pub.descripcion}</p>
                    </div>
                    <div class="actions-container">
                        <div class="price-tag">Precio: <span>$${pub.precio}</span></div>
                        <a href="${CREAR_CONTRATO_URL_BASE}" class="nuevo-contrato-btn"
                           data-precio="${pub.precio}"
                           data-categoria-nombre="${pub.categoria}" 
                           data-publicacion-id="${pub.id}"
                           data-categoria-id="${pub.categoria_id}"
                           data-titulo-publicacion="${pub.titulo}">
                           <i class="fa-solid fa-file-signature"></i> Nuevo contrato
                        </a>
                    </div>
                </div>
            </div>
        `;
        return card;
    }

    /**
     * Maneja la lógica para dar de baja una publicación.
     * @param {string} pubId - El ID de la publicación a eliminar.
     * @param {HTMLElement} cardElement - El elemento de la tarjeta a remover del DOM.
     */
    async function handleDeletePublicacion(pubId, cardElement) {
        if (!confirm("¿Estás seguro de que deseas dar de baja esta publicación?")) {
            return;
        }

        try {
            const response = await fetch(`${DAR_BAJA_ENDPOINT}${pubId}`, {
                method: "PUT",
            });

            if (response.ok) {
                cardElement.style.transition = 'opacity 0.5s ease';
                cardElement.style.opacity = '0';
                setTimeout(() => cardElement.remove(), 500);
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
                alert(`Error al dar de baja la publicación: ${errorData.message || 'Por favor, inténtalo de nuevo.'}`);
            }
        } catch (error) {
            console.error("Error al dar de baja la publicación:", error);
            alert("Ocurrió un error de red o del servidor al intentar dar de baja la publicación.");
        }
    }

    /**
     * Redirige a la página de crear contrato con los datos necesarios.
     * @param {Event} e - El evento de click.
     */
    function handleNuevoContrato(e) {
        e.preventDefault();
        const { precio, categoriaNombre, publicacionId, categoriaId, tituloPublicacion } = this.dataset;
        const url = `${CREAR_CONTRATO_URL_BASE}?precio=${precio}&categoria_id=${categoriaId}&publicacion_id=${publicacionId}&categoria_nombre=${encodeURIComponent(categoriaNombre)}&titulo_publicacion=${encodeURIComponent(tituloPublicacion)}`;
        window.location.href = url;
    }

    /**
     * Genera el HTML para una galería de imágenes o una sola imagen.
     * @param {string[]} archivos - Array con los nombres de archivo de imagen.
     * @param {string} altText - Texto alternativo para las imágenes.
     * @returns {string} - El HTML de la galería.
     */
    function createImageGallery(archivos, altText) {
        const containerStart = '<div class="gallery-container">';
        const containerEnd = '</div>';

        if (!archivos || archivos.length === 0) {
            return `${containerStart}<img src="https://placehold.co/400x300/e2e8f0/64748b?text=Servicio" alt="Imagen de ${altText || 'servicio'}" class="gallery-image active">${containerEnd}`;
        }
        if (archivos.length === 1) {
            return `${containerStart}<img src="/static/uploads/${archivos[0]}" alt="Imagen de ${altText || 'servicio'}" class="gallery-image active">${containerEnd}`;
        }
        
        const imagesHTML = archivos.map((archivo, index) => 
            `<img src="/static/uploads/${archivo}" alt="Imagen ${index + 1} de ${altText || 'servicio'}" class="gallery-image ${index === 0 ? 'active' : ''}">`
        ).join('');

        const controlsHTML = `
            <button class="gallery-control prev" aria-label="Imagen anterior">&lt;</button>
            <button class="gallery-control next" aria-label="Imagen siguiente">&gt;</button>
            <div class="gallery-counter">1 / ${archivos.length}</div>
        `;

        return `${containerStart}${imagesHTML}${controlsHTML}${containerEnd}`;
    }

    /**
     * Añade los event listeners para que los controles de la galería funcionen.
     * @param {HTMLElement} cardElement - El elemento de la tarjeta que contiene la galería.
     */
    function setupGallery(cardElement) {
        const prevButton = cardElement.querySelector('.gallery-control.prev');
        const nextButton = cardElement.querySelector('.gallery-control.next');
        const images = cardElement.querySelectorAll('.gallery-image');
        const counter = cardElement.querySelector('.gallery-counter');
        let currentIndex = 0;

        function updateGallery() {
            images.forEach((img, index) => {
                img.classList.toggle('active', index === currentIndex);
            });
            if (counter) {
                counter.textContent = `${currentIndex + 1} / ${images.length}`;
            }
        }

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
            updateGallery();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
            updateGallery();
        });
    }

    /**
     * Inicializa el listado de publicaciones.
     */
    async function initPublicaciones() {
        const container = document.querySelector(CONTAINER_SELECTOR);
        if (!container) {
            console.warn(`El contenedor con selector "${CONTAINER_SELECTOR}" no fue encontrado en el DOM.`);
            return;
        }

        container.innerHTML = ''; 

        const data = await fetchPublicaciones();
        
        // Agrupar resultados por ID de publicación
        const publicationsMap = new Map();
        data.forEach(item => {
            if (!publicationsMap.has(item.id)) {
                publicationsMap.set(item.id, { ...item, archivos: [] });
            }
            if (item.archivo) {
                publicationsMap.get(item.id).archivos.push(item.archivo);
            }
        });
        const publicaciones = Array.from(publicationsMap.values());

        if (publicaciones.length === 0) {
            container.innerHTML = '<p>No hay publicaciones disponibles en este momento.</p>';
            return;
        }

        publicaciones.forEach(pub => {
            const card = createPublicacionCard(pub);

            // Asignar listeners a los botones
            const deleteBtn = card.querySelector(".delete-btn");
            if (deleteBtn) {
                deleteBtn.addEventListener("click", () => handleDeletePublicacion(deleteBtn.dataset.id, card));
            }

            const contratoBtn = card.querySelector(".nuevo-contrato-btn");
            if(contratoBtn) {
                contratoBtn.addEventListener("click", handleNuevoContrato);
            }
            
            // Activar la galería si es necesario
            if (pub.archivos.length > 1) {
                setupGallery(card);
            }

            container.appendChild(card);
        });
    }

    // Iniciar la carga de publicaciones cuando el DOM esté listo.
    document.addEventListener('DOMContentLoaded', initPublicaciones);

})();
