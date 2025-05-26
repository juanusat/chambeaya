// public/static/js/crear_contrato.js

window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const precio = params.get("precio");
    const categoriaId = params.get("categoria_id"); 
    const categoriaNombre = params.get("categoria_nombre"); 
    const publicacionId = params.get("publicacion_id"); 
    const tituloPublicacion = params.get("titulo_publicacion"); 

    const precioInput = document.getElementById("precio");
    const servicioIdInput = document.getElementById("servicio_id"); 
    const servicioNombreDisplayInput = document.getElementById("servicio_nombre_display");

    const clienteNombreInput = document.getElementById("cliente_nombre");
    const clienteIdInput = document.getElementById("cliente_id");
    const clientesDatalist = document.getElementById("clientes-list");
    
    const fechaInicioInput = document.getElementById("fecha_inicio");
    const fechaFinalizacionInput = document.getElementById("fecha_finalizacion");

    // Referencia al formulario
    const crearContratoForm = document.querySelector(".crear-contrato-form");

    // --- Lógica para Fechas ---
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

    // --- RELLENAR CAMPOS DE SERVICIO CON DATOS DE LA PUBLICACIÓN ---
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

        // Limpiar el ID oculto y la datalist si la query es muy corta
        if (query.length < 2) { 
            clientesDatalist.innerHTML = "";
            clienteIdInput.value = ""; 
            console.log("Input de cliente < 2 caracteres. Cliente ID limpiado:", clienteIdInput.value); 
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

                // Si no se encontraron usuarios, limpiar el ID oculto
                if (usuarios.length === 0) {
                    clienteIdInput.value = "";
                    console.log("No se encontraron usuarios. Cliente ID limpiado:", clienteIdInput.value); 
                }

                // *** IMPORTANTE: Verificar y asignar el ID después de cargar las opciones ***
                // Esto es crucial para cuando el usuario escribe un nombre completo que coincide con una opción
                // o para asegurar que la selección de la datalist actualiza el ID inmediatamente.
                const currentInputValue = clienteNombreInput.value;
                const matchedOption = clientesDatalist.querySelector(`option[value="${currentInputValue}"]`);
                if (matchedOption) {
                    clienteIdInput.value = matchedOption.dataset.id;
                    console.log(`ID asignado desde 'input' después de cargar opciones: ${clienteIdInput.value}`);
                } else {
                    // Si el valor actual del input no coincide con ninguna opción, limpiar el ID
                    clienteIdInput.value = ""; 
                    console.log("El valor del input no coincide con una opción de la lista. Cliente ID limpiado:", clienteIdInput.value);
                }


            } catch (error) {
                console.error("Error al buscar usuarios:", error);
                clientesDatalist.innerHTML = "";
                clienteIdInput.value = "";
            }
        }, AUTOCOMPLETE_DELAY);
    });

    // Se mantiene el 'change' por robustez, pero la lógica principal de asignación de ID
    // ahora está en el evento 'input' en el setTimeout.
    clienteNombreInput.addEventListener("change", () => {
        const selectedOption = clientesDatalist.querySelector(`option[value="${clienteNombreInput.value}"]`);
        if (selectedOption) {
            // El ID ya debería haberse asignado por el evento 'input' más arriba
            // pero esto sirve como una confirmación o fallback.
            clienteIdInput.value = selectedOption.dataset.id; 
            console.log(`Cliente seleccionado (vía change event): ${clienteNombreInput.value} con ID: ${clienteIdInput.value}`); 
        } else {
            clienteIdInput.value = ""; 
            console.log("Cliente no válido o no seleccionado de la lista (vía change event). Cliente ID limpiado:", clienteIdInput.value); 
        }
    });

    const closeButton = document.querySelector(".close-button");
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            window.history.back();
        });
    }

    // --- Lógica: Manejo del envío del formulario ---
    crearContratoForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Previene el envío tradicional del formulario

        // 1. Recoger datos del formulario
        const dataToSend = {
            servicio_id: servicioIdInput.value,
            cliente_id: clienteIdInput.value,
            precio: parseFloat(precioInput.value), 
            fecha_inicio: fechaInicioInput.value,
            fecha_finalizacion: fechaFinalizacionInput.value,
            estado: document.getElementById("estado").value 
        };

        console.log("Datos a enviar:", dataToSend); // Depuración: Confirma los datos finales

        // 2. Validar campos vacíos y lógica adicional
        if (!dataToSend.servicio_id) {
            alert("Error: El ID del servicio (publicación) no está presente. Recarga la página.");
            return;
        }
        if (!dataToSend.cliente_id) {
            alert("Por favor, selecciona un cliente válido de la lista de sugerencias que aparece mientras escribes.");
            console.error("Validación fallida: cliente_id está vacío."); // Depuración
            return;
        }
        if (isNaN(dataToSend.precio) || dataToSend.precio <= 0) {
            alert("Por favor, ingresa un precio válido y mayor a cero.");
            return;
        }
        if (!dataToSend.fecha_inicio) {
            alert("Por favor, selecciona la fecha de inicio del contrato.");
            return;
        }
        if (!dataToSend.fecha_finalizacion) {
            alert("Por favor, selecciona la fecha de finalización del contrato.");
            return;
        }
        
        // Validación de fechas lógicas
        if (new Date(dataToSend.fecha_inicio) >= new Date(dataToSend.fecha_finalizacion)) {
            alert("La fecha de finalización debe ser posterior a la fecha de inicio.");
            return;
        }

        // 3. Enviar datos a la ruta de Flask
        try {
            const response = await fetch("/api/contratos/nuevo_contrato", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Contrato registrado con éxito. ID del contrato: ${result.contrato_id}`);
                crearContratoForm.reset(); 
                servicioNombreDisplayInput.value = ""; 
                clienteIdInput.value = ""; 
                clientesDatalist.innerHTML = ""; 
            } else {
                const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
                alert(`Error al registrar contrato: ${errorData.message || 'Por favor, inténtalo de nuevo.'}`);
                console.error("Error response from server:", errorData);
            }
        } catch (error) {
            console.error("Error al enviar el contrato (red o servidor):", error);
            alert("Ocurrió un error de red o del servidor. Por favor, inténtalo de nuevo.");
        }
    });
    // --- FIN DE LA LÓGICA DE ENVÍO ---

});