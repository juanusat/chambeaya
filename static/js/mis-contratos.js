// mis-contratos.js
(function () {
    // Hacemos la petición a la API de contratos
    fetch('/api/contratos/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            const container = document.querySelector('#lista-contratos');
            container.innerHTML = ''
            if (!container) return console.warn('No se encontró el contenedor .contratos');

            // Iteramos sobre cada contrato y creamos su tarjeta
            data.forEach(contrato => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-header">
                        <div class="title-dates-row">
                            <!-- Aquí deberías sustituir servicio_id por el nombre real del servicio,
                                 si tu API lo devuelve como campo adicional (ej. contrato.servicio_nombre) -->
                            <span class="nombre">Servicio #${contrato.servicio_id}</span>
                            <div class="dates">
                                <span class="date-label">Inicio:</span>
                                <span class="date-value">${new Date(contrato.fecha_inicio).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div class="tag">
                            <!-- El estado del contrato (pendiente, en curso, finalizado, etc.) -->
                            ${contrato.estado}
                        </div>
                    </div>

                    <div class="client-price-row">
                        <div class="client-info">
                            <!-- De igual manera, sustituye cliente_id por nombre si lo tienes disponible -->
                            <p>Cliente: <span class="client-name">ID ${contrato.cliente_id}</span></p>
                            <!-- Puedes reemplazar el src por la URL real de la foto de perfil -->
                            <img src="https://placehold.co/30x30/ccc/333?text=Perfil"
                                 alt="Perfil" class="perfil-img">
                        </div>
                        <div class="price-tag">
                            Precio: <span>$${contrato.precio}</span>
                        </div>
                    </div>

                    <div class="info">
                        <!-- Puedes usar la descripción o cualquier otro campo que te venga -->
                        <p>Fecha de finalización: <strong>${new Date(contrato.fecha_finalizacion).toLocaleDateString()}</strong></p>
                    </div>
                `;
                container.appendChild(card);
            });

            console.log('Contratos agregados:', container.querySelectorAll('.card').length);
        })
        .catch(error => {
            console.error('Error al cargar contratos:', error);
        });
})();
