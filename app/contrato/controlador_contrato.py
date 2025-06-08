import pymysql
import pymysql.cursors
from app.bd_conn import get_db_connection

def get_mis_contratos(user_id):
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
                    u_pres.url_picture AS imagenP,
                    u_cli.url_picture AS imagenC,
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
                WHERE c.prestador_id = %s OR c.cliente_id = %s
                ORDER BY c.fecha_inicio DESC;
            """, (user_id, user_id))
            return cursor.fetchall()
    finally:
        conn.close()

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

def get_contratos_by_estado(estado_nombre):
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
                WHERE c.estado = %s;
            """, (estado_nombre,))
            return cursor.fetchall()
    finally:
        conn.close()


def create_contrato(user_id,data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO contrato (servicio_id, cliente_id, prestador_id, precio, fecha_inicio, fecha_finalizacion)"
                " VALUES (%s,%s,%s,%s,%s,%s);",
                (
                    data['servicio_id'],
                    data['cliente_id'],
                    user_id,
                    data['precio'],
                    data['fecha_inicio'],
                    data['fecha_finalizacion'],
                ),
            )
            conn.commit()
            return cursor.lastrowid
    finally:
        conn.close() 

def update_contrato(conts_id, data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE contrato SET estado=%s, fecha_finalizacion=%s WHERE contrato_id=%s;",
                (data['estado'], data['fecha_finalizacion'], conts_id),
            )
            conn.commit()
    finally:
        conn.close()

def actualizar_estado_contrato(contrato_id, nuevo_estado):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            if nuevo_estado == 'finalizado':
                cursor.execute(
                    "UPDATE contrato SET estado = %s, fecha_finalizacion = NOW() WHERE contrato_id = %s;",
                    (nuevo_estado, contrato_id)
                )
            else:
                cursor.execute(
                    "UPDATE contrato SET estado = %s WHERE contrato_id = %s;",
                    (nuevo_estado, contrato_id)
                )
        conn.commit()
    finally:
        conn.close()

def finalizar_contrato(conts_id):
    actualizar_estado_contrato(conts_id, 'finalizado')

def marcar_contrato_completado(conts_id):
    actualizar_estado_contrato(conts_id, 'completado')

def obtener_comentario_del_contrato(conts_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    c.calificacion, 
                    c.comentario, 
                    c.fecha_creacion,

                    CASE 
                        WHEN ec.usuario_id IS NOT NULL THEN ec.nombre
                        WHEN pc.usuario_id IS NOT NULL THEN CONCAT(pc.nombre, ' ', pc.apellido)
                        ELSE 'Desconocido'
                    END AS nombre_cliente,

                    CASE 
                        WHEN ep.usuario_id IS NOT NULL THEN ep.nombre
                        WHEN pp.usuario_id IS NOT NULL THEN CONCAT(pp.nombre, ' ', pp.apellido)
                        ELSE 'Desconocido'
                    END AS nombre_prestador

                FROM comentario c
                JOIN contrato co ON c.contrato_id = co.contrato_id

                LEFT JOIN persona pc ON pc.usuario_id = co.cliente_id
                LEFT JOIN empresa ec ON ec.usuario_id = co.cliente_id
                LEFT JOIN persona pp ON pp.usuario_id = co.prestador_id
                LEFT JOIN empresa ep ON ep.usuario_id = co.prestador_id

                WHERE co.contrato_id = %s AND co.estado = 'finalizado';
            """, (conts_id,))
            return cursor.fetchone()
    finally:
        conn.close()


def create_comentario(data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO comentario (contrato_id, calificacion, comentario, fecha_creacion)
                VALUES (%s, %s, %s, CURRENT_DATE)
                """,
                (
                    data['contrato_id'],
                    data['calificacion'],
                    data['comentario']
                )
            )
            conn.commit()
    finally:
        conn.close()

        conn.close()

def update_comentario(conts_id,data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE comentario SET calificacion=%s, comentario=%s,fecha_creacion=%s WHERE contrato_id=%s;",
                (
                    data['calificacion'],
                    data['comentario'],
                    data['fecha_creacion'],
                    conts_id
                ),
            )
            conn.commit()
    finally:
        conn.close()

def delete_comentario(conts_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "DELETE FROM comentario WHERE contrato_id = %s;", (conts_id,)
            )
            conn.commit()  # Asegura que los cambios se guarden
            return cursor.rowcount > 0  # True si se eliminaron filas
    finally:
        conn.close() 

def contrato_pertenece_a_cliente(conts_id, cliente_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT 1 FROM contrato WHERE contrato_id = %s AND cliente_id = %s LIMIT 1;",
                (conts_id, cliente_id)
            )
            result = cursor.fetchone()
            return result is not None  # True si existe, False si no
    finally:
        conn.close()

def estado_del_contrato(conts_id):
    conn = get_db_connection()
    with conn.cursor() as cursor:
            cursor.execute(
                "SELECT estado FROM contrato WHERE contrato_id = %s",
                (conts_id,)
            )
            result = cursor.fetchone()
            if result and result[0]:
                return result[0].strip().lower()
            else:
                return None

def get_contrato_data(contrato_id):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                SELECT
                    c.contrato_id,
                    c.precio,
                    COALESCE(SUM(cc.monto), 0) AS precio_pagado,
                    c.estado
                FROM contrato c
                LEFT JOIN comprobante_contrato cc ON cc.contrato_id = c.contrato_id
                WHERE c.contrato_id = %s
                GROUP BY c.contrato_id, c.precio, c.estado;
                """,
                (contrato_id,)
            )
            return cursor.fetchone()
    finally:
        conn.close()