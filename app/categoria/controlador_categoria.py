import pymysql
import pymysql.cursors
from app.bd_conn import get_db_connection
from app.usuario.controlador_usuario import es_admin

def get_all_categoria():
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""SELECT * 
                            FROM categoria ;
                           """)
            return cursor.fetchall()
    finally:
        conn.close() 

def get_categoria_id(cat_nom):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT categoria_id FROM categoria WHERE nombre = %s", (cat_nom,))
            result = cursor.fetchone()
            if result is None:
                return {"error": "Categoría no encontrada"}
            return result
    finally:
        conn.close()

#Añadido por Luis
def crear_categoria(nombre):
    if not es_admin():
        raise PermissionError("No autorizado")
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO categoria (nombre) VALUES (%s)", (nombre,))
            conn.commit()
    finally:
        conn.close()

def modificar_categoria(categoria_id, nuevo_nombre):
    if not es_admin():
        raise PermissionError("No autorizado")
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE categoria SET nombre = %s WHERE categoria_id = %s", (nuevo_nombre, categoria_id))
            conn.commit()
    finally:
        conn.close()

