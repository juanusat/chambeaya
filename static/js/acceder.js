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