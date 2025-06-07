let allContracts = [];
let currentUserUsername = '';

const contratosContainer = document.getElementById('contratos-container');
const filterTypeSelect = document.getElementById('filter-type');

// Referencias al modal y sus elementos
const paymentsModal = document.getElementById('paymentsModal');
const closeButton = document.querySelector('.modal .close-button');
const paymentsList = document.getElementById('paymentsList');
const noPaymentsMessage = document.getElementById('noPaymentsMessage');

// Referencias a los elementos de depuración (el select y el botón de "Ver Pagos (Debug)")
const debugPaymentsSelect = document.getElementById('debug-payments-select');
const debugViewPaymentsBtn = document.getElementById('debug-view-payments-btn');


if (!contratosContainer) {
    console.error('El elemento #contratos-container no fue encontrado en el DOM. Los contratos no se mostrarán.');
}

/**
 * Formatea un valor de precio a dos decimales y elimina el ".00" si es un número entero.
 * @param {number|string|null|undefined} price - El valor del precio.
 * @returns {string} El precio formateado o 'N/A' si es nulo/indefinido.
 */
function formatPrice(price) {
    if (price === null || typeof price === 'undefined') {
        return 'N/A';
    }
    return parseFloat(price).toFixed(2).replace(/\.00$/, '');
}

/**
 * Obtiene la URL completa de la imagen de perfil basándose en el valor de la base de datos.
 * Proporciona una imagen por defecto si el valor está vacío.
 * @param {string|null|undefined} dbValue - El nombre de archivo de la imagen desde la base de datos.
 * @returns {string} La URL completa de la imagen de perfil.
 */
function getProfileImageUrl(dbValue) {
    const cleanedValue = typeof dbValue === 'string' ? dbValue.trim() : '';
    if (cleanedValue) {
        return `/static/uploads/${cleanedValue}`;
    } else {
        return '/static/uploads/default-pic-profile.jpg';
    }
}

/**
 * Genera el bloque HTML para la sección de comentarios de un contrato.
 * @param {number} contratoId - El ID del contrato.
 * @returns {string} El HTML para el bloque de comentarios.
 */
