import pymysql
import pymysql.cursors
from app.bd_conn import get_db_connection


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