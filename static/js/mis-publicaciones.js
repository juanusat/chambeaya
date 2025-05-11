(function () {

    fetch(`/api/publicaciones`)
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector(".publicaciones");
            console.log(container);
            if (!container) return;

            data.forEach(pub => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                        <div class="card-header">
                            <h3 class="job-title">${pub.titulo}</h3>
                            <div class="tag"><i class="fa-solid fa-tag"></i>${pub.categoria}</div>
                        </div>

                        <div class="card-details-row">
                            <div class="provider-info">
                                <span class="provider-name">${pub.nombre_usuario}</span>
                                <div class="provider-circle"></div>
                            </div>
                            <div class="price-tag">Precio: <span>${pub.precio}</span></div>
                            <div class="fecha-post">Publicado el: <span>${new Date(pub.fecha_creacion).toLocaleDateString()}</span></div>
                        </div>

                        <div class="job-description">
                            <p>${pub.descripcion}</p>
                        </div>
                    `;
                console.log(card);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error al cargar publicaciones:", error);
        });

})()