function renderComentarioBlock(contratoId) {
    return `
        <div class="review-container-card" data-contrato-id="${contratoId}">
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
}

/**
 * Renderiza la lista de contratos en el DOM.
 * @param {Array<Object>} contractsToRender - La lista de objetos de contrato a mostrar.
 */
function renderContracts(contractsToRender) {
    if (!contratosContainer) {
        console.error('No se puede renderizar: contratosContainer no existe.');
        return;
    }
    console.log(`Renderizando ${contractsToRender.length} contratos...`);
    contratosContainer.innerHTML = ''; // Limpia el contenedor antes de renderizar

    if (contractsToRender.length === 0) {
        contratosContainer.innerHTML = '<p class="no-contracts-message">No tienes contratos disponibles que coincidan con este filtro.</p>';
        return;
    }

    contractsToRender.forEach(contrato => {
        console.log('Procesando contrato:', contrato);
        const card = document.createElement('div');
        card.classList.add('contract-card');
        if (contrato.estado) {
            // Agrega una clase para estilizar la tarjeta según el estado
            card.classList.add(`tag-${contrato.estado.toLowerCase().replace(/\s/g, '-')}`);
        }
        card.dataset.contratoId = contrato.contrato_id; // Guarda el ID del contrato en un atributo de datos

        // Formatea las fechas y el precio
        const fechaInicio = contrato.fecha_inicio ? new Date(contrato.fecha_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';
        const fechaFin = contrato.fecha_finalizacion ? new Date(contrato.fecha_finalizacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';
        const formattedPrice = formatPrice(contrato.precio);

        // Determinar si el usuario actual es el prestador o el cliente de este contrato
        const esPrestador = currentUserUsername && (contrato.username_empleado && contrato.username_empleado.toLowerCase().trim() === currentUserUsername.toLowerCase().trim());
        const esCliente = currentUserUsername && (contrato.username_cliente && contrato.username_cliente.toLowerCase().trim() === currentUserUsername.toLowerCase().trim());

        // Lógica para mostrar la imagen y nombre del "otro" usuario en el contrato
        let profileImageUrlToDisplay;
        let profileImageAltText = '';
        let profileImageOwnerName = '';

        if (esPrestador) {
            profileImageUrlToDisplay = getProfileImageUrl(contrato.imagenC); // Si soy prestador, muestro la imagen del cliente
            profileImageAltText = `Perfil de ${contrato.cliente || 'cliente'}`;
            profileImageOwnerName = contrato.cliente || 'Cliente Desconocido';
        } else if (esCliente) {
            profileImageUrlToDisplay = getProfileImageUrl(contrato.imagenP); // Si soy cliente, muestro la imagen del prestador
            profileImageAltText = `Perfil de ${contrato.empleador || 'prestador'}`;
            profileImageOwnerName = contrato.empleador || 'Prestador Desconocido';
        } else {
            // Esto ocurre si el contrato se muestra (ej. filtro 'todos') pero el usuario no es ni cliente ni prestador del mismo
            profileImageUrlToDisplay = getProfileImageUrl(contrato.imagenP); // Default a mostrar el prestador
            profileImageAltText = `Perfil de ${contrato.empleador || 'prestador'}`;
            profileImageOwnerName = contrato.empleador || 'Prestador Desconocido';
        }

        // Estructura HTML de la tarjeta del contrato
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
                ${esCliente && contrato.precio !== null && contrato.precio !== undefined && ['en progreso', 'completado'].includes(contrato.estado?.toLowerCase()) ?
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
                ${esPrestador && contrato.estado && contrato.estado.toLowerCase() === 'en espera' ?
                `
                    <button class="action-btn begin-btn" data-contrato-id="${contrato.contrato_id}">Comenzar</button>
                    <button class="action-btn cancel-btn" data-contrato-id="${contrato.contrato_id}">Cancelar</button>
                ` : ''}
                ${esPrestador && contrato.estado && contrato.estado.toLowerCase() === 'en progreso' ?
                `
                    <button class="action-btn complete-btn" data-contrato-id="${contrato.contrato_id}">Completado</button>
                    <button class="action-btn cancel-btn cancel-progress-btn" data-contrato-id="${contrato.contrato_id}">Cancelar</button>
                ` : ''}
                ${esPrestador && contrato.estado && contrato.estado.toLowerCase() === 'finalizado' ? // Muestra el botón "Ver pagos" solo si el usuario es prestador y el contrato está finalizado
                `<button class="action-btn view-payments-btn" data-contrato-id="${contrato.contrato_id}">Ver pagos</button>` : ''}
            </div>`;
        
        // Lógica para incluir el bloque de comentarios:
        // Solo aparece si el estado es "completado" O "finalizado" Y el usuario actual es el cliente
        if ((contrato.estado?.toLowerCase() === 'completado' || contrato.estado?.toLowerCase() === 'finalizado') && esCliente) {
            const comentarioHtmlBlock = renderComentarioBlock(contrato.contrato_id);
            card.innerHTML += comentarioHtmlBlock;
        }

        contratosContainer.appendChild(card); // Añade la tarjeta al contenedor
    });
    attachEventListeners(); // Adjunta los event listeners a los botones recién creados
    
    // Llama a la función de comentarios si está definida
    if (typeof window.configurarBotonesComentarios === 'function') {
        window.configurarBotonesComentarios();
    } else {
        console.warn('La función window.configurarBotonesComentarios no está definida. Asegúrate de que mis-comentarios.js se cargue correctamente.');
    }
}

/**
 * Adjunta los event listeners a todos los botones de acción en las tarjetas de contrato
 * para evitar duplicados en re-renderizados.
 */
function attachEventListeners() {
    if (contratosContainer) {
        // Eliminar y re-agregar listeners para evitar duplicados
        contratosContainer.querySelectorAll('.begin-btn').forEach(button => {
            button.removeEventListener('click', handleBeginClick);
            button.addEventListener('click', handleBeginClick);
        });

        contratosContainer.querySelectorAll('.cancel-btn').forEach(button => {
            button.removeEventListener('click', handleCancelClick);
            button.addEventListener('click', handleCancelClick);
        });

        contratosContainer.querySelectorAll('.pagar-btn').forEach(button => {
            button.removeEventListener('click', handlePagarClick);
            button.addEventListener('click', handlePagarClick);
        });

        contratosContainer.querySelectorAll('.complete-btn').forEach(button => {
            button.removeEventListener('click', handleCompleteClick);
            button.addEventListener('click', handleCompleteClick);
        });

        // Event listener para el botón "Ver pagos" en las tarjetas de contrato
        contratosContainer.querySelectorAll('.view-payments-btn').forEach(button => {
            button.removeEventListener('click', handleViewPaymentsClick);
            button.addEventListener('click', handleViewPaymentsClick);
        });
    }

    // Event listener para cerrar el modal
    if (closeButton) {
        closeButton.removeEventListener('click', closeModal);
        closeButton.addEventListener('click', closeModal);
    }
    // Cierra el modal si se hace clic fuera de su contenido
    window.removeEventListener('click', outsideClick);
    window.addEventListener('click', outsideClick);

    // Event listener para el botón de depuración "Ver Pagos (Debug)"
    if (debugViewPaymentsBtn) {
        // Usa la misma función de manejo, ya que handleViewPaymentsClick ya tiene la lógica para el select
        debugViewPaymentsBtn.removeEventListener('click', handleViewPaymentsClick);
        debugViewPaymentsBtn.addEventListener('click', handleViewPaymentsClick);
    }
}

