
document.addEventListener('DOMContentLoaded', () => {
    function formatearFechaLegible(fechaStr) {
        if (!fechaStr) return 'Fecha no disponible';

        const fecha = new Date(fechaStr.replace(' ', 'T'));

        if (isNaN(fecha.getTime())) return 'Fecha inválida';

        const opciones = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };

        return fecha.toLocaleString('es-ES', opciones);
    }

    const sesionesListaDiv = document.getElementById('sesiones-lista');

    async function cargarSesiones() {
        try {
            const response = await fetch('/api/seguridad/sesiones');
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            const sesiones = await response.json();
            sesionesListaDiv.innerHTML = ''; 

            if (sesiones.length === 0) {
                sesionesListaDiv.innerHTML = '<p>No tienes sesiones activas.</p>';
                return;
            }

            const ul = document.createElement('ul');
            sesiones.forEach(sesion => {
                const li = document.createElement('li');
                li.dataset.claveHash = sesion.clave_hash;

                const dispositivoP = document.createElement('p');
                dispositivoP.innerHTML = `<strong>Dispositivo:</strong> ${sesion.user_agent || 'No identificado'}`;

                const iniciadaP = document.createElement('p');
                iniciadaP.innerHTML = `<strong>Iniciada:</strong> ${formatearFechaLegible(sesion.creado_en)}`;

                const accesoP = document.createElement('p');
                accesoP.innerHTML = `<strong>Último Acceso:</strong> ${formatearFechaLegible(sesion.ultimo_acceso)}`;

                li.appendChild(dispositivoP);
                li.appendChild(iniciadaP);
                li.appendChild(accesoP);

                if (sesion.es_actual) {
                    const actualP = document.createElement('p');
                    actualP.innerHTML = `<strong>(Esta sesión)</strong>`;
                    li.appendChild(actualP);
                } else {
                    const button = document.createElement('button');
                    button.classList.add('invalidar-btn');
                    button.textContent = 'Cerrar Sesión';
                    li.appendChild(button);
                }

                ul.appendChild(li);
            });
            sesionesListaDiv.appendChild(ul);

        } catch (error) {
            console.error('Error al cargar las sesiones:', error);
            sesionesListaDiv.innerHTML = '<p class="error">No se pudieron cargar tus sesiones. Inténtalo de nuevo más tarde.</p>';
        }
    }

    async function invalidarSesion(claveHash, elementoLi) {
        if (!confirm('¿Estás seguro de que quieres cerrar esta sesión?')) {
            return;
        }
        try {
            const response = await fetch(`/api/seguridad/sesiones/${claveHash}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error del servidor: ${response.status}`);
            }
            
            elementoLi.style.transition = 'opacity 0.5s ease';
            elementoLi.style.opacity = '0';
            setTimeout(() => elementoLi.remove(), 500);

        } catch (error) {
            console.error('Error al invalidar la sesión:', error);
            alert(`No se pudo invalidar la sesión: ${error.message}`);
        }
    }

    sesionesListaDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('invalidar-btn')) {
            const li = event.target.closest('li');
            const claveHash = li.dataset.claveHash;
            invalidarSesion(claveHash, li);
        }
    });

    cargarSesiones();
});