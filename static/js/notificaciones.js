// static/js/notificaciones.js

console.log('🚀 [Notificaciones JS] Script inicializado - Prueba 1.');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 [Notificaciones JS] DOMContentLoaded disparado - Prueba 2.');

    const notificationBellLink = document.getElementById('notification-bell-link');
    const notificationBellIcon = document.getElementById('notification-bell-icon');
    const notificationBellBadge = document.getElementById('notification-bell-badge');

    if (!notificationBellLink || !notificationBellIcon || !notificationBellBadge) {
        console.warn('⚠️ [Notificaciones JS] Elementos de la campana no encontrados en el DOM. Revisa IDs.');
        return; // Detener la ejecución si los elementos no están.
    }

    console.log('✅ [Notificaciones JS] Elementos de la campana encontrados - Prueba 3.');

    // Intentamos la llamada fetch de la manera más sencilla posible
    fetch('/api/notificaciones/') // Sin el segundo argumento de opciones
        .then(response => {
            console.log('🌐 [Notificaciones JS] Fetch completado. Estado:', response.status);
            if (!response.ok) {
                throw new Error(`🚫 [Notificaciones JS] Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('🔍 [Notificaciones JS] Datos recibidos:', data);
            // Aquí iría tu lógica para cambiar el color de la campana
            // Por ahora, solo queremos ver este log
        })
        .catch(error => {
            console.error('❌ [Notificaciones JS] Error en fetch o procesamiento de datos:', error);
        });

    // Para que se repita cada 5 segundos
    setInterval(function() {
        console.log('🔄 [Notificaciones JS] Realizando chequeo repetido...');
        fetch('/api/notificaciones/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`🚫 [Notificaciones JS] Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Lógica de cambio de color aquí
                if (Array.isArray(data) && data.length > 0) {
                     notificationBellLink.classList.add('has-notifications');
                     console.log('🔔 Campana debe estar activa.');
                 } else {
                     notificationBellLink.classList.remove('has-notifications');
                     console.log('💤 Campana debe estar inactiva.');
                 }
            })
            .catch(error => {
                console.error('❌ [Notificaciones JS] Error en chequeo repetido:', error);
            });
    }, 2000); // Repetir cada 5 segundos
});