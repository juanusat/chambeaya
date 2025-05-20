function mostrarFormulario(tipo) {
    const registro = document.getElementById('registro');
    const login = document.getElementById('login');
    const tabs = document.querySelectorAll('.tab-btn');

    if (tipo === 'registro') {
        registro.classList.remove('hidden');
        login.classList.add('hidden');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        registro.classList.add('hidden');
        login.classList.remove('hidden');
        tabs[1].classList.add('active');
        tabs[0].classList.remove('active');
    }
}
document.getElementById('login').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const keepLoggedIn = document.getElementById('keep-logged-in').checked;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            credentials: 'same-origin', // para enviar/recibir cookies
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, remember: keepLoggedIn })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('logged', 'true');
            localStorage.setItem('keepLoggedIn', keepLoggedIn ? 'true' : 'false');

            if (!keepLoggedIn) {
                sessionStorage.setItem('sessionActive', 'true');
            }
            window.location.href = '/';
        } else {
            alert('Error de inicio de sesión: ' + (data.msg || 'Intenta de nuevo'));
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('No se pudo conectar con el servidor.');
    }
});

document.getElementById('registro').addEventListener('submit', async function (e) {
    e.preventDefault(); // Previene que el formulario se envíe de forma tradicional (y recargue la página)

    // Obtener y limpiar los valores de los inputs
    const correo = document.getElementById('correo').value.trim();
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contrasena').value;

    try {
        // Enviamos los datos al servidor usando fetch y await
        const response = await fetch('/api/auth/registro', {
            method: 'POST', // Tipo de solicitud HTTP
            credentials: 'same-origin', // Envía cookies si la URL está en el mismo dominio
            headers: { 'Content-Type': 'application/json' }, // Indicamos que el cuerpo es JSON
            body: JSON.stringify({ correo, nombres, apellidos, fechaNacimiento, usuario, contrasena }) // Convertimos el objeto JS a JSON
        });

        const data = await response.json(); // Esperamos la respuesta del servidor y la convertimos a JSON

        if (response.ok) {
            // Si el registro fue exitoso (HTTP 200-299)
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = '/login'; // Redirige al login o a la página principal
        } else {
            // Si hubo un error, mostramos el mensaje del servidor
            alert('Error al registrarse: ' + (data.msg || 'Intenta de nuevo'));
        }
    } catch (error) {
        // Si falla la conexión con el servidor
        console.error('Error al registrarse:', error);
        alert('No se pudo conectar con el servidor.');
    }
});
