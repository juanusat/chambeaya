// /static/js/ver_perfiles.js

(function() {
    const API_PERFILES_URL = '/api/usuarios/';
    const CONTAINER_SELECTOR = '.job-cards-list';
    const SEARCH_INPUT_ID = 'iptBuscar';
    const SEARCH_FORM_ID = 'searchForm';
    const BASE_PROFILE_URL = '/@'; 

    let allUsers = [];

    function createUserCard(user) {
        const card = document.createElement("div");
        card.className = "user-card";
        card.dataset.userId = user.usuario_id; // Mantenemos el ID de usuario en el dataset de la tarjeta

        const finalImageUrl = user.url_picture 
            ? `/static/uploads/${user.url_picture}` 
            : '/static/uploads/default-user.png'; 
        
        card.innerHTML = `
            <div class="user-card-header">
                <img src="${finalImageUrl}" alt="${user.username || 'Usuario Desconocido'}" class="user-profile-picture">
                <h3 class="user-username">${user.username || 'Usuario Desconocido'}</h3>
            </div>
            <div class="user-card-body">
                <p class="user-description">${user.descripcion || 'Sin descripción disponible'}</p>
                <p class="user-email">Email: ${user.email || 'No disponible'}</p>
            </div>
            <div class="user-card-footer">
                <button class="view-profile-button" data-user-id="${user.usuario_id}">Ver Perfil</button>
            </div>
        `;
        return card;
    }

    async function fetchUserProfiles() {
        try {
            const response = await fetch(API_PERFILES_URL);

            if (response.redirected) {
                window.location.href = response.url;
                throw new Error('Redirección por falta de autenticación.'); 
            }

            if (!response.ok) {
                throw new Error(`Error HTTP! Estado: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error al cargar perfiles:", error);
            const container = document.querySelector(CONTAINER_SELECTOR);
            if (container) {
                container.innerHTML = '<p>Hubo un error al cargar los perfiles. Intenta de nuevo más tarde.</p>';
            }
            return [];
        }
    }

    function handleViewProfile(e) {
        if (e.target.classList.contains('view-profile-button')) {
            // Encuentra el elemento padre de la tarjeta (.user-card)
            const userCard = e.target.closest('.user-card');
            if (userCard) {
                // Busca el h3 con la clase .user-username dentro de la tarjeta
                const usernameElement = userCard.querySelector('.user-username');
                if (usernameElement) {
                    const username = usernameElement.textContent.trim(); // Extrae el texto y elimina espacios
                    // Ahora redirigimos usando el username extraído
                    window.location.href = `${BASE_PROFILE_URL}${encodeURIComponent(username)}`; 
                } else {
                    console.warn('No se encontró el elemento de username dentro de la tarjeta.');
                }
            } else {
                console.warn('No se encontró la tarjeta de usuario padre.');
            }
        }
    }

    function filterAndDisplayUsers(searchTerm) {
        const container = document.querySelector(CONTAINER_SELECTOR);
        if (!container) return;

        container.innerHTML = ''; 

        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredUsers = allUsers.filter(user => 
            user.username && user.username.toLowerCase().includes(lowerCaseSearchTerm)
        );

        if (filteredUsers.length === 0) {
            container.innerHTML = `<p>No se encontraron usuarios que coincidan con "${searchTerm}".</p>`;
            return;
        }

        filteredUsers.forEach(user => {
            const card = createUserCard(user);
            container.appendChild(card);
        });
    }

    async function initUserProfiles() {
        const container = document.querySelector(CONTAINER_SELECTOR);
        const searchInput = document.getElementById(SEARCH_INPUT_ID);
        const searchForm = document.getElementById(SEARCH_FORM_ID);

        if (!container || !searchInput || !searchForm) {
            console.warn(`Uno o más elementos (contenedor: "${CONTAINER_SELECTOR}", input de búsqueda: "${SEARCH_INPUT_ID}", formulario: "${SEARCH_FORM_ID}") no fueron encontrados.`);
            return;
        }

        container.innerHTML = ''; 

        const profiles = await fetchUserProfiles();
        allUsers = profiles;

        filterAndDisplayUsers(''); 

        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const searchTerm = searchInput.value.trim();
            filterAndDisplayUsers(searchTerm);
        });

        container.addEventListener('click', handleViewProfile);
    }

    document.addEventListener('DOMContentLoaded', initUserProfiles);

})();