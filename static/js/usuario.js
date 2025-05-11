(function () {
    // Obtener y parsear los datos del usuario desde el elemento con id 'user-data'
    const userData = JSON.parse(document.getElementById('user-data').textContent);
    console.log(userData);

    // Actualizar la imagen del avatar
    const avatarElement = document.querySelector('.avatar');
    if (userData.url_picture) {
        avatarElement.innerHTML = `<img src="/static/upload/${userData.url_picture}" alt="Avatar">`;
    } else {
        avatarElement.innerHTML = '<i class="fa-solid fa-user"></i>'; // Ícono por defecto si no hay imagen
    }

    // Determinar si el usuario es una empresa o una persona
    const isEmpresa = userData.empresa_nombre !== null;

    // Mostrar el nombre del usuario o de la empresa
    const displayName = isEmpresa
        ? (userData.empresa_nombre || 'Empresa desconocida')
        : `${userData.persona_nombre || 'Nombre desconocido'} ${userData.persona_apellido || ''}`.trim();
    document.querySelector('.profile-name').innerText = displayName;

    // Mostrar la descripción del usuario o de la empresa
    const description = isEmpresa
        ? (userData.empresa_descripcion || 'Descripción no disponible')
        : (userData.descripcion || 'Descripción no disponible');
    document.querySelector('.details p').innerText = description;

    // Actualizar el número de teléfono
    const phoneParagraph = Array.from(document.querySelectorAll('.details p')).find(p =>
        p.textContent.includes('Telefono:')
    );
    if (phoneParagraph) {
        phoneParagraph.innerHTML = `<strong>Telefono:</strong> ${userData.persona_telefono || 'No disponible'}`;
    }

    // Actualizar el correo electrónico
    const emailParagraph = Array.from(document.querySelectorAll('.details p')).find(p =>
        p.textContent.includes('Correo:')
    );
    if (emailParagraph) {
        emailParagraph.innerHTML = `<strong>Correo:</strong> ${userData.email || 'No disponible'}`;
    }
})();