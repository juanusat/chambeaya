
document.addEventListener('DOMContentLoaded', () => {
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

                let info = `
                    <strong>Dispositivo:</strong> ${sesion.user_agent || 'No identificado'} <br>
                    <strong>Iniciada:</strong> ${sesion.creado_en} <br>
                    <strong>Último Acceso:</strong> ${sesion.ultimo_acceso}
                `;
                
                if (sesion.es_actual) {
                    info += ' <strong>(Esta sesión)</strong>';
                    li.innerHTML = info;
                } else {
                    li.innerHTML = `
                        ${info} <button class="invalidar-btn">Cerrar Sesión</button>
                    `;
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