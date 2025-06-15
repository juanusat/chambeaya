from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from . import d_conn as db
import hashlib

@jwt_required()
def obtener_sesiones_usuario_actual():
    try:
        usuario_id_actual = get_jwt_identity()
        
        claims = get_jwt()
        session_key = claims.get("clave")
        clave_hash_from_jwt = hashlib.sha256(session_key.encode('utf-8')).hexdigest()

        if not clave_hash_from_jwt:
            return jsonify({"error": "La clave de la sesión no se encuentra en el token"}), 400

        sesiones_db = db.get_sesiones_by_usuario_id(usuario_id_actual)
        
        sesiones_procesadas = [
            {
                "id": sesion['id'],
                "clave_hash": sesion['clave_hash'],
                "creado_en": sesion['creado_en'].strftime('%Y-%m-%d %H:%M:%S'),
                "ultimo_acceso": sesion['ultimo_acceso'].strftime('%Y-%m-%d %H:%M:%S'),
                "user_agent": sesion['user_agent'],
                "es_actual": sesion['clave_hash'] == clave_hash_from_jwt
            } for sesion in sesiones_db
        ]

        return jsonify(sesiones_procesadas), 200

    except Exception as e:
        print(f"Error al obtener sesiones: {e}")
        return jsonify({"error": "Ocurrió un error en el servidor al procesar las sesiones"}), 500

@jwt_required()
def invalidar_sesion_usuario(clave_hash_a_eliminar: str):
    try:
        usuario_id_actual = get_jwt_identity()

        sesion_a_eliminar = db.get_sesion_by_usuario_id_and_clave_hash(usuario_id_actual, clave_hash_a_eliminar)

        if not sesion_a_eliminar:
            return jsonify({"error": "Sesión no encontrada o no pertenece al usuario"}), 404

        db.eliminar_sesion_por_clave(clave_hash_a_eliminar)
        return jsonify({"mensaje": "Sesión invalidada correctamente"}), 200

    except Exception as e:
        print(f"Error al invalidar sesión: {e}")
        return jsonify({"error": "Ocurrió un error en el servidor al invalidar la sesión"}), 500