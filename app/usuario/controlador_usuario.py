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
                SET ruc=%s,
                    fecha_creacion=%s
                WHERE empresa_id=%s;
                """,
                (
                    data['ruc'],
                    data['fecha_creacion'],
                    empresa_id
                )
            )
            conn.commit()
    finally:
        conn.close()
        
def get_usuario_by_username(username):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT
                    usu.usuario_id,
                    usu.username,
                    usu.email,
                    usu.url_picture,
                    per.persona_id,
                    per.nombre   AS persona_nombre,
                    per.apellido AS persona_apellido,
                    emp.empresa_id,
                    emp.nombre        AS empresa_nombre
                FROM usuario usu
                LEFT JOIN persona per ON per.usuario_id = usu.usuario_id
                LEFT JOIN empresa emp ON emp.usuario_id = usu.usuario_id
                WHERE usu.username = %s
                LIMIT 1;
            """, (username,))
            return cursor.fetchone()
    finally:
        conn.close()

def get_usuario_profile_by_id(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT
                  usu.usuario_id,
                  usu.username,
                  usu.email,
                  usu.url_picture,
                  usu.descripcion,
                  -- Datos de persona (si existen)
                  per.persona_id,
                  per.nombre   AS persona_nombre,
                  per.apellido AS persona_apellido,
                  per.telefono AS persona_telefono,
                  per.fecha_nacimiento AS persona_fecha_nacimiento,
                  emp.empresa_id,
                  emp.nombre        AS empresa_nombre,
                  emp.ruc   AS empresa_ruc,
                  emp.fecha_creacion AS empresa_fecha_creacion
                FROM usuario usu
                LEFT JOIN persona per ON per.usuario_id = usu.usuario_id
                LEFT JOIN empresa emp ON emp.usuario_id = usu.usuario_id
                WHERE usu.usuario_id = %s;
            """, (user_id,))
            return cursor.fetchone()
    finally:
        conn.close()

def get_usuario_profile_by_username(username):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT
                  usu.usuario_id,
                  usu.username,
                  usu.email,
                  usu.url_picture,
                  usu.descripcion,
                  -- Datos de persona (si existen)
                  per.persona_id,
                  per.nombre   AS persona_nombre,
                  per.apellido AS persona_apellido,
                  per.telefono AS persona_telefono,
                  per.fecha_nacimiento AS persona_fecha_nacimiento,
                  emp.empresa_id,
                  emp.nombre        AS empresa_nombre,
                  emp.ruc   AS empresa_ruc,
                  emp.fecha_creacion AS empresa_fecha_creacion
                FROM usuario usu
                LEFT JOIN persona per ON per.usuario_id = usu.usuario_id
                LEFT JOIN empresa emp ON emp.usuario_id = usu.usuario_id
                WHERE usu.username = %s;
            """, (username,))
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

def actualizar_email(data, usuario_id): 
    conn = get_db_connection()
    try: 
        with conn.cursor(pymysql.cursors.DictCursor) as cursor: 
            cursor.execute(
                """
                UPDATE usuario set email = %s where usuario_id = %s;
                """,
                (data,usuario_id)
            )
            conn.commit()
    finally:
        conn.close()

def actualizar_descripcion(data, usuario_id): 
    conn = get_db_connection()
    try: 
        with conn.cursor(pymysql.cursors.DictCursor) as cursor: 
            cursor.execute(
                """
                UPDATE usuario set descripcion = %s where usuario_id = %s;
                """,
                (data, usuario_id)
            )
            conn.commit()
    finally:
        conn.close()

def buscar_usuarios_para_autocompletar_db(query_str):
    conn = get_db_connection()
    usuarios = []
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT usuario_id, username FROM usuario WHERE username LIKE CONCAT('%%', %s, '%%') LIMIT 10"
            cursor.execute(sql, (query_str,))
            result = cursor.fetchall()
            for row in result:
                usuarios.append({
                    'id': row['usuario_id'],
                    'nombre': row['username']
                })
    except Exception as e:
        print(f"Error al buscar usuarios para autocompletado en DB: {e}")
    finally:
        conn.close()
    return usuarios