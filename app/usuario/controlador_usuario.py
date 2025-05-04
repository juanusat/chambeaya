import pymysql
from app.bd_conn import get_db_connection


def get_all_usuarios():
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT usuario_id, username, email, fecha_creacion, admin, url_picture FROM usuario;")
            return cursor.fetchall()
    finally:
        conn.close()


def get_usuario_by_id(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT usuario_id, username, email, fecha_creacion, admin, url_picture FROM usuario WHERE usuario_id=%s;", (user_id,))
            return cursor.fetchone()
    finally:
        conn.close()


def create_usuario(data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO usuario (username, email, password_hash, fecha_creacion, admin)"
                " VALUES (%s,%s,%s,CURDATE(),%s);",
                (data['username'], data['email'], data['password_hash'], data.get('admin', False)),
            )
            conn.commit()
            return cursor.lastrowid
    finally:
        conn.close()


def update_usuario(user_id, data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE usuario SET username=%s, email=%s WHERE usuario_id=%s;",
                (data['username'], data['email'], user_id),
            )
            conn.commit()
    finally:
        conn.close()

def update_usuario_persona(persona_id, data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE persona
                SET nombre=%s,
                    apellido=%s,
                    telefono=%s,
                    fecha_nacimiento=%s
                WHERE persona_id=%s;
                """,
                (
                    data['nombre'],
                    data['apellido'],
                    data['telefono'],
                    data['fecha_nacimiento'],
                    persona_id
                )
            )
            conn.commit()
    finally:
        conn.close()

def update_usuario_empresa(empresa_id, data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE empresa
                SET descripcion=%s,
                    fecha_creacion=%s
                WHERE empresa_id=%s;
                """,
                (
                    data['descripcion'],
                    data['fecha_creacion'],
                    empresa_id
                )
            )
            conn.commit()
    finally:
        conn.close()

def delete_usuario(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM usuario WHERE usuario_id=%s;", (user_id,))
            conn.commit()
    finally:
        conn.close()
        
def get_usuario_by_username(username):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                "SELECT usu.username, per.nombre, per.apellido, "
                "usu.email, per.fecha_nacimiento, usu.url_picture FROM usuario usu "
                "INNER JOIN persona per ON per.usuario_id = usu.usuario_id "
                "WHERE username=%s;",
                (username,)
            )
            return cursor.fetchone()
    finally:
        conn.close()

def get_validar_username_usuario(username):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                "SELECT EXISTS (SELECT 1 FROM usuario WHERE username = %s) AS encontrado",
                (username,)
            )
            return cursor.fetchone()
    finally:
        conn.close()