// Función para habilitar/deshabilitar inputs al hacer clic en su botón
document.querySelectorAll(".input-container button, .input-container-descripcion button").forEach(button => {
    button.addEventListener("click", function () {
        let input = this.previousElementSibling;
        input.disabled = !input.disabled;
        if (!input.disabled) {
            input.focus();
        }
    });
});

document.querySelector(".confirmar").addEventListener("click", async function () {
    let inputsHabilitados = document.querySelectorAll("input:not([disabled]), textarea:not([disabled])");

    let promesas = [];
    inputsHabilitados.forEach(input => {
        console.log(`Campo habilitado: ${input.name} con valor: ${input.value}`);

        let datos = {};
        let url = "";

        switch (input.name) {
            case "correo":
                datos = { email: input.value };
                url = "/api/usuario/actualizar_email";
                break;
            case "clave":
                datos = { password: input.value };
                url = "/api/auth/actualizar_password";
                break;
            case "descripcion":
                datos = { descripcion: input.value };
                url = "/api/usuario/actualizar_descripcion";
                break;
            default:
                console.log("Input no reconocido");
                return;
        }
        promesas.push(enviarDatos(url, datos));
    });

    try {
        await Promise.all(promesas);
        alert("Datos actualizados");
    } catch (error) {
        console.error("Error al modificar datos:", error);
        alert("Error al modificar datos");
    }
});

async function enviarDatos(url, datos) {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        throw new Error(`Error en la solicitud a ${url}`);
    }
}