(function () {
    fetch(`/api/publicaciones`)
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector(".publicaciones");
            if (!container) return;

            // Limpia el contenedor antes de agregar nuevas publicaciones
            container.innerHTML = '';

            if (data.length === 0) {
                container.innerHTML = '<p>No tienes publicaciones aún.</p>';
                return;
            }

            data.forEach(pub => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <div class="card-header">
                        <h3 class="job-title">${pub.titulo}</h3>
                        <div class="tag"><i class="fa-solid fa-tag"></i>${pub.categoria}</div>
                    </div>
                    <div class="price">Precio: $${pub.precio}</div>
                    <p>${pub.descripcion}</p>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error al cargar publicaciones:", error);
        });
})();