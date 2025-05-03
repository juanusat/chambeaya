(function() {
    const logged = localStorage.getItem('logged');
    const keep = localStorage.getItem('keepLoggedIn');
    const sessionOn = sessionStorage.getItem('sessionActive');
  
    // Si existía un login NO persistente, pero sessionStorage ya expiró...
    if (logged === 'true' && keep === 'false' && !sessionOn) {
      // Limpiamos flags
      localStorage.removeItem('logged');
      localStorage.removeItem('keepLoggedIn');
      // Pedimos al backend que borre la cookie
      fetch('/api/auth/logout', { method: 'POST' })
        .finally(() => window.location.href = '/acceder');
    }
    // En modo persistente (keep==='true') no hacemos nada:
    // la cookie sigue válida y el backend la respeta.
})()