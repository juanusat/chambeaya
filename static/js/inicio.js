(function () {
    if (window.siteA) {
        const form = document.querySelector('.search-box-container');
        const input = document.getElementById('iptTrabajo');

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const searchTerm = input.value.trim();
            if (searchTerm) {
                const encodedTerm = encodeURIComponent(searchTerm);
                location.href = `/buscar/${encodedTerm}`;
            }
        });

    }
})()