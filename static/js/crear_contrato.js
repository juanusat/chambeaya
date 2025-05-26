
window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const precio = params.get("precio");
    const categoriaId = params.get("categoria_id"); 
    const categoriaNombre = params.get("categoria_nombre"); 
    const publicacionId = params.get("publicacion_id"); 
    const tituloPublicacion = params.get("titulo_publicacion"); 
    // alert(`Titulo : ${tituloPublicacion} con ID: ${publicacionId}`); 

    const precioInput = document.getElementById("precio");
    const servicioIdInput = document.getElementById("servicio_id"); 
    const servicioNombreDisplayInput = document.getElementById("servicio_nombre_display");

    const clienteNombreInput = document.getElementById("cliente_nombre");
    const clienteIdInput = document.getElementById("cliente_id");
    const clientesDatalist = document.getElementById("clientes-list");
 
    const fechaInicioInput = document.getElementById("fecha_inicio");
    const fechaFinalizacionInput = document.getElementById("fecha_finalizacion");


    // --- Lógica para Fechas (sin cambios) ---
    const today = new Date();
    today.setDate(today.getDate() + 1); 
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;

    if (fechaInicioInput) {
        fechaInicioInput.setAttribute("min", minDate);
    }
    if (fechaFinalizacionInput) {
        fechaFinalizacionInput.setAttribute("min", minDate);
    }

    fechaInicioInput.addEventListener('change', () => {
        if (fechaInicioInput.value) {
            const minFechaFinalizacion = new Date(fechaInicioInput.value);
            minFechaFinalizacion.setDate(minFechaFinalizacion.getDate() + 1); 

            const f_year = minFechaFinalizacion.getFullYear();
            const f_month = String(minFechaFinalizacion.getMonth() + 1).padStart(2, '0');
            const f_day = String(minFechaFinalizacion.getDate()).padStart(2, '0');
            const newMinFinalizacion = `${f_year}-${f_month}-${f_day}`;
            
            fechaFinalizacionInput.setAttribute('min', newMinFinalizacion);

            if (fechaFinalizacionInput.value < newMinFinalizacion) {
                fechaFinalizacionInput.value = newMinFinalizacion;
            }
        } else {
            fechaFinalizacionInput.setAttribute("min", minDate);
        }
    });
    // --- Fin de Lógica para Fechas ---


    if (precio) {
        precioInput.value = precio;
    }

    // --- RELLENAR CAMPOS DE SERVICIO CON DATOS DE LA PUBLICACIÓN (sin cambios relevantes aquí) ---
    if (publicacionId) { 
        servicioIdInput.value = publicacionId; 
        
        if (servicioNombreDisplayInput) {
            servicioNombreDisplayInput.value = decodeURIComponent(tituloPublicacion || 'Servicio no especificado');
        }
    } else {
        if (categoriaId) {
            servicioIdInput.value = categoriaId; 
            if (servicioNombreDisplayInput) {
                servicioNombreDisplayInput.value = decodeURIComponent(categoriaNombre || 'No especificado');
            }
        } else {
            if (servicioNombreDisplayInput) {
                servicioNombreDisplayInput.value = "Servicio no especificado";
            }
        }
    }
    // --- FIN RELLENAR CAMPOS DE SERVICIO ---


    let debounceTimer;
    const AUTOCOMPLETE_DELAY = 300; 

    clienteNombreInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        const query = clienteNombreInput.value.trim();

        if (query.length < 2) { 
            clientesDatalist.innerHTML = "";
            clienteIdInput.value = ""; 
            return;
        }

        debounceTimer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/usuarios/buscar_autocompletar?q=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    throw new Error(`Error HTTP! Estado: ${response.status}`);
                }
                const usuarios = await response.json();

                clientesDatalist.innerHTML = "";
                usuarios.forEach(user => {
                    const option = document.createElement("option");
                    option.value = user.nombre; 
                    option.dataset.id = user.id; 
                    clientesDatalist.appendChild(option);
                });

                if (usuarios.length === 0) {
                    clienteIdInput.value = "";
                }

            } catch (error) {
                console.error("Error al buscar usuarios:", error);
                clientesDatalist.innerHTML = "";
                clienteIdInput.value = "";
            }
        }, AUTOCOMPLETE_DELAY);
    });

    clienteNombreInput.addEventListener("change", () => {
        const selectedOption = clientesDatalist.querySelector(`option[value="${clienteNombreInput.value}"]`);
        if (selectedOption) {
            const userId = selectedOption.dataset.id;
            clienteIdInput.value = userId; 
            // --- AQUI ES DONDE PUEDES VISUALIZAR EL ID DEL CLIENTE ---
            //console.log(`Cliente seleccionado - ID: ${clienteIdInput.value}, Nombre: ${clienteNombreInput.value}`);
            // O si prefieres una alerta temporal:
            alert(`Cliente seleccionado: ${clienteNombreInput.value} con ID: ${clienteIdInput.value}`);
            // --- FIN DE LA VISUALIZACIÓN ---
        } else {
            clienteIdInput.value = ""; 
        }
    });

    const closeButton = document.querySelector(".close-button");
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            window.history.back();
        });
    }
});