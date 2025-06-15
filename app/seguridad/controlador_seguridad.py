# app/seguridad/controlador_seguridad.py

from flask import g, jsonify, request
from . import d_conn as db
import hashlib # Para hashear la clave de la sesión actual

def obtener_sesiones_usuario_actual():
    print(getattr(g, 'user_id', None))
    """
    Obtiene todas las sesiones del usuario que está actualmente logueado.
    """
    # g.user_id se debe establecer en un middleware al verificar la sesión del usuario
    if not g.user_id:
        return jsonify({"error": "No autorizado"}), 401

    try:
        sesiones_db = db.get_sesiones_by_usuario_id(g.user_id)

        # Identificar la sesión actual para marcarla en la respuesta
        clave_actual_cookie = request.cookies.get('session_token')
        if not clave_actual_cookie:
             return jsonify({"error": "Token de sesión no encontrado"}), 400

        # Es crucial que uses el mismo método de hash que usas al crear la sesión
        clave_hash_actual = hashlib.sha256(clave_actual_cookie.encode('utf-8')).hexdigest()

        sesiones_procesadas = []
        for sesion in sesiones_db:
            sesion_data = {
                "id": sesion['id'],
                "clave_hash": sesion['clave_hash'],
                "creado_en": sesion['creado_en'].strftime('%Y-%m-%d %H:%M:%S'),
                "ultimo_acceso": sesion['ultimo_acceso'].strftime('%Y-%m-%d %H:%M:%S'),
                "user_agent": sesion['user_agent'],
                # Añadimos un campo para que el frontend sepa si es la sesión activa
                "es_actual": sesion['clave_hash'] == clave_hash_actual
            }
            sesiones_procesadas.append(sesion_data)

        return jsonify(sesiones_procesadas), 200

    except Exception as e:
        # En un entorno de producción, sería bueno registrar este error
        print(f"Error al obtener sesiones: {e}")
        return jsonify({"error": "Ocurrió un error en el servidor"}), 500


def invalidar_sesion_usuario(clave_hash_a_eliminar):
    """
    Invalida (elimina) una sesión específica, verificando que pertenezca
    al usuario logueado.
    """
    if not g.user_id:
        return jsonify({"error": "No autorizado"}), 401

    try:
        # Verificación de seguridad: Asegurarnos de que la sesión a eliminar
        # realmente pertenece al usuario que hace la petición.
        sesion_a_eliminar = db.get_sesion_by_usuario_id_and_clave_hash(g.user_id, clave_hash_a_eliminar)

        if not sesion_a_eliminar:
            # Si no se encuentra, puede ser porque ya fue eliminada o porque
            # el usuario intenta borrar una sesión que no es suya.
            return jsonify({"error": "Sesión no encontrada o no pertenece al usuario"}), 404

        db.eliminar_sesion_por_clave(clave_hash_a_eliminar)

        return jsonify({"mensaje": "Sesión invalidada correctamente"}), 200

    except Exception as e:
        print(f"Error al invalidar sesión: {e}")
        return jsonify({"error": "Ocurrió un error en el servidor"}), 500