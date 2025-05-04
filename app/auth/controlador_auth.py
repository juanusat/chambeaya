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
