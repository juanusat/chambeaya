import pymysql
import pymysql.cursors
from app.bd_conn import get_db_connection

def get_mis_comprobantes_pago(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT*from comprobante_contrato cc join contrato c ON c.contrato_id=cc.contrato_id where prestador_id = %s OR cliente_id = %s
                            """, (user_id, user_id))
            return cursor.fetchall()
    finally:
        conn.close()
# Obtener todos los comprobantes de contrato
def get_all_comprobantes_pago():
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
            SELECT
                cc.comprobante_contrato_id,
                p.titulo AS servicio,
                CASE
                    WHEN per_cli.usuario_id IS NOT NULL THEN per_cli.nombre
                    WHEN emp_cli.usuario_id IS NOT NULL THEN emp_cli.nombre
                    ELSE 'Desconocido'
                END AS cliente,
                CASE
                    WHEN per_pres.usuario_id IS NOT NULL THEN per_pres.nombre
                    WHEN emp_pres.usuario_id IS NOT NULL THEN emp_pres.nombre
                    ELSE 'Desconocido'
                END AS prestador,
                cc.monto,
                m.nombre AS metodo_pago,
                cc.fecha_pago
            FROM comprobante_contrato cc
            JOIN contrato c ON cc.contrato_id = c.contrato_id
            JOIN publicacion p ON c.servicio_id = p.publicacion_id
            JOIN usuario u_cli ON c.cliente_id = u_cli.usuario_id
            LEFT JOIN persona per_cli ON per_cli.usuario_id = u_cli.usuario_id
            LEFT JOIN empresa emp_cli ON emp_cli.usuario_id = u_cli.usuario_id
            JOIN usuario u_pres ON c.prestador_id = u_pres.usuario_id
            LEFT JOIN persona per_pres ON per_pres.usuario_id = u_pres.usuario_id
            LEFT JOIN empresa emp_pres ON emp_pres.usuario_id = u_pres.usuario_id
            JOIN metodo_pago m ON cc.metodo_pago_id = m.metodo_pago_id;
            """)
            return cursor.fetchall()
    finally:
        conn.close()
    
# Obtener todos los comprobantes de contrato de un prestador
def get_comprobantes_by_prestador_id(prestador_id):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
            SELECT
                cc.comprobante_contrato_id,
                CASE
                    WHEN per_pres.usuario_id IS NOT NULL THEN per_pres.nombre
                    WHEN emp_pres.usuario_id IS NOT NULL THEN emp_pres.nombre
                    ELSE 'Desconocido'
                END AS nombre_prestador,
                p.titulo AS servicio,
                CASE
                    WHEN per_cli.usuario_id IS NOT NULL THEN per_cli.nombre
                    WHEN emp_cli.usuario_id IS NOT NULL THEN emp_cli.nombre
                    ELSE 'Desconocido'
                END AS nombre_cliente,
                cc.monto,
                m.nombre AS metodo_pago,
                cc.fecha_pago
            FROM comprobante_contrato cc
            JOIN contrato c ON cc.contrato_id = c.contrato_id
            JOIN publicacion p ON c.servicio_id = p.publicacion_id
            JOIN usuario u_cli ON c.cliente_id = u_cli.usuario_id
            LEFT JOIN persona per_cli ON per_cli.usuario_id = u_cli.usuario_id
            LEFT JOIN empresa emp_cli ON emp_cli.usuario_id = u_cli.usuario_id
            JOIN usuario u_pres ON c.prestador_id = u_pres.usuario_id
            LEFT JOIN persona per_pres ON per_pres.usuario_id = u_pres.usuario_id
            LEFT JOIN empresa emp_pres ON emp_pres.usuario_id = u_pres.usuario_id
            JOIN metodo_pago m ON cc.metodo_pago_id = m.metodo_pago_id
            WHERE c.prestador_id = %s;
            """, (prestador_id,))
            return cursor.fetchall()
    finally:
        conn.close()

# Obtener todos los comprobantes de contrato de un cliente
def get_comprobantes_by_cliente_id(cliente_id):
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
            SELECT
                cc.comprobante_contrato_id,
                CASE
                    WHEN per_cli.usuario_id IS NOT NULL THEN per_cli.nombre
                    WHEN emp_cli.usuario_id IS NOT NULL THEN emp_cli.nombre
                    ELSE 'Desconocido'
                END AS nombre_cliente,                   
                p.titulo AS servicio,
                CASE
                    WHEN per_pres.usuario_id IS NOT NULL THEN per_pres.nombre
                    WHEN emp_pres.usuario_id IS NOT NULL THEN emp_pres.nombre
                    ELSE 'Desconocido'
                END AS nombre_prestador,
                cc.monto,
                m.nombre AS metodo_pago,
                cc.fecha_pago
            FROM comprobante_contrato cc
            JOIN contrato c ON cc.contrato_id = c.contrato_id
            JOIN publicacion p ON c.servicio_id = p.publicacion_id
            JOIN usuario u_cli ON c.cliente_id = u_cli.usuario_id
            LEFT JOIN persona per_cli ON per_cli.usuario_id = u_cli.usuario_id
            LEFT JOIN empresa emp_cli ON emp_cli.usuario_id = u_cli.usuario_id
            JOIN usuario u_pres ON c.prestador_id = u_pres.usuario_id
            LEFT JOIN persona per_pres ON per_pres.usuario_id = u_pres.usuario_id
            LEFT JOIN empresa emp_pres ON emp_pres.usuario_id = u_pres.usuario_id
            JOIN metodo_pago m ON cc.metodo_pago_id = m.metodo_pago_id
            WHERE c.cliente_id = %s;
            """, (cliente_id,))
            return cursor.fetchall()
    finally:
        conn.close()

# Crear un nuevo comprobante de contrato
def create_comprobante_pago(data):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO comprobante_contrato (contrato_id, monto, metodo_pago_id, fecha_pago)"
                "VALUES (%s, %s, %s, %s);",
                (
                    data['contrato_id'], 
                    data['monto'], 
                    data['metodo_pago_id'], 
                    data['fecha_pago']
                ),
            )
            conn.commit()
            return cursor.lastrowid
    finally:
        conn.close()