// --- Funciones de manejo de acciones de contrato ---
function handleBeginClick() {
    const contratoId = this.dataset.contratoId;
    console.log(`Intentando comenzar contrato: ${contratoId}`);
    handleContractAction(contratoId, 'en progreso');
}

function handleCancelClick() {
    const contratoId = this.dataset.contratoId;
    console.log(`Intentando cancelar contrato: ${contratoId}`);
    handleContractAction(contratoId, 'cancelado');
}

function handleCompleteClick() {
    const contratoId = this.dataset.contratoId;
    console.log(`Intentando completar contrato: ${contratoId}`);
    handleContractAction(contratoId, 'completado');
}

function handlePagarClick() {
    const contratoId = this.dataset.contratoId;
    console.log(`Redirigiendo para pagar contrato: ${contratoId}`);
    window.location.href = `/pago.html?contrato_id=${contratoId}`;
}

// --- Lógica del Modal de Pagos ---
function openModal() {
    if (paymentsModal) {
        paymentsModal.style.display = 'block';
    }
}

function closeModal() {
    if (paymentsModal) {
        paymentsModal.style.display = 'none';
        paymentsList.innerHTML = ''; // Limpiar la lista al cerrar
        noPaymentsMessage.style.display = 'none'; // Ocultar mensaje de no pagos
    }
}

function outsideClick(event) {
    if (event.target == paymentsModal) {
        closeModal();
    }
}

/**
 * Maneja el clic en el botón "Ver pagos" (ya sea de una tarjeta o del botón de depuración).
 * Carga y muestra los pagos de un contrato en el modal.
 * @param {Event} event - El evento de clic.
 */
async function handleViewPaymentsClick(event) {
    // Determina el ID del contrato según el origen del evento
    const contratoId = event.target.id === 'debug-view-payments-btn' ?
                       debugPaymentsSelect.value : // Si es el botón de depuración, toma el valor del select
                       this.dataset.contratoId;    // Si es un botón de tarjeta, toma el data-contrato-id

    if (!contratoId) {
        alert('Por favor, selecciona un contrato o haz clic en un botón de contrato válido para ver los pagos.');
        return;
    }

    console.log(`Intentando ver pagos para el contrato: ${contratoId}`);
    openModal(); // Abre el modal inmediatamente

    paymentsList.innerHTML = '<p class="loading-message">Cargando pagos...</p>'; // Muestra un mensaje de carga
    noPaymentsMessage.style.display = 'none'; // Oculta el mensaje de "no pagos"

    try {
        const response = await fetch(`/api/comprobante_pago/contrato/${contratoId}`);
        
        // --- INICIO DE DEPURACIÓN CRÍTICA ---
        // Registra la respuesta completa para inspección
        console.log('--- RAW API RESPONSE DETALLADA ---');
        console.log('Response Status:', response.status);
        console.log('Response Headers:', Array.from(response.headers.entries()));
        // Clona la respuesta para poder leer el cuerpo dos veces (una como texto, otra como JSON)
        const clonedResponse = response.clone();
        // --- FIN DE DEPURACIÓN CRÍTICA ---

        // Verificar el tipo de contenido de la respuesta antes de intentar parsear como JSON.
        const contentType = response.headers.get('content-type');

        if (response.ok && contentType && contentType.includes('application/json')) {
            // Si la respuesta es OK y es JSON, procesa los pagos
            const payments = await response.json();
            console.log('Pagos recibidos (JSON OK):', payments);

            paymentsList.innerHTML = ''; // Limpia el mensaje de carga

            if (payments.length === 0) {
                noPaymentsMessage.style.display = 'block'; // Muestra el mensaje de "no hay pagos"
            } else {
                payments.forEach(payment => {
                    const paymentCard = document.createElement('div');
                    paymentCard.classList.add('payment-card');
                    
                    // Formatea la fecha y el monto para la visualización
                    const formattedDate = payment.fecha_pago ? new Date(payment.fecha_pago).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';
                    const formattedAmount = formatPrice(payment.monto);

                    paymentCard.innerHTML = `
                        <p><strong>Monto:</strong> $${formattedAmount}</p>
                        <p><strong>Método de Pago:</strong> ${payment.metodo_pago_nombre || 'Desconocido'}</p>
                        <p><strong>Fecha de Pago:</strong> ${formattedDate}</p>
                    `;
                    paymentsList.appendChild(paymentCard); // Añade la tarjeta de pago al modal
                });
            }
        } else if (!response.ok && contentType && contentType.includes('application/json')) {
            // El servidor devolvió un status no-OK (ej. 401, 403, 404, 500) pero con JSON de error
            const errorData = await clonedResponse.json(); // Usa la respuesta clonada para leer JSON
            console.error('Error JSON de API (Status no OK):', errorData);
            throw new Error(errorData.msg || errorData.error || `Error HTTP ${response.status}: ${response.statusText}`);
        } else {
            // El servidor devolvió un status no-OK O un Content-Type inesperado (probablemente HTML)
            const textResponse = await clonedResponse.text(); // Lee el cuerpo como texto para ver el HTML
            console.error('Respuesta inesperada (no JSON o error HTTP):', {status: response.status, statusText: response.statusText, contentType: contentType, body: textResponse});
            throw new Error(`Error en la respuesta del servidor (Status: ${response.status}). No es JSON o error inesperado. Contenido: "${textResponse.substring(0, 200)}..."`);
        }
    } catch (error) {
        console.error('Error al cargar pagos:', error);
        // Muestra un mensaje de error detallado en el modal
        paymentsList.innerHTML = `<p class="error-message">Error al cargar los pagos: ${error.message}</p>`;
        noPaymentsMessage.style.display = 'none';
    }
}

