document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 [Notificaciones Page JS] Script de notificaciones.html cargado.');

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
        console.warn('⚠️ [Notificaciones Page JS] Elemento #user-data no encontrado.');
    }

    const container = document.querySelector('#lista-notificaciones');

    if (!container) {
        console.warn('⚠️ [Notificaciones Page JS] No se encontró el contenedor #lista-notificaciones. Las tarjetas no se mostrarán.');
        return;
    }

    container.innerHTML = '<p>Cargando notificaciones...</p>';

    fetch('/api/notificaciones/')
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
            console.log('Datos de notificaciones recibidos:', data);
            container.innerHTML = '';

            if (data.length === 0) {
                container.innerHTML = '<p>No tienes notificaciones pendientes en este momento.</p>';
                return;
            }

            data.forEach(contrato => {
                const card = document.createElement('div');
                card.className = 'notification-display-card';

                const fechaInicio = new Date(contrato.fecha_inicio).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const fechaFin = new Date(contrato.fecha_finalizacion).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const formattedPrice = parseFloat(contrato.precio || 0).toFixed(2);
                const prestadorName = contrato.empleador || 'N/A';
                const prestadorImagen = contrato.imagen ? `/static/uploads/${contrato.imagen}` : '/static/img/default-profile.png';

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
                        <span class="client-label">Prestador:</span>
                        <span class="client-name-value">${prestadorName}</span>
                        <img src="${prestadorImagen}" alt="Imagen del prestador" class="prestador-imagen">
                    </div>
                    <div class="card-price-row">
                        <span class="price-label">Precio:</span>
                        <span class="price-value">$${formattedPrice}</span>
                    </div>
                    <div class="card-actions-buttons">
                        <button class="accept-btn" data-contrato-id="${contrato.contrato_id}">Aceptar</button>
                        <button class="reject-btn" data-contrato-id="${contrato.contrato_id}">Rechazar</button>
                    </div>
                `;
                container.appendChild(card);
            });

            container.querySelectorAll('.accept-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const contratoId = this.dataset.contratoId;
                    handleContractAction(contratoId, 'en espera', this.closest('.notification-display-card'));
                });
            });

            container.querySelectorAll('.reject-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const contratoId = this.dataset.contratoId;
                    handleContractAction(contratoId, 'rechazado', this.closest('.notification-display-card'));
                });
            });

        })
        .catch(error => {
            console.error('❌ Error al cargar notificaciones:', error);
            container.innerHTML = `<p>Error al cargar tus notificaciones: ${error.message}</p>`;
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
            
            if (cardElement) {
                cardElement.remove(); 
            }
        })
        .catch(error => {
            console.error(`Error al ${estado} el contrato ${contratoId}:`, error);
            alert(`Hubo un error al ${estado} el contrato: ${error.message}`);
        });
    }
});