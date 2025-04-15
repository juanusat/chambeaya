(function () {
    const appElement = document.querySelector('.app');
    let headerElement = document.createElement('div');
    headerElement.classList.add('header');

    let footerElement = document.createElement('div');
    footerElement.classList.add('footer');

    Promise.all([
        fetch('/templates/header.html').then(res => res.text()),
        fetch('/templates/footer.html').then(res => res.text())
    ]).then(([headerHTML, footerHTML]) => {
        headerElement.innerHTML = headerHTML;
        footerElement.innerHTML = footerHTML;

        appElement.insertBefore(headerElement, appElement.firstChild);
        appElement.appendChild(footerElement);

        appElement.classList.remove('loading');
    }).catch(err => {
        console.error('Error cargando plantillas:', err);
    });
})();

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
