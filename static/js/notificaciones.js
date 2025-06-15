document.addEventListener('DOMContentLoaded', function() {
    if (!!window.no_notifications) {
        return false
    }

    const notificationBellLink = document.getElementById('notification-bell-link');
    const notificationBellIcon = document.getElementById('notification-bell-icon');
    const notificationBellBadge = document.getElementById('notification-bell-badge');

    if (!notificationBellLink || !notificationBellIcon || !notificationBellBadge) {
        return;
    }

    fetch('/api/notificaciones/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`🚫 [Notificaciones JS] Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // console.log('🔍 [Notificaciones JS] Datos recibidos:', data);
        })
        .catch(error => {
            console.error('❌ [Notificaciones JS] Error en fetch o procesamiento de datos:', error);
        });

    // Para que se repita cada 5 segundos
    setInterval(function() {
        fetch('/api/notificaciones/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`🚫 [Notificaciones JS] Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                     notificationBellLink.classList.add('has-notifications');
                 } else {
                     notificationBellLink.classList.remove('has-notifications');
                 }
            })
            .catch(error => {
                console.error('❌ [Notificaciones JS] Error en chequeo repetido:', error);
            });
    }, 2000);
});