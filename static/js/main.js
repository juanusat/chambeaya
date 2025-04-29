(function () {
    const appElement = document.querySelector('.app');
    let headerElement = document.createElement('div');
    headerElement.classList.add('header');

    let footerElement = document.createElement('div');
    footerElement.classList.add('footer');

    Promise.all([
        fetch('/static/templates/header.html').then(res => res.text()),
        fetch('/static/templates/footer.html').then(res => res.text())
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