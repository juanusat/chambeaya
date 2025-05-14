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
                        <div class="price-tag">
                            Precio: <span>$${contrato.precio}</span>
                        </div>
                    </div>

                    <div class="info">
                        <p>${contrato.descripcion_servicio}</p>
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