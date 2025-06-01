window.configurarBotonesComentarios = function() {
    document.querySelectorAll('.ver-comentario-btn').forEach(boton => {
        boton.addEventListener('click', async () => {
            const contenedorCard = boton.closest('.review-container-card');
            const contenido = contenedorCard.querySelector('.comentario-contenido');
            const contratoId = contenedorCard.dataset.contratoId;

            if (contenido.style.display === 'none') {
                contenido.style.display = 'block';

                try {
                    const respuesta = await fetch(`api/contratos/comentario/${contratoId}`);
                    if (!respuesta.ok) throw new Error('No hay comentario');

                    const data = await respuesta.json();

                    contenedorCard.querySelector('.comentario-autor').textContent = data.nombre_cliente || 'Cliente';
                    contenedorCard.querySelector('.comentario-fecha').textContent = data.fecha_creacion
                        ? new Date(data.fecha_creacion).toLocaleDateString()
                        : 'Fecha no disponible';
                    contenedorCard.querySelector('.comentario-texto').textContent = data.comentario || 'Sin comentario';

                    const estrellas = contenedorCard.querySelectorAll('.calificacion-estrellas-display .estrella-display');
                    estrellas.forEach((estrella, i) => {
                        estrella.innerHTML = i < data.calificacion ? '&#9733;' : '&#9734;';
                    });

                    contenedorCard.querySelector('.editar-comentario-btn').style.display = 'inline-block';
                    contenedorCard.querySelector('.eliminar-comentario-btn').style.display = 'inline-block';

                    // Oculta el formulario para nuevos comentarios porque ya hay uno
                    const formComentario = contenedorCard.querySelector('.form-comentario');
                    if (formComentario) formComentario.style.display = 'none';

                } catch (error) {
                    // No hay comentario, consultar estado
                    try {
                        const estadoResp = await fetch(`api/contratos/estado_detalle/${contratoId}`);
                        if (!estadoResp.ok) throw new Error('No se pudo obtener estado');
                        const estadoData = await estadoResp.json();

                        if (estadoData.estado === 'finalizado') {
                            const formComentario = contenedorCard.querySelector('.form-comentario');
                            if (formComentario) formComentario.style.display = 'block';
                        } else {
                            // Contrato no finalizado, no mostrar formulario
                            const formComentario = contenedorCard.querySelector('.form-comentario');
                            if (formComentario) formComentario.style.display = 'none';
                        }

                    } catch (estadoError) {
                        console.error('Error obteniendo estado:', estadoError);
                    }

                    contenedorCard.querySelector('.comentario-texto').textContent = 'No hay comentario aún.';
                    contenedorCard.querySelector('.comentario-autor').textContent = 'Autor Desconocido';
                    contenedorCard.querySelector('.comentario-fecha').textContent = 'Fecha Desconocida';
                    contenedorCard.querySelector('.editar-comentario-btn').style.display = 'none';
                    contenedorCard.querySelector('.eliminar-comentario-btn').style.display = 'none';
                }

            } else {
                contenido.style.display = 'none';
            }
        });
    });
};

window.configurarBotonesComentarios = configurarBotonesComentarios;
