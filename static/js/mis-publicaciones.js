// public/static/js/publicaciones.js

(function () {
    // --- CONSTANTES ---
    const CONTAINER_SELECTOR = '.job-cards-list'; 
    
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
     * Crea el elemento HTML de la tarjeta para una publicación.
     * @param {object} pub - El objeto de la publicación.
     * @returns {HTMLElement} - El elemento de la tarjeta.
     */
    function createPublicacionCard(pub) {
        const card = document.createElement("div");
        card.className = "card";
        // CORREGIDO: Se establece el dataset usando 'publicacion_id'
        card.dataset.publicacionId = pub.publicacion_id;

        const imageGalleryHTML = createImageGallery(pub.archivos, pub.titulo);
        const fechaPublicacion = new Date(pub.fecha_creacion).toLocaleDateString();

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
                    </div>
                    <div class="fecha-post">Publicado el: <span>${fechaPublicacion}</span></div>
                </div>
            </div>
        `;
        return card;
    }

    /**
     * Inicializa el listado de publicaciones, determinando qué cargar basado en la URL.
     */
    async function init() {
        const container = document.querySelector(CONTAINER_SELECTOR);
        if (!container) {
            console.warn(`No se encontró el contenedor "${CONTAINER_SELECTOR}".`);
            return;
        }
        container.innerHTML = ''; 

        const pathParts = window.location.pathname.split("/").filter(Boolean);
        let fetchUrl;
        let searchTerm = '';
        let isSearchPage = false;

        if (pathParts[0] === "buscar" && pathParts[1]) {
            searchTerm = decodeURIComponent(pathParts[1]);
            fetchUrl = `/api/publicaciones/${searchTerm}`;
            isSearchPage = true;
        } else if (pathParts[0] === "categoria" && pathParts[1]) {
            searchTerm = decodeURIComponent(pathParts[1]);
            fetchUrl = `/api/publicaciones/categoria/${searchTerm}`;
            isSearchPage = true;
        } else {
            fetchUrl = '/api/publicaciones';
        }
        
        try {
            const response = await fetch(fetchUrl);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const data = await response.json();
            
            // CORREGIDO: Se agrupa usando 'publicacion_id'
            const publicationsData = data.reduce((acc, item) => {
                const id = item.publicacion_id; // Usa 'publicacion_id'
                if (!acc[id]) {
                    acc[id] = { ...item, archivos: [] };
                }
                if (item.archivo) {
                    acc[id].archivos.push(item.archivo);
                }
                return acc;
            }, {});
            
            const publicaciones = Object.values(publicationsData);

            if (publicaciones.length === 0) {
                container.innerHTML = isSearchPage
                    ? `<p>No se encontraron publicaciones para "${searchTerm}".</p>`
                    : '<p>No hay publicaciones disponibles en este momento.</p>';
                return;
            }

            publicaciones.forEach(pub => {
                const card = createPublicacionCard(pub);
                
                if (pub.archivos && pub.archivos.length > 1) {
                    setupGallery(card);
                }

                container.appendChild(card);
            });

        } catch (error) {
            console.error("Error al inicializar las publicaciones:", error);
            container.innerHTML = '<p>Ocurrió un error al cargar las publicaciones. Por favor, intenta de nuevo más tarde.</p>';
        }
    }

    document.addEventListener('DOMContentLoaded', init);

})();
