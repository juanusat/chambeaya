(function() {
    // Realizamos un fetch al endpoint que devuelve las categorías
    fetch('/api/categoria')
        .then(response => response.json()) // Convertimos la respuesta en formato JSON
        .then(data => {
            const categoriaSelect = document.getElementById("categoria");

            // Recorremos las categorías y las agregamos al select
            data.forEach(categoria => {
                const option = document.createElement("option");
                option.value = categoria.categoria_id; // El valor de la opción es el ID de la categoría
                option.textContent = categoria.nombre; // El texto visible es el nombre de la categoría
                categoriaSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error al cargar las categorías:", error);
        });
})();

document.querySelector(".submit-button").addEventListener("click", function () {
    const titulo = document.getElementById("title").value;
    const descripcion = document.getElementById("description").value;
    const precio = document.getElementById("price").value;
    const categoria_id = Number(document.getElementById("categoria").value)
    // Asegúrate de tener estos valores definidos

    const datos = {
        titulo,
        descripcion,
        precio,
        categoria_id
    };

    fetch("/api/publicaciones/nueva_publicacion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Publicación creada con ID:", data.publicacion_id);
        alert("¡Publicación exitosa!");
        window.location.href = "/mis-publicaciones"; // Redirecciona si quieres
    })
    .catch(err => {
        console.error("Error al crear publicación:", err);
        alert("Error al crear publicación");
    });
});
