(function () {
    const userData = JSON.parse(document.getElementById('user-data').textContent);
    console.log(userData);

    const avatarElement = document.querySelector('.avatar');
    if (userData.url_picture) {
        avatarElement.innerHTML = `<img src="/static/uploads/${userData.url_picture}" alt="Avatar">`;
    } else {
        avatarElement.innerHTML = '<i class="fa-solid fa-user"></i>'; 
    }

    const isEmpresa = userData.empresa_nombre !== null;

    const displayName = isEmpresa
        ? (userData.empresa_nombre || 'Empresa desconocida')
        : `${userData.persona_nombre || 'Nombre desconocido'} ${userData.persona_apellido || ''}`.trim();
    document.querySelector('.profile-name').innerText = displayName;

    document.querySelector('.details p').innerText = userData.descripcion;

    const phoneParagraph = Array.from(document.querySelectorAll('.details p')).find(p =>
        p.textContent.includes('Telefono:')
    );
    if (phoneParagraph) {
        phoneParagraph.innerHTML = `<strong>Telefono:</strong> ${userData.persona_telefono || 'No disponible'}`;
    }

    const emailParagraph = Array.from(document.querySelectorAll('.details p')).find(p =>
        p.textContent.includes('Correo:')
    );
    if (emailParagraph) {
        emailParagraph.innerHTML = `<strong>Correo:</strong> ${userData.email || 'No disponible'}`;
    }
})();
(function () {
   const userData = JSON.parse(document.getElementById('user-data').textContent);
    fetch(`api/publicaciones/pubs_username/${userData.username}`)
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector(".publicaciones");
            if (!container) return console.warn("No se encontró el contenedor .publicaciones");

            // Limpia el contenedor antes de agregar nuevas publicaciones
            container.innerHTML = '';

            if (data.length === 0) {
                container.innerHTML = '<p>No tienes publicaciones aún.</p>';
                return;
            }

            // Iteramos sobre las publicaciones y creamos las tarjetas
            data.forEach(pub => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <div class="card-header">
                        <h3 class="job-title">${pub.titulo}</h3>
                    </div>
                    <div class="tag"><i class="fa-solid fa-tag"></i>${pub.categoria}</div>
                    <div class="card-details-row">
                        <div class="price-tag">Precio: <span>$${pub.precio || '0'}</span></div>
                    </div>
                    <div class="card-description">
                        <p>${pub.descripcion || 'Sin descripción disponible.'}</p>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error al cargar publicaciones:", error);
        });
})();