/**
 * Popula el menú desplegable de depuración con contratos finalizados donde el usuario es el prestador.
 */
function populateDebugPaymentsSelect() {
    if (!debugPaymentsSelect || !allContracts.length) {
        return;
    }

    // Limpiar opciones anteriores, excepto la primera "Selecciona un contrato"
    debugPaymentsSelect.innerHTML = '<option value="">Selecciona un contrato</option>';

    // Filtra los contratos para incluir solo los que están finalizados y donde el usuario actual es el prestador
    const finalizedPrestadorContracts = allContracts.filter(contrato =>
        currentUserUsername &&
        contrato.username_empleado &&
        contrato.username_empleado.toLowerCase().trim() === currentUserUsername.toLowerCase().trim() &&
        contrato.estado &&
        contrato.estado.toLowerCase() === 'finalizado'
    );

    if (finalizedPrestadorContracts.length > 0) {
        finalizedPrestadorContracts.forEach(contrato => {
            const option = document.createElement('option');
            option.value = contrato.contrato_id;
            option.textContent = `ID ${contrato.contrato_id}: ${contrato.servicio} (Cliente: ${contrato.cliente || 'Desconocido'})`;
            debugPaymentsSelect.appendChild(option);
        });
        debugViewPaymentsBtn.disabled = false; // Habilita el botón si hay contratos para seleccionar
    } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No hay contratos finalizados como prestador';
        option.disabled = true;
        debugPaymentsSelect.appendChild(option);
        debugViewPaymentsBtn.disabled = true; // Deshabilita el botón si no hay contratos
    }
}


/**
 * Aplica el filtro seleccionado por el usuario y re-renderiza los contratos.
 */
function applyFilter() {
    const filterType = filterTypeSelect ? filterTypeSelect.value : 'todos';
    let filteredContracts = [];
    console.log(`Aplicando filtro: ${filterType}. Usuario actual: ${currentUserUsername || 'no disponible'}`);

    if (filterType === 'todos') {
        filteredContracts = allContracts;
    } else if (filterType === 'cliente') {
        if (currentUserUsername) {
            filteredContracts = allContracts.filter(contrato =>
                contrato.username_cliente && contrato.username_cliente.toLowerCase().trim() === currentUserUsername.toLowerCase().trim()
            );
        } else {
            filteredContracts = [];
            console.warn('Filtrando como "cliente": No se puede determinar el usuario actual. Mostrando 0 contratos.');
        }
    } else if (filterType === 'prestador') {
        if (currentUserUsername) {
            filteredContracts = allContracts.filter(contrato =>
                contrato.username_empleado && contrato.username_empleado.toLowerCase().trim() === currentUserUsername.toLowerCase().trim()
            );
        } else {
            filteredContracts = [];
            console.warn('Filtrando como "prestador": No se puede determinar el usuario actual. Mostrando 0 contratos.');
        }
    }
    console.log(`Contratos filtrados (${filterType}):`, filteredContracts);
    renderContracts(filteredContracts); // Vuelve a renderizar con los contratos filtrados
}

