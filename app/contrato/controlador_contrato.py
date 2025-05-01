import pymysql
import pymysql.cursors
from app.bd_conn import get_db_connection

def get_all_contratos(): 
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor: 
            cursor.execute("""
            SELECT
            p.titulo AS servicio,
            cat.nombre,
            CASE
                WHEN per_cli.usuario_id IS NOT NULL THEN per_cli.nombre
                WHEN emp_cli.usuario_id IS NOT NULL THEN emp_cli.nombre
                ELSE 'Desconocido'
            END AS cliente,
            CASE
                WHEN per_pres.usuario_id IS NOT NULL THEN per_pres.nombre
                WHEN emp_pres.usuario_id IS NOT NULL THEN emp_pres.nombre
                ELSE 'Desconocido'
            END AS prestador,
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
            JOIN categoria cat ON p.categoria_id = cat.categoria_id;""")
        return cursor.fetchall()
    finally:
        conn.close()

def get_contratos_by_prestador_id(prestador_id): 
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
        SELECT
        c.contrato_id,
        CASE
            WHEN per_pres.usuario_id IS NOT NULL THEN per_pres.nombre
            WHEN emp_pres.usuario_id IS NOT NULL THEN emp_pres.nombre
            ELSE 'Desconocido'
        END AS nombre_prestador,
	    p.titulo AS servicio,
        CASE
            WHEN per_cli.usuario_id IS NOT NULL THEN per_cli.nombre
            WHEN emp_cli.usuario_id IS NOT NULL THEN emp_cli.nombre
            ELSE 'Desconocido'
        END AS nombre_cliente,
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
        WHERE c.prestador_id =%s;""",(prestador_id,))
        return cursor.fetchall()
    finally:
        conn.close()

def get_contratos_by_cliente_id(cliente_id): 
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
        SELECT
        c.contrato_id,
        CASE
            WHEN per_cli.usuario_id IS NOT NULL THEN per_cli.nombre
            WHEN emp_cli.usuario_id IS NOT NULL THEN emp_cli.nombre
            ELSE 'Desconocido'
        END AS nombre_cliente,                   
	    p.titulo AS servicio,
        CASE
            WHEN per_pres.usuario_id IS NOT NULL THEN per_pres.nombre
            WHEN emp_pres.usuario_id IS NOT NULL THEN emp_pres.nombre
            ELSE 'Desconocido'
        END AS nombre_prestador,
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
        WHERE c.cliente_id =%s;""",(cliente_id,))
        return cursor.fetchall()
    finally:
        conn.close()

def get_contratos_by_publicacion_id(publicacion_id):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT
                    c.contrato_id,
                    p.titulo AS servicio,
                    CASE
                        WHEN per_cli.usuario_id IS NOT NULL THEN per_cli.nombre
                        WHEN emp_cli.usuario_id IS NOT NULL THEN emp_cli.nombre
                        ELSE 'Desconocido'
                    END AS nombre_cliente,
                    CASE
                        WHEN per_pres.usuario_id IS NOT NULL THEN per_pres.nombre
                        WHEN emp_pres.usuario_id IS NOT NULL THEN emp_pres.nombre
                        ELSE 'Desconocido'
                    END AS nombre_prestador,
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
                WHERE c.servicio_id = %s;
            """, (publicacion_id,))
            return cursor.fetchall()
    finally:
        conn.close()

def get_contratos_by_categoria_nombre(nom_cat):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT
                    c.contrato_id,
                    p.titulo AS servicio,
                    cat.nombre AS categoria,
                    CASE
                        WHEN per_cli.usuario_id IS NOT NULL THEN per_cli.nombre
                        WHEN emp_cli.usuario_id IS NOT NULL THEN emp_cli.nombre
                        ELSE 'Desconocido'
                    END AS nombre_cliente,
                    CASE
                        WHEN per_pres.usuario_id IS NOT NULL THEN per_pres.nombre
                        WHEN emp_pres.usuario_id IS NOT NULL THEN emp_pres.nombre
                        ELSE 'Desconocido'
                    END AS nombre_prestador,
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
                JOIN categoria cat ON p.categoria_id = cat.categoria_id
                WHERE cat.nombre = %s;
            """, (nom_cat,))
            return cursor.fetchall()
    finally:
        conn.close()
