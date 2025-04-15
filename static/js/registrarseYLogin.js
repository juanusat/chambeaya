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