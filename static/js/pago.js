document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const contratoId = params.get('contrato_id');

    if (!contratoId) {
        alert('No se especificó el contrato a pagar.');
        return;
    }

    const btnFinalizarPago = document.querySelector('.btn-pago');
    const btnPaypal = document.querySelector('.btn-paypal');  // Asegúrate de que este botón exista
    const metodoPagoSelect = document.getElementById('metodo-pago');
    const inputPago = document.getElementById('input-pago'); // Input de pago
    const tabla = document.querySelector('.resumen-contrato table'); // Tabla donde mostramos los datos del contrato

    // Inicialmente, deshabilitar "Finalizar Pago"
    if (btnFinalizarPago) {
        btnFinalizarPago.disabled = true;
        btnFinalizarPago.style.opacity = '0.5'; // Mostrar el botón con opacidad para indicar que está inhabilitado
    }

    // Función para mostrar el formulario correspondiente al método seleccionado
    function mostrarFormulario(metodoId) {
        // Ocultar todos los formularios de método
        const formulariosMetodo = document.querySelectorAll('#payment-form .metodo-form');
        formulariosMetodo.forEach(form => {
            form.style.display = 'none';
            form.querySelectorAll('input').forEach(input => {
                if (input.hasAttribute('required')) {
                    input.setAttribute('data-required', 'true'); // Guarda que era requerido
                    input.removeAttribute('required');
                }
            });
        });

        // Mostrar el formulario correspondiente
        const formularioActual = document.getElementById(metodoId + '-form');
        if (formularioActual) {
            formularioActual.style.display = 'block';
            formularioActual.querySelectorAll('input[data-required]').forEach(input => {
                input.setAttribute('required', 'required');
                input.removeAttribute('data-required'); // Limpia el atributo temporal
            });
        }

        // Si se selecciona PayPal, mostrar el botón "CONTINUAR CON PAYPAL"
        if (metodoId === 'paypal') {
            if (btnPaypal) {
                btnPaypal.style.display = 'block'; // Mostrar el botón de PayPal
            }
            // Deshabilitar el botón "Finalizar Pago" al principio
            if (btnFinalizarPago) {
                btnFinalizarPago.disabled = true;
                btnFinalizarPago.style.opacity = '0.5'; // Inhabilitar con opacidad
            }
        } else {
            if (btnPaypal) {
                btnPaypal.style.display = 'none'; // Ocultar el botón de PayPal
            }
            // Habilitar el botón "Finalizar Pago" si no es PayPal
            if (btnFinalizarPago) {
                btnFinalizarPago.disabled = false;
                btnFinalizarPago.style.opacity = '1'; // Habilitar con opacidad normal
            }
        }
    }

    // Mostrar formulario inicial según selección por defecto
    mostrarFormulario(metodoPagoSelect.value);

    // Cambio de formulario al seleccionar un método de pago
    metodoPagoSelect.addEventListener('change', function () {
        mostrarFormulario(this.value);
    });

    // **Configuración del botón "CONTINUAR CON PAYPAL"**
    if (btnPaypal) {
        btnPaypal.addEventListener('click', function (event) {
            event.preventDefault(); // Evitar que el formulario se envíe

            // Habilitar el botón "Finalizar Pago" solo cuando se haga clic en "CONTINUAR CON PAYPAL"
            if (btnFinalizarPago) {
                btnFinalizarPago.disabled = false;
                btnFinalizarPago.style.opacity = '1'; // Restaurar opacidad normal
            }
        });
    }

    // --- Obtener contrato y completar datos en la tabla resumen ---
    try {
        const response = await fetch(`/api/contratos/${contratoId}`, {
            credentials: 'include' // si usas cookies para auth
        });

        if (!response.ok) throw new Error('Contrato no encontrado');

        const contrato = await response.json();

        // Completar datos en la tabla resumen
        document.querySelector('.resumen-contrato h3').textContent = `Tu Contrato (ID: ${contratoId})`;

        const destinatario = contrato.empleador || contrato.cliente || 'Desconocido';
        const servicio = contrato.servicio || 'Servicio desconocido';
        const precio = parseFloat(contrato.precio);
        const cantidadPagada = parseFloat(contrato.precio_pagado) || 0;

        // Aquí ya no es necesario crear un nuevo input, solo actualizamos el original
        if (inputPago) {
            inputPago.max = (precio - cantidadPagada).toFixed(2);  // Establecer el valor máximo al input existente
            inputPago.value = (precio - cantidadPagada).toFixed(2);  // Establecer el valor por defecto
        }

        document.getElementById('destinatario').textContent = destinatario;
        document.getElementById('servicio').textContent = servicio;

        // Validar que no se ingrese más que el precio máximo
        inputPago.addEventListener('input', () => {
            let val = parseFloat(inputPago.value);
            if (isNaN(val) || val < 0) {
                inputPago.value = '';
            } else if (val > (precio - cantidadPagada)) {
                inputPago.value = (precio - cantidadPagada).toFixed(2);
            }
        });

    } catch (error) {
        alert('Error al cargar el contrato: ' + error.message);
        console.error(error);
    }

    // --- Generación de Comprobante y Redirección ---
    btnFinalizarPago.addEventListener('click', async (event) => {
        event.preventDefault();

        const montoPago = parseFloat(inputPago.value);
        const metodoPago = metodoPagoSelect.value;

        if (isNaN(montoPago) || montoPago <= 0) {
            alert("Por favor, ingresa una cantidad válida.");
            return;
        }

        // Obtener la fecha actual y formatearla al formato de MySQL 'YYYY-MM-DD HH:MM:SS'
        const fechaPago = new Date().toISOString().slice(0, 19).replace('T', ' ');

        try {
            const comprobanteData = {
                contrato_id: contratoId,
                monto: montoPago,
                metodo_pago_id: metodoPago === 'tarjeta' ? 1 : metodoPago === 'paypal' ? 2 : 3,
                fecha_pago: fechaPago
            };

            const response = await fetch('/api/comprobante_pago', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(comprobanteData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error al generar el comprobante:', errorData.error);
                alert('Error al procesar el pago: ' + (errorData.error || 'Error desconocido'));
                return;
            }

            // Redirigir a mis-contratos.html tras éxito
            window.location.href = '/mis-contratos.html';
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Error al procesar el pago: ' + error.message);
        }
    });

});
