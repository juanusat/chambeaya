from flask import Blueprint, request, jsonify, abort
from app.usuario.controlador_usuario import (
    get_all_usuarios,
    get_usuario_by_id,
    create_usuario,
    update_usuario,
    delete_usuario,
    registrar_persona_usuario_cf,
    registrar_persona_usuario_sf,
    registrar_empresa_usuario_cf,
    registrar_empresa_usuario_sf
)

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/', methods=['GET'])
def listar_usuarios():
    users = get_all_usuarios()
    return jsonify(users), 200

@usuarios_bp.route('/<int:user_id>', methods=['GET'])
def obtener_usuario(user_id):
    user = get_usuario_by_id(user_id)
    if not user:
        abort(404, description="Usuario no encontrado")
    return jsonify(user), 200

@usuarios_bp.route('/', methods=['POST'])
def nuevo_usuario():
    data = request.get_json()
    new_id = create_usuario(data)
    return jsonify({'usuario_id': new_id}), 201

@usuarios_bp.route('/<int:user_id>', methods=['PUT'])
def editar_usuario(user_id):
    data = request.get_json()
    update_usuario(user_id, data)
    return jsonify({'message': 'Actualizado exitosamente'}), 200

@usuarios_bp.route('/<int:user_id>', methods=['DELETE'])
def borrar_usuario(user_id):
    delete_usuario(user_id)
    return jsonify({'message': 'Eliminado exitosamente'}), 200

# Nuevas rutas para registrar personas y empresas(Lucho)

@usuarios_bp.route('/registrar_persona_cf', methods=['POST'])
def registrar_persona_con_foto():
    data = request.get_json()
    user_id = registrar_persona_usuario_cf(data)
    return jsonify({'usuario_id': user_id}), 201

@usuarios_bp.route('/registrar_persona_sf', methods=['POST'])
def registrar_persona_sin_foto():
    data = request.get_json()
    user_id = registrar_persona_usuario_sf(data)
    return jsonify({'usuario_id': user_id}), 201

@usuarios_bp.route('/registrar_empresa_cf', methods=['POST'])
def registrar_empresa_con_foto():
    data = request.get_json()
    empresa_id = registrar_empresa_usuario_cf(data)
    return jsonify({'empresa_id': empresa_id}), 201

@usuarios_bp.route('/registrar_empresa_sf', methods=['POST'])
def registrar_empresa_sin_foto():
    data = request.get_json()
    empresa_id = registrar_empresa_usuario_sf(data)
    return jsonify({'empresa_id': empresa_id}), 201