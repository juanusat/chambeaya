SELECT 
    sesiones.id AS sesion_id,
    sesiones.usuario_id,
    usuarios.username,
    usuarios.email,
    sesiones.clave_hash,
    sesiones.creado_en AS sesion_creada_en
FROM sesiones
JOIN usuarios ON sesiones.usuario_id = usuarios.id;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE sesiones;
TRUNCATE TABLE usuarios;
SET FOREIGN_KEY_CHECKS = 1;
