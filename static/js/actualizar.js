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

// Función para detectar todos los inputs habilitados y enviar los datos correspondientes
document.querySelector(".confirmar").addEventListener("click", async function () {
    let inputsHabilitados = document.querySelectorAll("input:not([disabled]), textarea:not([disabled])");

    inputsHabilitados.forEach(input => {
        console.log(`Campo habilitado: ${input.name} con valor: ${input.value}`);

        let datos = {}; // Inicializa el objeto de datos vacío

        switch (input.name) {
            case "correo":
                const email = input.value; 
                datos = {email};
                enviarDatos('/api/auth/actualizar_email', datos);
                break;
            case "clave":
                const  password = input.value; 
                datos = {password};
                enviarDatos("/api/auth/actualizar_password", datos);
                break;
            case "descripcion":
                const descripcion = input.value;
                datos = {descripcion};
                enviarDatos("/api/auth/actualizar_descripcion", datos);
                break;
            default:
                console.log("Input no reconocido");
        }
    });
});

// Función para enviar datos al servidor
async function enviarDatos(url, datos) {
    try{
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin', // para enviar/recibir cookies
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        alert("Datos actualizados")
    }catch (error) {
        console.error("Error al modificar datos:", error);
        alert("Error al modificar datos");
    };
}
