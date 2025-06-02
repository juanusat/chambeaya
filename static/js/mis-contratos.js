document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 [Mis Contratos] Script mis_contratos.js cargado.');
    let allContracts = []; // Almacenará todos los contratos sin filtrar
    let currentUserUsername = ''; // Almacenará el username del usuario logueado

    // Referencias a elementos del DOM
    const contratosContainer = document.getElementById('contratos-container');
    const filterTypeSelect = document.getElementById('filter-type');

    // Comprobación inicial de existencia de los contenedores
    if (!contratosContainer) {
        console.error('❌ ERROR: No se encontró el elemento con ID "contratos-container". Los contratos no se podrán renderizar.');
        return;
    }
    if (!filterTypeSelect) {
        console.warn('⚠️ ADVERTENCIA: No se encontró el elemento con ID "filter-type". El filtro de contratos no funcionará.');
    }

    // --- Funciones Auxiliares ---

    // Formatea el precio a un formato legible
    function formatPrice(price) {
        if (price === null || typeof price === 'undefined') {
            return 'N/A';
        }
        return parseFloat(price).toFixed(2).replace(/\.00$/, '');
    }

    /**
     * Construye la URL completa de la imagen de perfil a partir del nombre del archivo.
     * Retorna una imagen por defecto si el valor no es válido.
     * @param {string} dbValue El nombre del archivo de imagen tal como viene de la base de datos (ej. "mi_foto.jpg").
     * @returns {string} La URL completa de la imagen.
     */
    function getProfileImageUrl(dbValue) {
        // Asegura que dbValue sea una cadena y recorta espacios en blanco.
        // Si no es una cadena (ej. null, undefined), lo convierte en una cadena vacía.
        const cleanedValue = typeof dbValue === 'string' ? dbValue.trim() : '';

        if (cleanedValue) { // Si la cadena limpia no está vacía, se usa como nombre de archivo
            // console.log(`   [DEBUG IMAGEN] DB tiene nombre de archivo: ${cleanedValue}. Construyendo ruta.`); // Descomentar para depuración intensa
            return `/static/uploads/${cleanedValue}`;
        } else {
            // console.log('   [DEBUG IMAGEN] No hay imagen válida en DB. Usando imagen por defecto.'); // Descomentar para depuración intensa
            return '/static/uploads/default-pic-profile.jpg';
        }
    }

    // Renderiza los contratos en el DOM
    function renderContracts(contractsToRender) {
        contratosContainer.innerHTML = ''; // Limpia el contenedor

        if (contractsToRender.length === 0) {
            contratosContainer.innerHTML = '<p class="no-contracts-message">No tienes contratos disponibles que coincidan con este filtro.</p>';
            console.log('ℹ️ [Render] No hay contratos para renderizar con el filtro actual.');
            return;
        }

        console.log(`🔄 [Render] Renderizando ${contractsToRender.length} contrato(s).`);

        contractsToRender.forEach(contrato => {
            const card = document.createElement('div');
            card.classList.add('contract-card');
            if (contrato.estado) {
                card.classList.add(`tag-${contrato.estado.toLowerCase().replace(/\s/g, '-')}`);
            }
            card.dataset.contratoId = contrato.contrato_id;

            const fechaInicio = new Date(contrato.fecha_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const fechaFin = new Date(contrato.fecha_finalizacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const formattedPrice = formatPrice(contrato.precio);

            const esPrestador = currentUserUsername && (contrato.username_empleado && contrato.username_empleado.toLowerCase().trim() === currentUserUsername.toLowerCase().trim());
            const esCliente = currentUserUsername && (contrato.username_cliente && contrato.username_cliente.toLowerCase().trim() === currentUserUsername.toLowerCase().trim());

            let profileImageUrlToDisplay;
            let profileImageAltText = '';
            let profileImageOwnerName = '';

            if (esPrestador) {
                profileImageUrlToDisplay = getProfileImageUrl(contrato.imagenC); // Usa imagenC (del cliente)
                profileImageAltText = `Perfil de ${contrato.cliente || 'cliente'}`;
                profileImageOwnerName = contrato.cliente || 'Cliente Desconocido';
            } else if (esCliente) {
                profileImageUrlToDisplay = getProfileImageUrl(contrato.imagenP); // Usa imagenP (del prestador)
                profileImageAltText = `Perfil de ${contrato.empleador || 'prestador'}`;
                profileImageOwnerName = contrato.empleador || 'Prestador Desconocido';
            } else {
                profileImageUrlToDisplay = getProfileImageUrl(contrato.imagenP); // Por defecto, usa imagenP
                profileImageAltText = `Perfil de ${contrato.empleador || 'prestador'}`;
                profileImageOwnerName = contrato.empleador || 'Prestador Desconocido';
            }

            const comentarioHtmlBlock = `
                <div class="review-container-card" data-contrato-id="${contrato.contrato_id}">
                    <button class="ver-comentario-btn">
                        Comentario
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="comentario-contenido" style="display: none;">
                        <div class="comentario-existente">
                            <p><strong>Autor:</strong> <span class="comentario-autor">Autor Desconocido</span></p>
                            <p><strong>Fecha:</strong> <span class="comentario-fecha">Fecha Desconocida</span></p>
                            <p><strong>Comentario:</strong> <span class="comentario-texto">No hay comentario aún.</span></p>
                            <p><strong>Calificación:</strong> <span class="calificacion-estrellas-display">
                                    <span class="estrella-display">&#9734;</span>
                                    <span class="estrella-display">&#9734;</span>
                                    <span class="estrella-display">&#9734;</span>
                                    <span class="estrella-display">&#9734;</span>
                                    <span class="estrella-display">&#9734;</span>
                            </span></p>
                            <button class="editar-comentario-btn" style="display: none;">Editar Comentario</button>
                            <button class="eliminar-comentario-btn delete" style="display: none;">Eliminar Comentario</button>
                        </div>

                        <form class="form-comentario" style="display: none;">
                            <textarea placeholder="Escribe tu comentario aquí..." required></textarea>

                            <div class="calificacion-estrellas" data-calificacion="0">
                                    <span class="estrella" data-value="1">&#9733;</span>
                                    <span class="estrella" data-value="2">&#9733;</span>
                                    <span class="estrella" data-value="3">&#9733;</span>
                                    <span class="estrella" data-value="4">&#9733;</span>
                                    <span class="estrella" data-value="5">&#9733;</span>
                            </div>
                            <input type="hidden" name="calificacion" value="0" required />

                            <button type="submit">Guardar Comentario</button>
                            <button type="button" class="cancelar-edicion-btn">Cancelar</button>
                        </form>
                    </div>
                </div>
            `;


            card.innerHTML = `
                <div class="card-header">
                    <div class="title-dates-row">
                        <span class="nombre">${contrato.servicio || 'Servicio Desconocido'}</span>
                        <div class="dates">
                            <span class="date-label">Inicio:</span>
                            <span class="date-value">${fechaInicio}</span>
                            <span class="date-label">Fin:</span>
                            <span class="date-value">${fechaFin}</span>
                        </div>
                    </div>
                    <div class="tag">
                        ${contrato.estado || 'Desconocido'}
                    </div>
                </div>

                <div class="info">
                    <p>${contrato.descripcion_servicio || 'No hay descripción disponible.'}</p>
                </div>

                <div class="price-actions">
                    <div class="price-tag">Precio: <span>$${formattedPrice}</span></div>
                    ${esCliente && contrato.precio && ['en progreso', 'finalizado'].includes(contrato.estado.toLowerCase()) ? 
                      `<button class="pagar-btn" data-contrato-id="${contrato.contrato_id}">Pagar</button>` : ''}
                </div>

                <div class="client-price-row">
                    <div class="client-info">
                        <p>Cliente: <span class="client-name">${contrato.cliente || 'Desconocido'}</span></p>
                        <p>Prestador: <span class="client-name">${contrato.empleador || 'Desconocido'}</span></p>
                        <div class="other-user-display">
                            <img src="${profileImageUrlToDisplay}" alt="${profileImageAltText}" class="perfil-img">
                            <span class="other-user-name">${profileImageOwnerName}</span>
                        </div>
                    </div>
                </div>
                <div class="card-actions-buttons">
                    ${esPrestador && contrato.estado && contrato.estado.toLowerCase() === 'en espera' ? `
                        <button class="action-btn begin-btn" data-contrato-id="${contrato.contrato_id}">Comenzar</button>
                        <button class="action-btn reject-btn" data-contrato-id="${contrato.contrato_id}">Rechazar</button>
                    ` : ''}
                </div>`;
            card.innerHTML+=comentarioHtmlBlock;
            contratosContainer.appendChild(card);
        });
        attachEventListeners(); // Adjunta listeners a los botones recién creados
        if (typeof window.configurarBotonesComentarios === 'function') {
        window.configurarBotonesComentarios();
    }
    }

    // Adjunta listeners a los botones de acción de los cards
    function attachEventListeners() {
        if (contratosContainer) {
            contratosContainer.querySelectorAll('.begin-btn').forEach(button => {
                button.removeEventListener('click', handleBeginClick);
                button.addEventListener('click', handleBeginClick);
            });

            contratosContainer.querySelectorAll('.reject-btn').forEach(button => {
                button.removeEventListener('click', handleRejectClick);
                button.addEventListener('click', handleRejectClick);
            });

            contratosContainer.querySelectorAll('.pagar-btn').forEach(button => {
                button.removeEventListener('click', handlePagarClick);
                button.addEventListener('click', handlePagarClick);
            });
        }
    }

    // Manejadores de eventos para los botones
    function handleBeginClick() {
        const contratoId = this.dataset.contratoId;
        console.log(`[Acción] Clic en Comenzar para contrato ${contratoId}`);
        handleContractAction(contratoId, 'en progreso');
    }

    function handleRejectClick() {
        const contratoId = this.dataset.contratoId;
        console.log(`[Acción] Clic en Rechazar para contrato ${contratoId}`);
        handleContractAction(contratoId, 'rechazado');
    }

    function handlePagarClick() {
        const contratoId = this.dataset.contratoId;
        console.log(`[Acción] Clic en Pagar para contrato ${contratoId}`);
        alert(`Simulando redirección para pagar contrato ${contratoId}.`);
        // Aquí iría la lógica para redirigir a una pasarela de pago
    }

    // Aplica el filtro seleccionado y vuelve a renderizar
    function applyFilter() {
        const filterType = filterTypeSelect ? filterTypeSelect.value : 'todos';
        let filteredContracts = [];

        if (!currentUserUsername) {
            console.warn('⚠️ [Filtro] currentUserUsername no está disponible. No se filtrará por rol.');
            filteredContracts = allContracts;
            renderContracts(filteredContracts);
            return;
        }

        if (filterType === 'todos') {
            filteredContracts = allContracts;
        } else if (filterType === 'cliente') {
            filteredContracts = allContracts.filter(contrato =>
                contrato.username_cliente && contrato.username_cliente.toLowerCase().trim() === currentUserUsername.toLowerCase().trim()
            );
        } else if (filterType === 'prestador') {
            filteredContracts = allContracts.filter(contrato =>
                contrato.username_empleado && contrato.username_empleado.toLowerCase().trim() === currentUserUsername.toLowerCase().trim()
            );
        }

        console.log(`✅ [Filtro] Filtro "${filterType}" aplicado. Se encontraron ${filteredContracts.length} contratos.`);
        renderContracts(filteredContracts);
    }

    // --- Carga Inicial de Datos y Event Listeners ---

    console.log('🚀 [Inicio] Iniciando carga de datos inicial...');
    Promise.all([
        fetch('/api/contratos/')
            .then(response => {
                console.log('✅ [Fetch] Respuesta de /api/contratos/ recibida. Estado:', response.status);
                if (!response.ok) {
                    // Este es el error que estabas viendo, indica que el backend falló.
                    // Ahora que tu SQL está corrigido, este error no debería aparecer.
                    throw new Error(`Error HTTP al cargar contratos: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            }),
        fetch('/api/auth/username')
            .then(response => {
                console.log('✅ [Fetch] Respuesta de /api/auth/username recibida. Estado:', response.status);
                if (!response.ok) {
                    throw new Error(`Error HTTP al cargar username: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
    ])
    .then(([contractsData, userData]) => {
        console.log('🎉 [Inicio] Datos de contratos y usuario obtenidos correctamente.');
        allContracts = contractsData;
        currentUserUsername = userData.username;

        console.log('📈 [Datos] Contratos recibidos (allContracts):', allContracts); 
        console.log('👤 [Datos] Username del usuario actual:', currentUserUsername);

        applyFilter(); // Aplica el filtro inicial (por defecto "todos")
    })
    .catch(error => {
        console.error('❌ [Error Fatal] Error general al cargar datos iniciales:', error);
        if (contratosContainer) {
            contratosContainer.innerHTML = `<p class="error-message">Error al cargar tus contratos o datos de usuario. Por favor, inténtalo de nuevo más tarde. (${error.message})</p>`;
        }
    });

    // Event Listener para el cambio del filtro
    if (filterTypeSelect) {
        filterTypeSelect.addEventListener('change', applyFilter);
    }

    // --- Función para manejar acciones de contrato (Comenzar/Rechazar) ---
    function handleContractAction(contratoId, estado) {
        console.log(`[Acción API] Enviando solicitud para cambiar estado de contrato ${contratoId} a: ${estado}`);

        const url = `/api/contratos/editar_contrato/${contratoId}/${estado}`;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || `Error en la solicitud: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log(`✅ [Acción API] Contrato ${contratoId} ${estado}ado con éxito:`, data);
            alert(data.message || `Contrato ${estado}ado exitosamente.`);

            console.log('[Acción API] Recargando contratos para actualizar la vista...');
            fetch('/api/contratos/')
                .then(response => {
                    if (!response.ok) throw new Error(`Error al recargar contratos: ${response.status}`);
                    return response.json();
                })
                .then(updatedData => {
                    allContracts = updatedData;
                    applyFilter();
                    console.log('🔄 [Acción API] Contratos recargados y vista actualizada.');
                })
                .catch(error => {
                    console.error('❌ [Acción API] Error al recargar contratos después de la acción:', error);
                });
        })
        .catch(error => {
            console.error(`❌ [Acción API] Error al ${estado} el contrato ${contratoId}:`, error);
            alert(`Hubo un error al ${estado} el contrato: ${error.message}`);
        });
    }
});
