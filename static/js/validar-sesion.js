(function () {
    return false
    const logged = localStorage.getItem('logged');
    const keep = localStorage.getItem('keepLoggedIn');
    const sessionOn = sessionStorage.getItem('sessionActive');

    if (logged === 'true' && keep === 'false' && !sessionOn) {
        localStorage.removeItem('logged');
        localStorage.removeItem('keepLoggedIn');
        fetch('/api/auth/logout', { method: 'POST' })
            .finally(() => window.location.href = '/acceder');
    }
})()