(function () {
    // Obtener y parsear los datos del usuario desde el elemento con id 'user-data'
    const userData = JSON.parse(document.getElementById('user-data').textContent);
    console.log(userData);

    // Hacemos la petición a la API de contratos
    fetch('/api/contratos/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const container = document.querySelector('#lista-contratos');
            if (!container) return console.warn('No se encontró el contenedor #lista-contratos');
            container.innerHTML = '';

            // Iteramos sobre cada contrato y creamos su tarjeta
            data.forEach(contrato => {
                const card = document.createElement('div');
                card.className = 'card';

                // Determinar si el usuario actual es el cliente o el empleador
                const isCliente = contrato.username_cliente === userData.username;
                const role = isCliente ? 'Empleador' : 'Cliente';
                const name = isCliente ? contrato.empleador : contrato.cliente;

                // Crear el contenido de la tarjeta
                card.innerHTML = `
                    <div class="card-header">
                        <div class="title-dates-row">
                            <span class="nombre">${contrato.servicio}</span>
                            <div class="dates">
                                <span class="date-label">Inicio:</span>
                                <span class="date-value">${new Date(contrato.fecha_inicio).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div class="tag">
                            ${contrato.estado}
                        </div>
                    </div>

                    <div class="client-price-row">
                        <div class="client-info">
                            <p>${role}: <span class="client-name">${name}</span></p>
                            <img src="https://placehold.co/30x30/ccc/333?text=Perfil"
                                 alt="Perfil" class="perfil-img">
                        </div>
                        <div class="price-actions">
                            ${isCliente ? '<button class="pagar-btn">Pagar</button>' : ''}
                            <div class="price-tag">Precio: <span>$${contrato.precio}</span></div>
                        </div>
                    </div>

                    <div class="info">
                        <p>${contrato.descripcion_servicio}</p>
                        <p>Fecha de finalización: <strong>${new Date(contrato.fecha_finalizacion).toLocaleDateString()}</strong></p>
                    </div>

                    <button class="resumen-pagos-btn" data-contrato-id="${contrato.contrato_id}">
                        Resumen de Pago(s)
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="resumen-pagos-contenido" id="comprobantes-${contrato.contrato_id}">
                        <!-- Aquí se cargarán los comprobantes -->
                    </div>
                `;
                container.appendChild(card);
            });

            // Agregar evento a los botones de "Resumen de Pago(s)"
            container.addEventListener('click', event => {
                if (event.target.classList.contains('resumen-pagos-btn')) {
                    const contratoId = event.target.getAttribute('data-contrato-id');
                    const comprobantesContainer = document.getElementById(`comprobantes-${contratoId}`);
                    const icon = event.target.querySelector('i');

                    // Alternar visibilidad del contenido
                    if (comprobantesContainer.style.display === 'block') {
                        comprobantesContainer.style.display = 'none';
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                        return;
                    }

                    // Mostrar el contenido y cargar comprobantes si no están cargados
                    comprobantesContainer.style.display = 'block';
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');

                    if (comprobantesContainer.childElementCount > 0) {
                        console.log(`Comprobantes para contrato ${contratoId} ya cargados.`);
                        return; // No hacer nada si ya están cargados
                    }

                    // Hacer la petición para obtener los comprobantes de este contrato
                    fetch(`/api/comprobante_pago/contrato/${contratoId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(comprobantes => {
                            console.log(`Comprobantes para contrato ${contratoId}:`, comprobantes);
                            comprobantesContainer.innerHTML = '';

                            if (comprobantes.length === 0) {
                                comprobantesContainer.innerHTML = '<p>No hay comprobantes para este contrato.</p>';
                                return;
                            }

                            comprobantes.forEach((comprobante, index) => {
                                const comprobanteItem = document.createElement('div');
                                comprobanteItem.className = 'pago-item';
                                comprobanteItem.innerHTML = `
                                    <h4>${index + 1}° Pago:</h4>
                                    <div class="pago-detalle">
                                        <span class="label">Monto:</span>
                                        <span class="value">$${comprobante.monto}</span>
                                    </div>
                                    <div class="pago-detalle">
                                        <span class="label">Fecha de Pago:</span>
                                        <span class="value">${new Date(comprobante.fecha_pago).toLocaleDateString()}</span>
                                    </div>
                                    <div class="pago-detalle">
                                        <span class="label">Método de Pago:</span>
                                        <span class="value">${comprobante.metodo_pago}</span>
                                    </div>
                                `;
                                comprobantesContainer.appendChild(comprobanteItem);
                            });
                        })
                        .catch(error => {
                            console.error(`Error al cargar comprobantes para contrato ${contratoId}:`, error);
                        });
                }
            });

            console.log('Contratos agregados:', container.querySelectorAll('.card').length);
        })
        .catch(error => {
            console.error('Error al cargar contratos:', error);
        });
})();