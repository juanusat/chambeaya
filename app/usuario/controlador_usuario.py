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

# registrar usuario
def registrar_persona_usuario_cf(data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "CALL registrar_persona_usuario_cf(%s, %s, %s, %s, %s, %s, %s, %s, %s);",
                (data['nombre'], data['apellido'], data['telefono'], data['fecha_nac'], data['email'], 
                 data['password_hash'], data['username'], data['url_picture'], data['descripcion'])
            )
            conn.commit()
            return cursor.fetchone()[0]  # Retorna el ID del usuario creado
    finally:
        conn.close()

def registrar_persona_usuario_sf(data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "CALL registrar_persona_usuario_sf(%s, %s, %s, %s, %s, %s, %s, %s);",
                (data['nombre'], data['apellido'], data['telefono'], data['fecha_nac'], data['email'], 
                 data['password_hash'], data['username'], data['descripcion'])
            )
            conn.commit()
            return cursor.fetchone()[0]  # Retorna el ID del usuario creado
    finally:
        conn.close()

def registrar_empresa_usuario_cf(data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "CALL registrar_empresa_usuario_cf(%s, %s, %s, %s, %s, %s, %s);",
                (data['nombre_empresa'], data['descripcion_empresa'], data['email'], data['password_hash'], 
                 data['username'], data['url_picture'], data['descripcion'])
            )
            conn.commit()
            return cursor.fetchone()[0]  # Retorna el ID del usuario creado
    finally:
        conn.close()

def registrar_empresa_usuario_sf(data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "CALL registrar_empresa_usuario_sf(%s, %s, %s, %s, %s, %s, %s);",
                (data['nombre_empresa'], data['descripcion_empresa'], data['email'], data['password_hash'], 
                 data['username'], data['descripcion'])
            )
            conn.commit()
            return cursor.fetchone()[0]  # Retorna el ID del usuario creado
    finally:
        conn.close()

#Aqui acaba 

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
                  -- Datos de persona (si existen)
                  per.persona_id,
                  per.nombre   AS persona_nombre,
                  per.apellido AS persona_apellido,
                  per.telefono AS persona_telefono,
                  per.fecha_nacimiento AS persona_fecha_nacimiento,
                  -- Datos de empresa (si existen)
                  emp.empresa_id,
                  emp.nombre        AS empresa_nombre,
                  emp.descripcion   AS empresa_descripcion,
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