/**
 * Realiza una acción de actualización de estado para un contrato (Comenzar, Cancelar, Completar).
 * @param {number} contratoId - El ID del contrato a actualizar.
 * @param {string} estado - El nuevo estado del contrato.
 */
function handleContractAction(contratoId, estado) {
    const url = `/api/contratos/editar_contrato/${contratoId}/${estado}`;
    console.log(`Enviando acción para contrato ${contratoId}: ${estado}`);

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
        console.log(data.message || `Contrato ${estado}ado exitosamente.`);
        console.log('Contrato actualizado en el backend. Recargando datos...');
        // Recarga los contratos para reflejar el cambio de estado
        fetch('/api/contratos/', { redirect: 'follow' })
            .then(response => {
                if (response.redirected) {
                    console.warn('Redirección detectada para /api/contratos/. Redirigiendo a:', response.url);
                    window.location.href = response.url;
                    return Promise.reject('Redireccionado a página de inicio. No autenticado.');
                }
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.error || `Error al recargar contratos: ${response.status} - ${response.statusText}`);
                    });
                }
                return response.json();
            })
            .then(updatedData => {
                allContracts = updatedData;
                console.log('Datos de contratos recargados:', allContracts);
                applyFilter(); // Vuelve a aplicar el filtro para re-renderizar y actualizar la UI
                populateDebugPaymentsSelect(); // Re-popula el select de depuración con los datos actualizados
            })
            .catch(error => {
                console.error('Error al recargar contratos después de la acción:', error);
            });
    })
    .catch(error => {
        console.error(`Error al ${estado} el contrato ${contratoId}:`, error);
        // Muestra un mensaje de error al usuario. Considera usar un modal en lugar de alert para una mejor UX.
        alert(`Hubo un error al ${estado} el contrato: ${error.message}`);
    });
}

console.log('Iniciando carga de contratos y datos de usuario directamente...');

// Carga inicial de contratos y username del usuario al cargar la página
Promise.all([
    // Carga de contratos
    fetch('/api/contratos/', { redirect: 'follow' })
        .then(response => {
            if (response.redirected) {
                console.warn('Redirección detectada para /api/contratos/. Redirigiendo a:', response.url);
                window.location.href = response.url; // Fuerza la redirección en el navegador
                return Promise.reject('Redireccionado a página de inicio. No autenticado.'); // Rechaza la promesa para detener el flujo
            }
            if (!response.ok) {
                // Si la respuesta no es OK, intenta leer el JSON de error
                return response.json().then(err => {
                    throw new Error(err.error || `Error HTTP al cargar contratos: ${response.status} - ${response.statusText}`);
                });
            }
            return response.json();
        }),
    // Carga del username del usuario actual
    fetch('/api/auth/username')
        .then(response => {
            if (!response.ok) {
                console.error(`Error HTTP al cargar username: ${response.status} - ${response.statusText}`);
                return { username: '' }; // Devuelve un objeto vacío para evitar errores posteriores
            }
            return response.json();
        })
])
.then(([contractsData, userData]) => {
    allContracts = contractsData;
    currentUserUsername = userData.username || '';
    console.log('Datos iniciales cargados. Contratos:', allContracts, 'Usuario:', currentUserUsername);
    applyFilter(); // Aplica el filtro inicial y renderiza los contratos
    populateDebugPaymentsSelect(); // Popula el select de depuración después de cargar los datos
})
.catch(error => {
    console.error('Error general al cargar datos iniciales:', error);
    if (contratosContainer) {
        if (!error.message.includes('Redireccionado')) { // Evita mostrar error si es una redirección intencional
            contratosContainer.innerHTML = `<p class="error-message">Error al cargar tus contratos o datos de usuario. Por favor, inténtalo de nuevo más tarde. (${error.message})</p>`;
        }
    }
});

// Configura el event listener para el filtro al cargar el script
if (filterTypeSelect) {
    filterTypeSelect.addEventListener('change', applyFilter);
} else {
    console.warn('El elemento #filter-type no fue encontrado. El filtro no funcionará.');
}
