(function () {
    window.addEventListener('dblclick', function(event) {
        if (event.altKey) {
            window.no_notifications = !window.no_notifications || false
        }
    })
    window.siteA = ['4250', '4251'].includes(location.port) || location.origin.includes('pythonanywhere')

    const appElement = document.querySelector('.app');
    let headerElement = document.querySelector('.header');
    let footerElement = document.querySelector('.footer');

    if (!headerElement) {
        headerElement = document.createElement('div');
        headerElement.classList.add('header');
    }

    if (!footerElement) {
        footerElement = document.createElement('div');
        footerElement.classList.add('footer');
    }

    const shouldLoadHeader = headerElement.innerHTML.trim() === '';
    const shouldLoadFooter = footerElement.innerHTML.trim() === '';

    if (!shouldLoadHeader && !shouldLoadFooter) {
        appElement.classList.remove('loading');
        return;
    }

    const headerPromise = shouldLoadHeader
        ? fetch('/static/templates/header.html').then(res => res.text())
        : Promise.resolve(headerElement.innerHTML);

    const footerPromise = shouldLoadFooter
        ? fetch('/static/templates/footer.html').then(res => res.text())
        : Promise.resolve(footerElement.innerHTML);

    Promise.all([headerPromise, footerPromise])
        .then(([headerHTML, footerHTML]) => {
            if (shouldLoadHeader) {
                headerElement.innerHTML = headerHTML;
                appElement.insertBefore(headerElement, appElement.firstChild);
            }

            if (shouldLoadFooter) {
                footerElement.innerHTML = footerHTML;
                appElement.appendChild(footerElement);
            }

            appElement.classList.remove('loading');
        })
        .catch(err => {
            console.error('Error cargando plantillas:', err);
        });
})();
