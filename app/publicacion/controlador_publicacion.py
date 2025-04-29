import pymysql
from app.bd_conn import get_db_connection


def get_all_publicaciones():
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT * FROM publicacion;")
            return cursor.fetchall()
    finally:
        conn.close()


def get_publicacion_by_id(pub_id):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT * FROM publicacion WHERE publicacion_id=%s;", (pub_id,))
            return cursor.fetchone()
    finally:
        conn.close()


def create_publicacion(data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO publicacion (categoria_id, usuario_id, titulo, descripcion, precio, fecha_creacion)"
                " VALUES (%s,%s,%s,%s,%s,CURDATE());",
                (
                    data['categoria_id'],
                    data['usuario_id'],
                    data['titulo'],
                    data['descripcion'],
                    data['precio'],
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
            cursor.execute("DELETE FROM publicacion WHERE publicacion_id=%s;", (pub_id,))
            conn.commit()
    finally:
        conn.close()