const profileIcon = document.querySelector('.header picture');
        const dropdownMenu = document.querySelector('.header #dropdownMenu');

        profileIcon.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!profileIcon.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
        document.querySelector("#btnLogut").addEventListener('click', function () {
            fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            }).then(res => {
                if (res.ok) {
                    window.location.href = '/';
                }
            });
        })