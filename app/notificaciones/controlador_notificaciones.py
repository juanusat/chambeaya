import pymysql
import pymysql.cursors
from app.bd_conn import get_db_connection

def consultarNotificaciones(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    c.contrato_id,
                    p.titulo AS servicio,
                    p.descripcion AS descripcion_servicio,
                    CASE
                        WHEN per_pres.usuario_id IS NOT NULL THEN CONCAT(per_pres.nombre, ' ', per_pres.apellido)
                        WHEN emp_pres.usuario_id IS NOT NULL THEN emp_pres.nombre
                        ELSE 'Desconocido'
                    END AS empleador, -- Nombre del prestador
                    u_pres.username AS username_empleado, -- Username del prestador
                    CASE
                        WHEN per_cli.usuario_id IS NOT NULL THEN CONCAT(per_cli.nombre, ' ', per_cli.apellido)
                        WHEN emp_cli.usuario_id IS NOT NULL THEN emp_cli.nombre
                        ELSE 'Desconocido'
                    END AS cliente, -- Nombre del cliente
                    u_cli.username AS username_cliente, -- Username del cliente
                    u_pres.url_picture AS imagen,
                    c.precio,
                    c.estado,
                    c.fecha_inicio,
                    c.fecha_finalizacion
                FROM contrato c
                JOIN publicacion p ON c.servicio_id = p.publicacion_id
                JOIN usuario u_cli ON c.cliente_id = u_cli.usuario_id
                LEFT JOIN persona per_cli ON per_cli.usuario_id = u_cli.usuario_id
                LEFT JOIN empresa emp_cli ON emp_cli.usuario_id = u_cli.usuario_id
                JOIN usuario u_pres ON c.prestador_id = u_pres.usuario_id
                LEFT JOIN persona per_pres ON per_pres.usuario_id = u_pres.usuario_id
                LEFT JOIN empresa emp_pres ON emp_pres.usuario_id = u_pres.usuario_id
                WHERE c.cliente_id = %s AND c.estado='pendiente' 
                ORDER BY c.fecha_inicio DESC;
            """, (user_id,))
            return cursor.fetchall()
    finally:
        conn.close()
