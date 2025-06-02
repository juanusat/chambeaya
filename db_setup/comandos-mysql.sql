-- Ver tablas y cantidad de columnas

SELECT table_name, table_rows
FROM information_schema.tables
WHERE table_schema = DATABASE();


-- Ver funciones y procedimientos
SELECT 
    ROUTINE_NAME, 
    ROUTINE_TYPE 
FROM 
    information_schema.ROUTINES 
WHERE 
    ROUTINE_SCHEMA = DATABASE();

-- Todas las contraseñas en 1
UPDATE usuario SET password_hash = SHA2('1', 256);

-- Listar usuarios como empresas o personas
SELECT
  u.usuario_id,
  u.username,
  u.email,
  u.fecha_creacion,
  u.descripcion,
  COALESCE(p.nombre, e.nombre) AS nombre,
  CASE
    WHEN p.persona_id IS NOT NULL THEN 'persona'
    WHEN e.empresa_id IS NOT NULL THEN 'empresa'
    ELSE 'sin tipo'
  END AS tipo_usuario
FROM
  usuario u
LEFT JOIN persona p ON u.usuario_id = p.usuario_id
LEFT JOIN empresa e ON u.usuario_id = e.usuario_id;

-- Usuarios sin contratos ni publicaciones
SELECT u.usuario_id, u.username, u.email
FROM usuario u
LEFT JOIN contrato c1 ON u.usuario_id = c1.cliente_id
LEFT JOIN contrato c2 ON u.usuario_id = c2.prestador_id
LEFT JOIN publicacion p ON u.usuario_id = p.usuario_id
WHERE c1.contrato_id IS NULL
  AND c2.contrato_id IS NULL
  AND p.publicacion_id IS NULL;
