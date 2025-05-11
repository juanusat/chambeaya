
(function () {
    const form = document.querySelector('form.search-bar#searchForm');
    const input = document.getElementById('iptBuscar');
    const tagBtn = form.querySelector('button[type="button"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Al hacer submit (lupa)
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const searchTerm = input.value.trim();
      if (searchTerm) {
        const encoded = encodeURIComponent(searchTerm);
        location.href = `/buscar/${encoded}`;
      }
    });

    // Al clicar el botón de etiqueta (tag)
    tagBtn.addEventListener('click', function () {
      const tagTerm = input.value.trim();
      if (tagTerm) {
        const encoded = encodeURIComponent(tagTerm);
        location.href = `/etiqueta/${encoded}`;
      }
    });
  
})();