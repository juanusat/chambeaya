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
                        <button class="delete-btn" aria-label="Eliminar publicación">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        <h3 class="job-title">${pub.titulo}</h3>
                        <div class="tag"><i class="fa-solid fa-tag"></i>${pub.categoria}</div>
                    </div>
                    <div class="price">Precio: $${pub.precio}</div>
                    <p>${pub.descripcion}</p>
                    <div class="nuevo-contrato-container">
                        <a href="/crear-contrato" class="nuevo-contrato-btn">
                            <span>Nuevo contrato</span>
                        </a>
                    </div>
                `;

                // Agregar evento al botón de eliminación
                const deleteBtn = card.querySelector(".delete-btn");
                deleteBtn.addEventListener("click", () => {
                    if (confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
                        fetch(`/api/publicaciones/borrar_publicacion/${pub.id}`, {
                            method: "DELETE",
                        })
                            .then(response => {
                                if (response.ok) {
                                    card.remove();
                                    alert("Publicación eliminada con éxito.");
                                } else {
                                    alert("Error al eliminar la publicación.");
                                }
                            })
                            .catch(error => {
                                console.error("Error al eliminar la publicación:", error);
                                alert("Error al eliminar la publicación.");
                            });
                    }
                });

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error al cargar publicaciones:", error);
        });
})();
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
                        <button class="delete-btn" aria-label="Dar de baja publicación">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        <h3 class="job-title">${pub.titulo}</h3>
                        <div class="tag"><i class="fa-solid fa-tag"></i>${pub.categoria}</div>
                    </div>
                    <div class="price">Precio: $${pub.precio}</div>
                    <p>${pub.descripcion}</p>
                    <div class="nuevo-contrato-container">
                        <a href="/crear-contrato" class="nuevo-contrato-btn">
                            <span>Nuevo contrato</span>
                        </a>
                    </div>
                `;

                // Agregar evento al botón de dar de baja
                const deleteBtn = card.querySelector(".delete-btn");
                deleteBtn.addEventListener("click", () => {
                    if (confirm("¿Estás seguro de que deseas dar de baja esta publicación?")) {
                        fetch(`/api/publicaciones/dar_baja_publicacion/${pub.id}`, {
                            method: "PUT",
                        })
                            .then(response => {
                                if (response.ok) {
                                    card.remove();
                                    alert("Publicación dada de baja con éxito.");
                                } else {
                                    alert("Error al dar de baja la publicación.");
                                }
                            })
                            .catch(error => {
                                console.error("Error al dar de baja la publicación:", error);
                                alert("Error al dar de baja la publicación.");
                            });
                    }
                });

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error al cargar publicaciones:", error);
        });
})();

