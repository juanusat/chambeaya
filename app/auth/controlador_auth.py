import pymysql
import hashlib
from app.seguridad.d_conn import get_usuario_by_username, get_sesiones_by_usuario_id
import uuid
from app.bd_conn import get_db_connection
from app.seguridad.d_conn import get_seguridad_conn

def registrar_clave_sesion(usuario_id, username, email, user_agent):
    clave = str(uuid.uuid4())
    clave_hash = hashlib.sha256(clave.encode('utf-8')).hexdigest()

    conn = get_seguridad_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id FROM usuarios WHERE id = %s", (usuario_id,)
            )
            result = cursor.fetchone()
            if not result:
                cursor.execute(
                    "INSERT INTO usuarios (id, username, email) VALUES (%s, %s, %s)",
                    (usuario_id, username, email)
                )

            # Registrar la sesión
            cursor.execute(
                """
                INSERT INTO sesiones (usuario_id, clave_hash, user_agent)
                VALUES (%s, %s, %s)
                """,
                (usuario_id, clave_hash, user_agent)
            )
            conn.commit()
        return clave
    finally:
        conn.close()

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
