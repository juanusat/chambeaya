import pymysql
import hashlib
from app.bd_conn import get_db_connection

def verificar_credenciales(username, password_plana):
    password_hash = hashlib.sha256(password_plana.encode('utf-8')).hexdigest()
    
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                SELECT usuario_id, username, email, fecha_creacion, admin, url_picture
                FROM usuario
                WHERE username = %s AND password_hash = %s;
                """,
                (username, password_hash)
            )
            return cursor.fetchone()
    finally:
        conn.close()

def actualizar_password(data, usuario_id): 
    password_hash = hashlib.sha256(data.encode('utf-8')).hexdigest()

    conn = get_db_connection()
    try: 
        with conn.cursor(pymysql.cursors.DictCursor) as cursor: 
            cursor.execute(
                """
                UPDATE usuario set password_hash = %s where usuario_id = %s;
                """,
                (password_hash, usuario_id)
            )
            conn.commit()
    finally:
        conn.close()

def registrar_empresa(_nombre_empresa, _ruc, _fecha_creacion, _email, _username, _password,):
    password_hash = hashlib.sha256(_password.encode('utf-8')).hexdigest()
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.callproc('registrar_empresa_usuario_sf', [
                _nombre_empresa,
                _ruc,
                _email,
                password_hash,
                _username,
                ''
            ])
        conn.commit()
    finally:
        conn.close()

def registrar_persona(_nombre, _apellido, _telefono, _fecha_nac, _email, _username, _password, _url_picture):
    password_hash = hashlib.sha256(_password.encode('utf-8')).hexdigest()
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.callproc('registrar_persona_usuario_cf', [
                _nombre,
                _apellido,
                _telefono,
                _fecha_nac,
                _email,
                password_hash,
                _username,
                _url_picture,
                ''
            ])
        conn.commit()
    finally:
        conn.close()