/**
 * Este script se ejecuta cuando el DOM está completamente cargado.
 * Se encarga de:
 * 1. Cargar y mostrar la información del perfil del usuario.
 * 2. Obtener y mostrar las publicaciones asociadas, creando una galería
 * con transiciones suaves para las imágenes.
 * NOTA: Los estilos para la galería deben estar en un archivo CSS externo.
 */
(function () {
    // Espera a que todo el contenido del DOM esté cargado antes de ejecutar el código.
    document.addEventListener('DOMContentLoaded', () => {

        // --- 1. OBTENER DATOS DEL USUARIO ---
        let userData;
        try {
            const userDataElement = document.getElementById('user-data');
            if (!userDataElement) {
                throw new Error("El elemento 'user-data' no se encontró en el HTML.");
            }
            userData = JSON.parse(userDataElement.textContent);
        } catch (error) {
            console.error("Error al obtener o parsear los datos del usuario:", error);
            return;
        }

        // --- 2. POBLAR LA INFORMACIÓN DEL PERFIL ---
        populateProfile(userData);

        // --- 3. OBTENER Y MOSTRAR PUBLICACIONES ---
        if (userData && userData.username) {
            fetchAndDisplayPublications(userData.username);
        } else {
            console.warn("No se encontró el 'username' en los datos del usuario.");
            const container = document.querySelector(".publicaciones");
            if (container) {
                container.innerHTML = '<p>No se pueden cargar las publicaciones en este momento.</p>';
            }
        }
    });

    /**
     * Rellena la sección del perfil con los datos del usuario.
     * @param {object} data - El objeto con los datos del usuario.
     */
    function populateProfile(data) {
        const avatarElement = document.querySelector('.avatar');
        if (avatarElement) {
            avatarElement.innerHTML = data.url_picture
                ? `<img src="/static/uploads/${data.url_picture}" alt="Avatar de ${data.username}">`
                : '<i class="fa-solid fa-user"></i>';
        }

        const isEmpresa = data.empresa_nombre !== null && data.empresa_nombre !== '';
        const displayName = isEmpresa
            ? (data.empresa_nombre || 'Empresa Desconocida')
            : `${data.persona_nombre || 'Nombre'} ${data.persona_apellido || 'Apellido'}`.trim();
        
        const profileNameElement = document.querySelector('.profile-name');
        if(profileNameElement) profileNameElement.innerText = displayName;

        const detailsContainer = document.querySelector('.details');
        if (detailsContainer) {
            const descriptionElement = detailsContainer.querySelector('p:first-of-type');
            if(descriptionElement) descriptionElement.textContent = data.descripcion || 'No hay descripción disponible.';
            
            const phoneParagraph = Array.from(detailsContainer.querySelectorAll('p')).find(p => p.textContent.includes('Telefono:'));
            if(phoneParagraph) phoneParagraph.innerHTML = `<strong>Telefono:</strong> ${data.persona_telefono || 'No disponible'}`;
            
            const emailParagraph = Array.from(detailsContainer.querySelectorAll('p')).find(p => p.textContent.includes('Correo:'));
            if(emailParagraph) emailParagraph.innerHTML = `<strong>Correo:</strong> ${data.email || 'No disponible'}`;
        }
    }

    /**
     * Obtiene las publicaciones del usuario desde la API, agrupa las imágenes
     * y las muestra en tarjetas con galerías.
     * @param {string} username - El nombre de usuario para la consulta a la API.
     */
    function fetchAndDisplayPublications(username) {
        fetch(`/api/publicaciones/pubs_username/${username}`)
            .then(response => {
                if (!response.ok) throw new Error(`Error en la red: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
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
                const pubs = Array.from(publicationsMap.values());

                // Renderizar las tarjetas
                const container = document.querySelector(".publicaciones");
                if (!container) return;
                container.innerHTML = '';

                if (pubs.length === 0) {
                    container.innerHTML = '<p>Este usuario aún no tiene publicaciones.</p>';
                    return;
                }

                pubs.forEach(pub => {
                    const card = document.createElement("div");
                    card.className = "card";
                    const imageGalleryHTML = createImageGallery(pub.archivos, pub.titulo);
                    
                    card.innerHTML = `
                        <div class="card-header">
                            <div class="provider-block">
                                <div class="provider-info">
                                    <h3 class="job-title">${pub.titulo || 'Sin Título'}</h3>
                                </div>
                            </div>
                            <div class="header-actions">
                                <div class="tag"><i class="fa-solid fa-tag"></i> ${pub.categoria || 'General'}</div>
                            </div>
                        </div>
                        <div class="card-content-row">
                            <div class="job-image">
                                ${imageGalleryHTML}
                            </div>
                            <div class="job-text-content">
                                <div class="job-description">
                                    <p>${pub.descripcion || 'Sin descripción disponible.'}</p>
                                </div>
                                <div class="actions-container">
                                    <div class="price-tag">Precio: <span>$${pub.precio !== null ? pub.precio : 'A consultar'}</span></div>
                                </div>
                            </div>
                        </div>
                    `;
                    container.appendChild(card);

                    // Activar la lógica de la galería si es necesario
                    if (pub.archivos.length > 1) {
                        setupGallery(card);
                    }
                });
            })
            .catch(error => {
                console.error("Error al cargar las publicaciones:", error);
                const container = document.querySelector(".publicaciones");
                if (container) {
                    container.innerHTML = '<p>Ocurrió un error al cargar las publicaciones. Inténtalo más tarde.</p>';
                }
            });
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

})();
