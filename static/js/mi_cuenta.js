(function () {
    // Obtener y parsear los datos del usuario desde el elemento con id 'user-data'
    const userData = JSON.parse(document.getElementById('user-data').textContent);
    console.log(userData);
    // Actualizar la información de la cuenta
    const infoCuentaDiv = document.querySelector('.info-cuenta');
    if (infoCuentaDiv) {
        const nombre = userData.persona_nombre
            ? `${userData.persona_nombre} ${userData.persona_apellido || ''}`.trim()
            : userData.empresa_nombre || 'Nombre no disponible';

        const ocupacion = userData.descripcion || 'Ocupación no disponible';
        const porcentajePerfil = userData.porcentaje_perfil || '0';

        infoCuentaDiv.innerHTML = `
            <h2>${nombre}</h2>
            <p>${ocupacion}</p>
            <h3>Perfil completado <span>${porcentajePerfil}%</span></h3>
        `;
    }
})();