import pymysql
import pymysql.cursors
from app.bd_conn import get_db_connection


def get_all_publicaciones(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""SELECT 
                                p.publicacion_id,  -- Incluye el ID de la publicación
                                p.titulo, 
                                cat.nombre AS categoria, 
                                u.username AS nombre_usuario, 
                                p.precio, 
                                p.fecha_creacion, 
                                p.descripcion,
                                pm.archivo
                            FROM publicacion p 
                            INNER JOIN categoria cat ON p.categoria_id = cat.categoria_id
                            INNER JOIN usuario u ON p.usuario_id = u.usuario_id
                            LEFT JOIN publicacion_medio pm ON pm.publicacion_id = p.publicacion_id
                            WHERE u.usuario_id = %s and p.estado = True;
                           """, (user_id,))
            return cursor.fetchall()
    finally:
        conn.close() 

def get_all_publicaciones_by_username(username):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""SELECT 
                                p.publicacion_id,  -- Incluye el ID de la publicación
                                p.titulo, 
                                cat.nombre AS categoria, 
                                u.username AS nombre_usuario, 
                                p.precio, 
                                p.fecha_creacion, 
                                p.descripcion,
                                pm.archivo
                            FROM publicacion p 
                            INNER JOIN categoria cat ON p.categoria_id = cat.categoria_id
                            INNER JOIN usuario u ON p.usuario_id = u.usuario_id
                            LEFT JOIN publicacion_medio pm ON pm.publicacion_id = p.publicacion_id
                            WHERE u.username = %s and p.estado = True;
                           """, (username,))
            return cursor.fetchall()
    finally:
        conn.close() 

def get_publicacion_by_palabra(palabra):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                SELECT
                    CASE
                        WHEN per.usuario_id IS NOT NULL THEN per.nombre
                        WHEN emp.usuario_id IS NOT NULL THEN emp.nombre
                        ELSE 'Desconocido'
                    END AS nombre_usuario,
                    p.publicacion_id,
                    cat.nombre AS categoria,
                    p.titulo,
                    p.descripcion,
                    p.precio,
                    p.estado,
                    p.fecha_creacion,
                    pm.archivo
                FROM publicacion p
                JOIN usuario u ON p.usuario_id = u.usuario_id
                JOIN categoria cat ON p.categoria_id = cat.categoria_id
                LEFT JOIN persona per ON per.usuario_id = u.usuario_id
                LEFT JOIN empresa emp ON emp.usuario_id = u.usuario_id
                LEFT JOIN publicacion_medio pm ON pm.publicacion_id = p.publicacion_id
                WHERE p.titulo LIKE %s;
                """,
                ('%' + palabra + '%',)
            )
            return cursor.fetchall()
    finally:
        conn.close()

def get_publicacion_by_id(pub_id):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    CASE 
                        WHEN per.usuario_id IS NOT NULL THEN per.nombre
                        WHEN emp.usuario_id IS NOT NULL THEN emp.nombre
                        ELSE 'Desconocido'
                    END AS publicador,
                    cat.nombre AS categoria,
                    p.titulo,
                    p.descripcion,
                    p.precio,
                    p.estado,
                    p.fecha_creacion,
                    pm.archivo
                FROM publicacion p
                JOIN usuario u ON p.usuario_id = u.usuario_id
                JOIN categoria cat ON p.categoria_id = cat.categoria_id
                LEFT JOIN persona per ON per.usuario_id = u.usuario_id
                LEFT JOIN empresa emp ON emp.usuario_id = u.usuario_id
                LEFT JOIN publicacion_medio pm ON pm.publicacion_id = p.publicacion_id
                WHERE p.publicacion_id = %s;""", (pub_id,))
            return cursor.fetchall()
    finally:
        conn.close() 

def get_publicacion_by_id_usuario(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    CASE 
                        WHEN per.usuario_id IS NOT NULL THEN per.nombre
                        WHEN emp.usuario_id IS NOT NULL THEN emp.nombre
                        ELSE 'Desconocido'
                    END AS publicador,
                    cat.nombre,
                    p.titulo,
                    p.descripcion,
                    p.precio,
                    p.estado,
                    p.fecha_creacion,
                    pm.archivo
                FROM publicacion p
                JOIN usuario u ON p.usuario_id = u.usuario_id
                JOIN categoria cat ON p.categoria_id = cat.categoria_id
                LEFT JOIN persona per ON per.usuario_id = u.usuario_id
                LEFT JOIN empresa emp ON emp.usuario_id = u.usuario_id
                LEFT JOIN publicacion_medio pm ON pm.publicacion_id = p.publicacion_id
                WHERE u.usuario_id = %s;""",(user_id,))
            return cursor.fetchone()
    finally: 
        conn.close()

def get_publicacion_by_categoria_nombre(nombre_cat):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor: 
            cursor.execute("""
                SELECT 
                    CASE 
                        WHEN per.usuario_id IS NOT NULL THEN per.nombre
                        WHEN emp.usuario_id IS NOT NULL THEN emp.nombre
                        ELSE 'Desconocido'
                    END AS nombre_usuario,
                    p.publicacion_id,
                    cat.nombre AS categoria,
                    p.titulo,
                    p.descripcion,
                    p.precio,
                    p.estado,
                    p.fecha_creacion,
                    pm.archivo
                FROM publicacion p
                JOIN usuario u ON p.usuario_id = u.usuario_id
                JOIN categoria cat ON p.categoria_id = cat.categoria_id
                LEFT JOIN persona per ON per.usuario_id = u.usuario_id
                LEFT JOIN empresa emp ON emp.usuario_id = u.usuario_id
                LEFT JOIN publicacion_medio pm ON pm.publicacion_id = p.publicacion_id
                WHERE cat.nombre = %s;
            """, (nombre_cat,))
            return cursor.fetchall()
    finally:
        conn.close()


def create_publicacion(data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO publicacion (categoria_id, usuario_id, titulo, descripcion, precio, fecha_creacion, estado)"
                " VALUES (%s,%s,%s,%s,%s,CURDATE(),%s);",
                (
                    data['categoria_id'],
                    data['usuario_id'],
                    data['titulo'],
                    data['descripcion'],
                    data['precio'],
                    1
                ),
            )
            conn.commit()
            return cursor.lastrowid
    finally:
        conn.close()

def update_publicacion(pub_id, data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE publicacion SET titulo=%s, descripcion=%s, precio=%s WHERE publicacion_id=%s;",
                (data['titulo'], data['descripcion'], data['precio'], pub_id),
            )
            conn.commit()
    finally:
        conn.close()

def delete_publicacion(pub_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # Eliminar registros relacionados en la tabla contrato
            cursor.execute("DELETE FROM contrato WHERE servicio_id=%s;", (pub_id,))
            # Ahora eliminar la publicación
            cursor.execute("DELETE FROM publicacion WHERE publicacion_id=%s;", (pub_id,))
            conn.commit()
    finally:
        conn.close()

def darbaja_publicacion(pub_id): 
    conn = get_db_connection()
    try: 
        with conn.cursor() as cursor: 
            cursor.execute("UPDATE publicacion SET estado=False WHERE publicacion_id=%s;", (pub_id,))
            conn.commit()  # Confirma los cambios en la base de datos
    finally:
        conn.close()

