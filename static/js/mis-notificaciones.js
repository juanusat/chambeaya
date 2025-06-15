document.addEventListener('DOMContentLoaded', function () {
    const notificationsContainer = document.getElementById('lista-notificaciones');

    if (!notificationsContainer) {
        return;
    }

    function renderContratoNotifications(contratos) {
        notificationsContainer.innerHTML = '';

        if (!contratos || contratos.length === 0) {
            notificationsContainer.innerHTML = '<p class="no-notifications-message">No tienes contratos pendientes para revisar.</p>';
            return;
        }

        contratos.forEach(contrato => {
            const card = document.createElement('div');
            card.className = 'notification-card';

            const rawFechaInicio = contrato.fecha_inicio;
            let fechaInicioFormatted = 'Fecha de inicio desconocida';
            if (rawFechaInicio) {
                const dateObj = new Date(rawFechaInicio);
                if (!isNaN(dateObj)) {
                    fechaInicioFormatted = dateObj.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                }
            }
            
            const currentUserId = document.body.dataset.userId; 
            const esPrestador = currentUserId && (contrato.prestador_id == currentUserId);
            // La lógica para 'isRead' se mantiene si 'pendiente' es el estado que indica 'no leído'
            const isRead = (contrato.estado !== 'pendiente'); 
            const isReadClass = isRead ? 'notification-read' : 'notification-unread';

            card.innerHTML = `
                <div class="notification-card-content">
                    <div class="notification-info">
                        <div class="notification-header-flex">
                            <h3 class="notification-title">Solicitud de Contrato</h3>
                            <span class="notification-date">${fechaInicioFormatted}</span>
                        </div>
                        <p class="notification-description">
                            Tienes una nueva solicitud para el servicio <strong>"${contrato.servicio || 'Servicio Desconocido'}"</strong>.
                        </p>
                        <div class="notification-details">
                            <p><strong>Fecha de Inicio:</strong> ${fechaInicioFormatted}</p>
                            <p><strong>Precio:</strong> $${parseFloat(contrato.precio || 0).toFixed(2)}</p>
                            <p><strong>${esPrestador ? 'Cliente' : 'Prestador'}:</strong> 
                                ${esPrestador ? (contrato.cliente || 'Desconocido') : (contrato.empleador || 'Desconocido')}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="notification-actions-buttons">
                    ${!isRead ? `
                        <button class="action-btn accept-contract-btn" data-contrato-id="${contrato.contrato_id}">
                            <i class="fas fa-check"></i> Aceptar
                        </button>
                        <button class="action-btn reject-contract-btn" data-contrato-id="${contrato.contrato_id}">
                            <i class="fas fa-times"></i> Rechazar
                        </button>
                    ` : `
                        <span class="notification-status-display ${isReadClass}">${isRead ? 'REVISADO' : 'PENDIENTE'}</span>
                    `}
                </div>
            `;
            notificationsContainer.appendChild(card);
        });

        notificationsContainer.querySelectorAll('.accept-contract-btn').forEach(button => {
            button.addEventListener('click', function() {
                const contratoId = this.dataset.contratoId;
                handleContractAction(contratoId, 'en espera', this.closest('.notification-card')); 
            });
        });

        notificationsContainer.querySelectorAll('.reject-contract-btn').forEach(button => {
            button.addEventListener('click', function() {
                const contratoId = this.dataset.contratoId;
                handleContractAction(contratoId, 'rechazado', this.closest('.notification-card'));
            });
        });
    }

    fetch('/api/notificaciones/')
        .then(response => {
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error('No autorizado o sesión expirada.');
                }
                throw new Error(`🚫 Error HTTP! Estado: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderContratoNotifications(data);
        })
        .catch(error => {
            notificationsContainer.innerHTML = `<p class="error-message">Error al cargar tus contratos pendientes: ${error.message}</p>`;
        });


    function handleContractAction(contratoId, estado, cardElement) {

        const url = `/api/contratos/editar_contrato/${contratoId}/${estado}`;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
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
            alert(data.message || `Contrato ${estado}ado exitosamente.`);

            if (cardElement) {
                const actionButtonsDiv = cardElement.querySelector('.notification-actions-buttons');
                if (actionButtonsDiv) {
                    actionButtonsDiv.innerHTML = `<span class="notification-status-display action-done">Acción: ${estado.toUpperCase()}</span>`;
                }
                cardElement.classList.add('notification-processed');
            }

            fetch('/api/notificaciones/')
                .then(response => response.json())
                .then(updatedData => {
                    renderContratoNotifications(updatedData);
                })
                .catch(error => {
                    console.error('Error al recargar notificaciones después de la acción:', error);
                });
        })
        .catch(error => {
            console.error(`❌ Error al ${estado} el contrato ${contratoId}:`, error);
        });
    }
});