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
                                <span class="date-label">Fin:</span>
                                <span class="date-value">${new Date(contrato.fecha_finalizacion).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div class="tag">
                            ${contrato.estado}
                        </div>
                    </div>

                    <div class="client-price-row">
                        <div class="client-info">
                            <p>${role}: <span class="client-name">${name}</span></p>
                            <img src="/static/uploads/${contrato.imagen}" 
                                 alt="Perfil" class="perfil-img">
                        </div>
                        <div class="price-actions">
                            ${isCliente ? '<button class="pagar-btn">Pagar</button>' : ''}
                            <div class="price-tag">Precio: <span>$${contrato.precio}</span></div>
                        </div>
                    </div>

                    <div class="info">
                        <p>${contrato.descripcion_servicio}</p>
                    </div>

                    <button class="resumen-pagos-btn" data-contrato-id="${contrato.contrato_id}">
                        Resumen de Pago(s)
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="resumen-pagos-contenido" id="comprobantes-${contrato.contrato_id}">
                        </div>
                `;
                    card.innerHTML += `
                        <div class="comentarios-contenedor" id="comentarios-${contrato.contrato_id}">
                            <h4>Comentarios:</h4>
                            
                            <button class="ver-comentario-btn">
                                Comentario
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            
                            <div class="comentario-contenido" style="display: none;">
                                <div class="comentario-existente">
                                    <p><strong>Comentario:</strong> <span class="comentario-texto">No hay comentario aún.</span></p>
                                    <p><strong>Calificación:</strong> 
                                        <span class="calificacion-estrellas-display">
                                            <span class="estrella-display">&#9734;</span>
                                            <span class="estrella-display">&#9734;</span>
                                            <span class="estrella-display">&#9734;</span>
                                            <span class="estrella-display">&#9734;</span>
                                            <span class="estrella-display">&#9734;</span>
                                        </span>
                                    </p>
                                    <button class="editar-comentario-btn" style="display: none;">Editar Comentario</button>
                                </div>

                                ${isCliente ? `
                                <form class="form-comentario" style="display: none;" data-contrato-id="${contrato.contrato_id}">
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
                                </form>` : ''}
                            </div>
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

            container.addEventListener('click', async function(event) {
                if (event.target.classList.contains('ver-comentario-btn')) {
                    const btn = event.target;
                    const comentarioContenido = btn.nextElementSibling;

                    // Alternar visibilidad
                    if (comentarioContenido.style.display === 'block') {
                        comentarioContenido.style.display = 'none';
                        return;
                    }

                    // Mostrar contenido
                    comentarioContenido.style.display = 'block';

                    // Obtener id del contrato, que está en un contenedor padre
                    const card = btn.closest('.card');
                    const contratoId = card.querySelector('.resumen-pagos-btn')?.getAttribute('data-contrato-id');

                    if (!contratoId) {
                        console.error('No se pudo obtener el contrato ID');
                        return;
                    }

                    try {
                        const response = await fetch(`/api/contratos/comentario/${contratoId}`);
                        if (!response.ok) throw new Error('Error en la respuesta de la API');
                        const data = await response.json();

                        const textoComentario = comentarioContenido.querySelector('.comentario-texto');
                        const estrellasDisplay = comentarioContenido.querySelectorAll('.estrella-display');

                        if (data.comentario && data.comentario.trim() !== '') {
                            textoComentario.textContent = data.comentario;
                        } else {
                            textoComentario.textContent = 'No hay comentario aún.';
                        }

                        // Mostrar estrellas según calificación
                        estrellasDisplay.forEach((estrella, i) => {
                            estrella.textContent = i < data.calificacion ? '★' : '☆';
                        });

                    } catch (error) {
                        console.error('Error al cargar comentario:', error);
                        comentarioContenido.querySelector('.comentario-texto').textContent = 'Error al cargar comentario.';
                    }
                }
            });


            console.log('Contratos agregados:', container.querySelectorAll('.card').length);
        })
        .catch(error => {
            console.error('Error al cargar contratos:', error);
        });
})();