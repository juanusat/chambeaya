-- 1. Contratos con servicio inexistente
SELECT * 
FROM contrato c
LEFT JOIN publicacion p ON c.servicio_id = p.publicacion_id
WHERE p.publicacion_id IS NULL;

-- 2. Contratos con cliente inexistente
SELECT * 
FROM contrato c
LEFT JOIN usuario u ON c.cliente_id = u.usuario_id
WHERE u.usuario_id IS NULL;

-- 3. Contratos con prestador inexistente
SELECT * 
FROM contrato c
LEFT JOIN usuario u ON c.prestador_id = u.usuario_id
WHERE u.usuario_id IS NULL;

-- 4. Comentarios con contrato inexistente
SELECT * 
FROM comentario cm
LEFT JOIN contrato c ON cm.contrato_id = c.contrato_id
WHERE c.contrato_id IS NULL;

-- 5. Comprobantes con contrato inexistente
SELECT * 
FROM comprobante_contrato cc
LEFT JOIN contrato c ON cc.contrato_id = c.contrato_id
WHERE c.contrato_id IS NULL;

-- 6. Comprobantes con método de pago inexistente
SELECT * 
FROM comprobante_contrato cc
LEFT JOIN metodo_pago mp ON cc.metodo_pago_id = mp.metodo_pago_id
WHERE mp.metodo_pago_id IS NULL;

-- 7. Usuarios sin persona ni empresa asociada
SELECT * 
FROM usuario u
LEFT JOIN persona p ON u.usuario_id = p.usuario_id
LEFT JOIN empresa e ON u.usuario_id = e.usuario_id
WHERE p.usuario_id IS NULL AND e.usuario_id IS NULL;

-- 8. Publicaciones con categoría inexistente
SELECT * 
FROM publicacion pub
LEFT JOIN categoria c ON pub.categoria_id = c.categoria_id
WHERE c.categoria_id IS NULL;

-- 9. Contratos con fechas incoherentes (inicio > finalización)
SELECT * 
FROM contrato
WHERE fecha_inicio > fecha_finalizacion;

-- 10. Comentarios sin calificación
SELECT * 
FROM comentario
WHERE calificacion IS NULL;

-- 11. Correos electrónicos duplicados en usuarios (verificación extra)
SELECT email, COUNT(*) AS cantidad
FROM usuario
GROUP BY email
HAVING COUNT(*) > 1;

-- 12. Contratos donde el prestador_id es diferente al autor de la publicación
SELECT 
    c.contrato_id,
    c.servicio_id,
    c.prestador_id,
    p.usuario_id AS publicador_id,
    p.titulo
FROM contrato c
JOIN publicacion p ON c.servicio_id = p.publicacion_id
WHERE c.prestador_id != p.usuario_id;

-- 13. Contratos finalizados cuyos pagos son mayor al precio del contrato
select 
    c.contrato_id,
    c.estado,
    c.precio as precio_contrato,
    sum(cc.monto) as total_pagado
from contrato c
join comprobante_contrato cc on c.contrato_id = cc.contrato_id
where c.estado = 'finalizado'
group by c.contrato_id, c.precio, c.estado
having sum(cc.monto) > c.precio;

-- 14. Contratos finalizados cuyos pagos son menores al precio del contrato
select 
    c.contrato_id,
    c.estado,
    c.precio as precio_contrato,
    sum(cc.monto) as total_pagado
from contrato c
join comprobante_contrato cc on c.contrato_id = cc.contrato_id
where c.estado = 'finalizado'
group by c.contrato_id, c.precio, c.estado
having sum(cc.monto) < c.precio;

-- 15. Contratos cuyo precio es diferente al precio de la publicación
select 
    c.contrato_id,
    c.precio as precio_contrato,
    p.precio as precio_publicacion,
    p.titulo,
    c.estado
from contrato c
join publicacion p on c.servicio_id = p.publicacion_id
where c.precio <> p.precio;