document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 [Mis Contratos Page JS] Script de mis_contratos.html cargado.');

    let userData = {};
    const userDataElement = document.getElementById('user-data');
    if (userDataElement) {
        try {
            userData = JSON.parse(userDataElement.textContent);
            console.log('User Data:', userData);
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    } else {
        console.warn('⚠️ [Mis Contratos Page JS] Elemento #user-data no encontrado.');
    }

    const contratosContainer = document.querySelector('#contratos-container');
    const filterTypeSelect = document.getElementById('filter-type');

    if (!contratosContainer) {
        console.warn('⚠️ [Mis Contratos Page JS] No se encontró el contenedor #contratos-container. Las tarjetas no se mostrarán.');
        return;
    }

    // Función para renderizar los contratos
    function renderContratos(contratos, currentFilterType) {
        contratosContainer.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevos contratos

        if (contratos.length === 0) {
            contratosContainer.innerHTML = '<p>No tienes contratos para mostrar en esta categoría.</p>';
            return;
        }

        contratos.forEach(contrato => {
            // Asume que userData.user_id existe y contrato.empleador_id/cliente_id identifican el rol
            const esPrestador = (userData.user_id === contrato.empleador_id);
            const esCliente = (userData.user_id === contrato.cliente_id);

            // Filtrar contratos según la opción seleccionada en el dropdown
            if (currentFilterType === 'cliente' && !esCliente) {
                return;
            }
            if (currentFilterType === 'prestador' && !esPrestador) {
                return;
            }

            const card = document.createElement('div');
            card.className = 'notification-display-card';

            const fechaInicio = new Date(contrato.fecha_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const fechaFin = new Date(contrato.fecha_finalizacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const formattedPrice = parseFloat(contrato.precio || 0).toFixed(2);
            const prestadorName = contrato.empleador_nombre || 'N/A';
            const clienteName = contrato.cliente_nombre || 'N/A';
            const prestadorImagen = contrato.imagen_prestador ? `/static/uploads/${contrato.imagen_prestador}` : '/static/img/default-profile.png';
            const clienteImagen = contrato.imagen_cliente ? `/static/uploads/${contrato.imagen_cliente}` : '/static/img/default-profile.png';

            let buttonsHtml = '';

            // Lógica para mostrar botones "Comenzar" y "Rechazar"
            // Estos botones aparecen si el usuario es el prestador Y el contrato está "en espera".
            if (esPrestador && contrato.estado === 'en espera') {
                buttonsHtml = `
                    <button class="action-btn begin-btn" data-contrato-id="${contrato.contrato_id}">Comenzar</button>
                    <button class="action-btn reject-btn" data-contrato-id="${contrato.contrato_id}">Rechazar</button>
                `;
            } else if (esCliente && contrato.estado === 'en espera') {
                 // Si es cliente y el contrato está en espera, puede cancelar la solicitud
                 buttonsHtml = `
                    <button class="action-btn cancel-btn" data-contrato-id="${contrato.contrato_id}">Cancelar Solicitud</button>
                `;
            }


            card.innerHTML = `
                <div class="card-title-row">
                    <span class="service-name">${contrato.servicio || 'Servicio Desconocido'}</span>
                </div>
                <div class="card-description">
                    <p>${contrato.descripcion_servicio || 'No hay descripción disponible.'}</p>
                </div>
                <div class="card-dates-and-tag-row">
                    <div class="card-dates-info">
                        <span class="date-label">Inicio:</span> <span class="date-value">${fechaInicio}</span>
                        <span class="date-label">Fin:</span> <span class="date-value">${fechaFin}</span>
                    </div>
                    <div class="status-tag ${contrato.estado ? contrato.estado.toLowerCase().replace(/\s/g, '-') : 'desconocido'}">
                        ${(contrato.estado || 'Desconocido').toUpperCase()}
                    </div>
                </div>
                <div class="card-client-info">
                    <span class="client-label">${esPrestador ? 'Cliente:' : 'Prestador:'}</span>
                    <span class="client-name-value">${esPrestador ? clienteName : prestadorName}</span>
                    <img src="${esPrestador ? clienteImagen : prestadorImagen}" alt="Imagen del ${esPrestador ? 'cliente' : 'prestador'}" class="profile-imagen">
                </div>
                <div class="card-price-row">
                    <span class="price-label">Precio:</span>
                    <span class="price-value">$${formattedPrice}</span>
                </div>
                <div class="card-actions-buttons">
                    ${buttonsHtml}
                </div>
            `;
            contratosContainer.appendChild(card);
        });

        // Adjuntar eventos a los nuevos botones (solo si existen en el DOM)
        contratosContainer.querySelectorAll('.begin-btn').forEach(button => {
            button.addEventListener('click', function() {
                const contratoId = this.dataset.contratoId;
                handleContractAction(contratoId, 'en progreso', this.closest('.notification-display-card'));
            });
        });

        contratosContainer.querySelectorAll('.reject-btn').forEach(button => {
            button.addEventListener('click', function() {
                const contratoId = this.dataset.contratoId;
                handleContractAction(contratoId, 'rechazado', this.closest('.notification-display-card'));
            });
        });

        contratosContainer.querySelectorAll('.cancel-btn').forEach(button => {
            button.addEventListener('click', function() {
                const contratoId = this.dataset.contratoId;
                handleContractAction(contratoId, 'cancelado', this.closest('.notification-display-card'));
            });
        });
    }

    // Cargar contratos inicialmente
    fetch('/api/contratos/')
        .then(response => {
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.error('No autorizado. Puede que la sesión haya expirado.');
                    throw new Error('No autorizado o sesión expirada.');
                }
                throw new Error(`Error HTTP! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de contratos recibidos:', data);
            let allContratos = data; // Guardar todos los contratos para el filtrado
            renderContratos(allContratos, filterTypeSelect.value); // Renderizar con el filtro inicial

            // Añadir listener al select de filtro
            filterTypeSelect.addEventListener('change', (event) => {
                renderContratos(allContratos, event.target.value);
            });
        })
        .catch(error => {
            console.error('❌ Error al cargar contratos:', error);
            contratosContainer.innerHTML = `<p>Error al cargar tus contratos: ${error.message}</p>`;
        });

    function handleContractAction(contratoId, estado, cardElement) {
        console.log(`Intentando cambiar estado de contrato ${contratoId} a: ${estado}`);

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
            console.log(`Contrato ${contratoId} ${estado}ado con éxito:`, data);
            alert(data.message || `Contrato ${estado}ado exitosamente.`);

            // Recargar los contratos para reflejar el cambio en la vista actual
            // Esto es crucial para que los botones desaparezcan si el estado ya no es "en espera"
            fetch('/api/contratos/')
                .then(response => response.json())
                .then(updatedData => {
                    allContratos = updatedData; // Actualizar la lista global de contratos
                    renderContratos(allContratos, filterTypeSelect.value); // Volver a renderizar
                })
                .catch(error => {
                    console.error('Error al recargar contratos después de la acción:', error);
                });
        })
        .catch(error => {
            console.error(`Error al ${estado} el contrato ${contratoId}:`, error);
            alert(`Hubo un error al ${estado} el contrato: ${error.message}`);
        });
    }
});