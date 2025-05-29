document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 [Mis Contratos] Script mis_contratos.js cargado.');

    let allContracts = []; // Almacenará todos los contratos sin filtrar
    let currentUserUsername = ''; // Almacenará el username del usuario logueado

    // Referencias a elementos del DOM (ya verificadas al inicio)
    const contratosContainer = document.getElementById('contratos-container');
    const filterTypeSelect = document.getElementById('filter-type');

    // Comprobación inicial de existencia de los contenedores (muy importante)
    if (!contratosContainer) {
        console.error('❌ ERROR: No se encontró el elemento con ID "contratos-container". Los contratos no se podrán renderizar.');
        return; // Detiene la ejecución si el contenedor principal no existe
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

    // Construye la URL completa de la imagen de perfil
    function getProfileImageUrl(dbValue) {
        // Si el valor de la DB ya es una ruta completa (ej. /static/uploads/...)
        if (dbValue && dbValue.startsWith('/static/uploads/')) {
            // console.log(`   [DEBUG IMAGEN] DB ya tiene ruta completa: ${dbValue}`);
            return dbValue;
        } 
        // Si es solo el nombre del archivo o un valor válido que no es una ruta completa
        else if (dbValue) { 
            // console.log(`   [DEBUG IMAGEN] DB tiene nombre de archivo: ${dbValue}. Construyendo ruta.`);
            return `/static/uploads/${dbValue}`;
        } 
        // Si no hay valor o es nulo/vacío
        else {
            // console.log('   [DEBUG IMAGEN] No hay imagen en DB. Usando imagen por defecto.');
            return '/static/uploads/default-pic-profile.jpg';
        }
    }

    // --- Funciones de Renderizado y Filtrado ---

    // Renderiza los contratos en el DOM
    function renderContracts(contractsToRender) {
        // Limpia el contenedor antes de añadir nuevos cards
        contratosContainer.innerHTML = ''; 

        if (contractsToRender.length === 0) {
            contratosContainer.innerHTML = '<p class="no-contracts-message">No tienes contratos disponibles que coincidan con este filtro.</p>';
            console.log('ℹ️ [Render] No hay contratos para renderizar con el filtro actual.');
            return;
        }

        console.log(`🔄 [Render] Renderizando ${contractsToRender.length} contrato(s).`);

        contractsToRender.forEach(contrato => {
            // console.log('🔍 [Render] Procesando contrato ID:', contrato.contrato_id);
            
            const card = document.createElement('div');
            card.classList.add('contract-card');
            // Añade clase de estado para estilos específicos
            if (contrato.estado) {
                card.classList.add(`tag-${contrato.estado.toLowerCase().replace(/\s/g, '-')}`);
            }
            card.dataset.contratoId = contrato.contrato_id;

            const fechaInicio = new Date(contrato.fecha_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const fechaFin = new Date(contrato.fecha_finalizacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const formattedPrice = formatPrice(contrato.precio);

            // Determinar si el usuario actual es el prestador o el cliente de ESTE contrato
            // Usamos .trim() para evitar problemas con espacios en blanco
            const esPrestador = currentUserUsername && (contrato.username_empleado && contrato.username_empleado.toLowerCase().trim() === currentUserUsername.toLowerCase().trim());
            const esCliente = currentUserUsername && (contrato.username_cliente && contrato.username_cliente.toLowerCase().trim() === currentUserUsername.toLowerCase().trim());

            // console.log(`   [Render] Contrato ID ${contrato.contrato_id}: esPrestador=${esPrestador}, esCliente=${esCliente}`);

            // --- Lógica para la imagen y nombre del OTRO usuario en el card ---
            let profileImageUrlToDisplay;
            let profileImageAltText = '';
            let profileImageOwnerName = ''; // Nombre de la persona cuya imagen se está mostrando

            if (esPrestador) {
                // Si el usuario actual es el prestador de este contrato, mostramos la imagen del cliente
                // console.log('   [Render] Usuario actual es PRESTADOR. Mostrando imagen del CLIENTE.');
                profileImageUrlToDisplay = getProfileImageUrl(contrato.imagenC); // Usar imagenC (del cliente)
                profileImageAltText = `Perfil de ${contrato.cliente || 'cliente'}`;
                profileImageOwnerName = contrato.cliente || 'Cliente Desconocido';
            } else if (esCliente) {
                // Si el usuario actual es el cliente de este contrato, mostramos la imagen del prestador
                // console.log('   [Render] Usuario actual es CLIENTE. Mostrando imagen del PRESTADOR.');
                profileImageUrlToDisplay = getProfileImageUrl(contrato.imagenP); // Usar imagenP (del prestador)
                profileImageAltText = `Perfil de ${contrato.empleador || 'prestador'}`;
                profileImageOwnerName = contrato.empleador || 'Prestador Desconocido';
            } else {
                // Caso por defecto (ej. si no coincide el rol por alguna razón, o para contratos de otros)
                // Se muestra la imagen del prestador por defecto.
                // console.log('   [Render] Rol no identificado. Mostrando imagen del PRESTADOR por defecto.');
                profileImageUrlToDisplay = getProfileImageUrl(contrato.imagenP);
                profileImageAltText = `Perfil de ${contrato.empleador || 'prestador'}`;
                profileImageOwnerName = contrato.empleador || 'Prestador Desconocido';
            }

            // console.log('   [Render] URL FINAL de la imagen a mostrar:', profileImageUrlToDisplay);
            // --- Fin de lógica de imagen ---

            let buttonsHtml = '';
            let pagarButtonHTML = '';

            // Lógica para mostrar botones "Comenzar" y "Rechazar" para el PRESTADOR
            if (esPrestador && contrato.estado && contrato.estado.toLowerCase() === 'en espera') {
                buttonsHtml = `
                    <button class="action-btn begin-btn" data-contrato-id="${contrato.contrato_id}">Comenzar</button>
                    <button class="action-btn reject-btn" data-contrato-id="${contrato.contrato_id}">Rechazar</button>
                `;
                // console.log('   ✅ [Render] Botones de Prestador (Comenzar/Rechazar) para contrato ID:', contrato.contrato_id);
            }

            // Lógica para el botón "Pagar" para el CLIENTE
            if (esCliente && contrato.precio && contrato.estado &&
                ['en progreso', 'finalizado'].includes(contrato.estado.toLowerCase())) { // Pagar cuando está en progreso o finalizado
                pagarButtonHTML = `<button class="pagar-btn" data-contrato-id="${contrato.contrato_id}">Pagar</button>`;
                // console.log('   ✅ [Render] Botón Pagar para contrato ID:', contrato.contrato_id);
            }

            // Construcción del HTML del card
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
                    ${pagarButtonHTML}
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
                    ${buttonsHtml}
                </div>
            `;
            
            contratosContainer.appendChild(card); // Agrega el card al contenedor
            // console.log('✨ [Render] Card añadido al DOM para contrato ID:', contrato.contrato_id);
        });
        attachEventListeners(); // Adjunta listeners a los botones recién creados
    }

    // Adjunta listeners a los botones de acción de los cards
    function attachEventListeners() {
        if (contratosContainer) {
            contratosContainer.querySelectorAll('.begin-btn').forEach(button => {
                button.removeEventListener('click', handleBeginClick); // Evita duplicados
                button.addEventListener('click', handleBeginClick);
            });

            contratosContainer.querySelectorAll('.reject-btn').forEach(button => {
                button.removeEventListener('click', handleRejectClick); // Evita duplicados
                button.addEventListener('click', handleRejectClick);
            });

            contratosContainer.querySelectorAll('.pagar-btn').forEach(button => {
                button.removeEventListener('click', handlePagarClick); // Evita duplicados
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
            filteredContracts = allContracts; // Muestra todos si no hay usuario logueado conocido
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
        // Petición para obtener todos los contratos del usuario logueado
        fetch('/api/contratos/')
            .then(response => {
                console.log('✅ [Fetch] Respuesta de /api/contratos/ recibida. Estado:', response.status);
                if (!response.ok) {
                    throw new Error(`Error HTTP al cargar contratos: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            }),
        // Petición para obtener el username del usuario logueado (para filtros y lógica de visualización)
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
        allContracts = contractsData; // Almacena los contratos
        currentUserUsername = userData.username; // Almacena el username

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

            // Recargar los contratos después de una acción exitosa
            console.log('[Acción API] Recargando contratos para actualizar la vista...');
            fetch('/api/contratos/')
                .then(response => {
                    if (!response.ok) throw new Error(`Error al recargar contratos: ${response.status}`);
                    return response.json();
                })
                .then(updatedData => {
                    allContracts = updatedData;
                    applyFilter(); // Re-renderiza con los datos actualizados
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