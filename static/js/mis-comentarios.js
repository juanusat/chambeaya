(function() {
    // --- Elementos del Modal Personalizado ---
    let customModal = null;
    let customModalMessage = null;
    let customModalConfirmButtons = null;
    let customModalCancelButton = null;
    let customModalInfoButton = null;

    /**
     * Inicializa el modal personalizado inyectándolo en el DOM.
     * Se llama una vez al cargar el script.
     * NOTA: Los estilos CSS para este modal deben cargarse por separado (ej. en un archivo CSS).
     */
    function initializeCustomModal() {
        if (document.getElementById('custom-app-modal')) {
            customModal = document.getElementById('custom-app-modal');
            customModalMessage = document.getElementById('custom-modal-message');
            customModalConfirmButtons = document.getElementById('custom-modal-confirm-button');
            customModalInfoButton = document.getElementById('custom-modal-info-button');
            customModalCancelButton = document.getElementById('custom-modal-cancel-button');
            return; // Ya inicializado
        }

        const modalHtml = `
            <div id="custom-app-modal" class="custom-app-modal-overlay" style="display: none;">
                <div class="custom-app-modal-content">
                    <p id="custom-modal-message"></p>
                    <div class="custom-app-modal-buttons">
                        <button id="custom-modal-confirm-button" class="confirm-button" style="display: none;">Confirmar</button>
                        <button id="custom-modal-info-button" class="info-button" style="display: none;">Aceptar</button>
                        <button id="custom-modal-cancel-button" class="cancel-button" style="display: none;">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        customModal = document.getElementById('custom-app-modal');
        customModalMessage = document.getElementById('custom-modal-message');
        customModalConfirmButtons = document.getElementById('custom-modal-confirm-button');
        customModalInfoButton = document.getElementById('custom-modal-info-button');
        customModalCancelButton = document.getElementById('custom-modal-cancel-button');
    }

    /**
     * Muestra un mensaje simple en el modal.
     * @param {string} message El mensaje a mostrar.
     * @param {string} type El tipo de mensaje ('info', 'success', 'error').
     */
    function showMessage(message, type = 'info') {
        initializeCustomModal();
        customModalMessage.textContent = message;
        customModalConfirmButtons.style.display = 'none';
        customModalCancelButton.style.display = 'none';
        customModalInfoButton.style.display = 'inline-block';

        customModalInfoButton.onclick = () => {
            customModal.style.display = 'none';
        };
        customModal.style.display = 'flex';
    }

    /**
     * Muestra un modal de confirmación.
     * @param {string} message El mensaje de confirmación.
     * @param {Function} onConfirm Callback a ejecutar si se confirma.
     * @param {Function} onCancel Callback a ejecutar si se cancela.
     */
    function showConfirmation(message, onConfirm, onCancel) {
        initializeCustomModal();
        customModalMessage.textContent = message;
        customModalInfoButton.style.display = 'none';
        customModalConfirmButtons.style.display = 'inline-block';
        customModalCancelButton.style.display = 'inline-block';

        customModalConfirmButtons.onclick = () => {
            customModal.style.display = 'none';
            if (onConfirm) onConfirm();
        };

        customModalCancelButton.onclick = () => {
            customModal.style.display = 'none';
            if (onCancel) onCancel();
        };

        customModal.style.display = 'flex';
    }

    // --- Fin de Elementos del Modal Personalizado ---

    window.configurarBotonesComentarios = function() {
        initializeCustomModal();
        // Inicializa hover, click y reset para las estrellas
        document.querySelectorAll('.calificacion-estrellas').forEach(container => {
            const estrellas = Array.from(container.querySelectorAll('.estrella'));

            estrellas.forEach(estrella => {
                const mouseEnterHandler = () => hoverStars(container, +estrella.dataset.value);
                estrella.removeEventListener('mouseenter', mouseEnterHandler);
                estrella.addEventListener('mouseenter', mouseEnterHandler);

                const clickHandler = () => selectStars(container, +estrella.dataset.value);
                estrella.removeEventListener('click', clickHandler);
                estrella.addEventListener('click', clickHandler);
            });

            const mouseLeaveHandler = () => resetStars(container);
            container.removeEventListener('mouseleave', mouseLeaveHandler);
            container.addEventListener('mouseleave', mouseLeaveHandler);
        });
        document.querySelectorAll('.ver-comentario-btn').forEach(boton => {
            boton.removeEventListener('click', handleVerComentarioClick);
            boton.addEventListener('click', handleVerComentarioClick);
        });

        document.querySelectorAll('.form-comentario').forEach(form => {
            form.removeEventListener('submit', handleComentarioFormSubmit);
            form.addEventListener('submit', handleComentarioFormSubmit);
        });

        document.querySelectorAll('.editar-comentario-btn').forEach(btn => {
            btn.removeEventListener('click', handleEditarComentarioClick);
            btn.addEventListener('click', handleEditarComentarioClick);
        });

        document.querySelectorAll('.eliminar-comentario-btn').forEach(btn => {
            btn.removeEventListener('click', handleEliminarComentarioClick);
            btn.addEventListener('click', handleEliminarComentarioClick);
        });

        document.querySelectorAll('.cancelar-edicion-btn').forEach(btn => {
            btn.removeEventListener('click', handleCancelarEdicionClick);
            btn.addEventListener('click', handleCancelarEdicionClick);
        });
    };

    function hoverStars(container, valor) {
        container.querySelectorAll('.estrella').forEach(el => {
            el.classList.toggle('active', +el.dataset.value <= valor);
        });
    }

    function selectStars(container, valor) {
        container.dataset.calificacion = valor;
        const input = container.nextElementSibling;
        if (input && input.name === 'calificacion') input.value = valor;
        container.querySelectorAll('.estrella').forEach(el => {
            el.classList.toggle('active', +el.dataset.value <= valor);
        });
    }

    function resetStars(container) {
        const cal = +container.dataset.calificacion || 0;
        container.querySelectorAll('.estrella').forEach(el => {
            el.classList.toggle('active', +el.dataset.value <= cal);
        });
    }

    async function handleVerComentarioClick() {
        const contenedorCard = this.closest('.review-container-card');
        const contenido = contenedorCard.querySelector('.comentario-contenido');
        const comentarioExistenteDiv = contenedorCard.querySelector('.comentario-existente');
        const formComentario = contenedorCard.querySelector('.form-comentario');
        const contratoId = contenedorCard.dataset.contratoId;
        const icon = this.querySelector('i');

        if (contenido.style.display === 'none' || contenido.style.display === '') {
            contenido.style.display = 'block';
            if (icon) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }

            try {
                // Intentar obtener el comentario existente
                const respuestaComentario = await fetch(`/api/contratos/comentario/${contratoId}`);
                let dataComentario
                if (respuestaComentario.ok) {
                    dataComentario = await respuestaComentario.json();
                } else {
                    return showMessage('No se pudo obtener el comentario del contrato.', 'error');
                }
                if (dataComentario.count > 0) {
                    comentarioExistenteDiv.classList.remove('preset');
                    comentarioExistenteDiv.style.display = 'block';
                    formComentario.style.display = 'none';

                    contenedorCard.querySelector('.comentario-autor').textContent = dataComentario.nombre_cliente || 'Cliente';
                    contenedorCard.querySelector('.comentario-fecha').textContent = dataComentario.fecha_creacion
                        ? new Date(dataComentario.fecha_creacion).toLocaleDateString()
                        : 'Fecha no disponible';
                    contenedorCard.querySelector('.comentario-texto').textContent = dataComentario.comentario || 'Sin comentario';

                    const estrellas = contenedorCard.querySelectorAll('.calificacion-estrellas-display .estrella-display');
                    estrellas.forEach((estrella, i) => {
                        estrella.innerHTML = i < dataComentario.calificacion ? '&#9733;' : '&#9734;';
                    });

                    contenedorCard.querySelector('.editar-comentario-btn').style.display = 'inline-block';
                    contenedorCard.querySelector('.eliminar-comentario-btn').style.display = 'inline-block';
                } else {
                    // No existing comment, show the form if contract is completed or finalized
                    comentarioExistenteDiv.style.display = 'none';
                    comentarioExistenteDiv.classList.add('preset');
                    const estadoResp = await fetch(`/api/contratos/estado_detalle/${contratoId}`);
                    if (!estadoResp.ok) {
                        throw new Error('No se pudo obtener estado del contrato para mostrar el formulario.');
                    }
                    const estadoData = await estadoResp.json();
                    // Muestra el formulario si el estado es 'completado' o 'finalizado'
                    if (estadoData.estado === 'completado' || estadoData.estado === 'finalizado') {
                        formComentario.style.display = 'block';
                        formComentario.querySelector('textarea').value = '';
                        formComentario.querySelector('.calificacion-estrellas').dataset.calificacion = '0';
                        formComentario.querySelector('input[name="calificacion"]').value = '0';
                        formComentario.querySelectorAll('.calificacion-estrellas .estrella').forEach(s => s.classList.remove('selected'));
                    } else {
                        formComentario.style.display = 'none';
                        contenedorCard.querySelector('.comentario-texto').textContent = 'No hay comentario aún.';
                        contenedorCard.querySelector('.comentario-autor').textContent = 'Autor Desconocido';
                        contenedorCard.querySelector('.comentario-fecha').textContent = 'Fecha Desconocida';
                        contenedorCard.querySelector('.editar-comentario-btn').style.display = 'none';
                        contenedorCard.querySelector('.eliminar-comentario-btn').style.display = 'none';
                        showMessage('No se puede añadir un comentario a este contrato en su estado actual.', 'info');
                    }
                }
            } catch (error) {
                console.error('Error en handleVerComentarioClick:', error);
                comentarioExistenteDiv.style.display = 'none';
                formComentario.style.display = 'none';
                showMessage('Error al cargar la información del comentario. Inténtalo de nuevo más tarde.', 'error');
            }
        } else {
            contenido.style.display = 'none';
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        }
    }
    async function handleComentarioFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        console.log(form)
        const contenedorCard = form.closest('.review-container-card');
        const contratoId = contenedorCard.dataset.contratoId;
        const comentarioTexto = form.querySelector('textarea').value;
        const calificacion = parseInt(form.querySelector('input[name="calificacion"]').value);

        if (!comentarioTexto || calificacion === 0) {
            showMessage('Por favor, escribe un comentario y selecciona una calificación.', 'info');
            console.log('wwweeee')
            return;
        }

        try {
            const isEditing = contenedorCard.querySelector('.editar-comentario-btn').style.display === 'inline-block';

            let response;
            if (isEditing) {
                response = await fetch(`/api/contratos/editar_comentario/${contratoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        comentario: comentarioTexto,
                        calificacion: calificacion
                    })
                });
            } else {
                response = await fetch(`/api/contratos/nuevo_comentario/${contratoId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        comentario: comentarioTexto,
                        calificacion: calificacion
                    })
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar el comentario.');
            }

            showMessage('Comentario guardado exitosamente.', 'success');
            const verComentarioBtn = contenedorCard.querySelector('.ver-comentario-btn');
            verComentarioBtn.click();

        } catch (error) {
            console.error('Error al guardar comentario:', error);
            showMessage(`Error al guardar el comentario: ${error.message}`, 'error');
        }
    }

    async function handleEditarComentarioClick() {
        const contenedorCard = this.closest('.review-container-card');
        const comentarioExistenteDiv = contenedorCard.querySelector('.comentario-existente');
        const formComentario = contenedorCard.querySelector('.form-comentario');
        const comentarioTextoElement = contenedorCard.querySelector('.comentario-texto');
        const estrellasDisplay = contenedorCard.querySelectorAll('.calificacion-estrellas-display .estrella-display');
        const calificacionActual = Array.from(estrellasDisplay).filter(s => s.innerHTML === '★').length;

        comentarioExistenteDiv.style.display = 'none';
        formComentario.style.display = 'block';

        formComentario.querySelector('textarea').value = comentarioTextoElement.textContent;
        formComentario.querySelector('input[name="calificacion"]').value = calificacionActual;

        formComentario.querySelectorAll('.calificacion-estrellas .estrella').forEach(estrella => {
            if (parseInt(estrella.dataset.value) <= calificacionActual) {
                estrella.classList.add('selected');
            } else {
                estrella.classList.remove('selected');
            }
        });
    }

    async function handleEliminarComentarioClick() {
        const contenedorCard = this.closest('.review-container-card');
        const contratoId = contenedorCard.dataset.contratoId;

        showConfirmation('¿Estás seguro de que quieres eliminar este comentario?', async () => {
            try {
                const response = await fetch(`/api/contratos/eliminar_comentario/${contratoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al eliminar el comentario.');
                }

                showMessage('Comentario eliminado exitosamente.', 'success');
                const verComentarioBtn = contenedorCard.querySelector('.ver-comentario-btn');
                verComentarioBtn.click();

            } catch (error) {
                console.error('Error al eliminar comentario:', error);
                showMessage(`Error al eliminar el comentario: ${error.message}`, 'error');
            }
        }, () => {
            console.log('Eliminación de comentario cancelada.');
        });
    }

    function handleCancelarEdicionClick() {
        const contenedorCard = this.closest('.review-container-card');
        const comentarioExistenteDiv = contenedorCard.querySelector('.comentario-existente');
        const formComentario = contenedorCard.querySelector('.form-comentario');
        
        if (!comentarioExistenteDiv.classList.contains('preset')) {
            comentarioExistenteDiv.style.display = 'block';
        }
        formComentario.style.display = 'none';
    }

    initializeCustomModal();

})();
