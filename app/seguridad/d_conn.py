import pymysql
from dotenv import load_dotenv
import os
import datetime

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

def get_seguridad_conn():
    return pymysql.connect(
        host=os.getenv('DB_HOST'),
        port=int(os.getenv('DB_PORT')),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        db=os.getenv('DB_NAME_SEGURIDAD'),
        cursorclass=pymysql.cursors.DictCursor
    )

def get_usuario_by_username(username):
    conn = get_seguridad_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,))
            return cursor.fetchone()
    finally:
        conn.close()

def get_usuario_by_email(email):
    conn = get_seguridad_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
            return cursor.fetchone()
    finally:
        conn.close()

def crear_usuario(username, email):
    conn = get_seguridad_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO usuarios (username, email) VALUES (%s, %s)", (username, email))
            conn.commit()
            return cursor.lastrowid
    finally:
        conn.close()

def crear_sesion(usuario_id, clave_hash):
    conn = get_seguridad_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO sesiones (usuario_id, clave_hash) VALUES (%s, %s)", (usuario_id, clave_hash))
            conn.commit()
    finally:
        conn.close()

def get_sesiones_by_usuario_id(usuario_id):
    conn = get_seguridad_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM sesiones WHERE usuario_id = %s", (usuario_id,))
            return cursor.fetchall()
    finally:
        conn.close()

def eliminar_sesiones(usuario_id):
    conn = get_seguridad_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM sesiones WHERE usuario_id = %s", (usuario_id,))
            conn.commit()
    finally:
        conn.close()

def eliminar_sesion_por_clave(clave_hash):
    conn = get_seguridad_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM sesiones WHERE clave_hash = %s", (clave_hash,))
            conn.commit()
    finally:
        conn.close()

def get_seguridad_conn():
    return pymysql.connect(
        host=os.getenv('DB_HOST'),
        port=int(os.getenv('DB_PORT')),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        db=os.getenv('DB_NAME_SEGURIDAD'),
        cursorclass=pymysql.cursors.DictCursor
    )

def get_sesion_by_usuario_id_and_clave_hash(usuario_id: int, clave_hash: str):
    conn = get_seguridad_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM sesiones WHERE usuario_id = %s AND clave_hash = %s",
                (usuario_id, clave_hash)
            )
            return cursor.fetchone()
    finally:
        conn.close()

def update_sesion_ultimo_acceso(sesion_id: int):
    conn = get_seguridad_conn()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE sesiones SET ultimo_acceso = %s WHERE id = %s",
                (datetime.datetime.now(), sesion_id)
            )
            conn.commit()
    finally:
        conn.close()