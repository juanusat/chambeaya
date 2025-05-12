from flask import Blueprint, request, jsonify, abort, g, redirect, url_for
from app.usuario.controlador_usuario import (
    get_all_usuarios,
    get_usuario_by_id,
    create_usuario,
    update_usuario,
    delete_usuario,
    update_usuario_persona,
    update_usuario_empresa,
    get_validar_username_usuario
)

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/', methods=['GET'])
def listar_usuarios():     #NO SE USA
    users = get_all_usuarios()
    return jsonify(users), 200

@usuarios_bp.route('/<int:user_id>', methods=['GET'])#NO SE USA
def obtener_usuario(user_id):
    user = get_usuario_by_id(user_id)
    if not user:
        abort(404, description="Usuario no encontrado")
    return jsonify(user), 200

@usuarios_bp.route('/', methods=['POST'])
def nuevo_usuario(): #JUAN.Lo va a revisar

    
    data = request.get_json()
    new_id = create_usuario(data)
    return jsonify({'usuario_id': new_id}), 201

# @usuarios_bp.route('/<int:user_id>', methods=['PUT'])
# def editar_usuario(user_id):
#     data = request.get_json()
#     update_usuario(user_id, data)
#     return jsonify({'message': 'Actualizado exitosamente'}), 200

#from flask import g, redirect, url_for, jsonify, request

@usuarios_bp.route('/<int:user_id>', methods=['PUT'])
def editar_usuario(user_id):
    # Verificamos si el usuario está autenticado
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))  # Redirige al inicio si no está autenticado
    
    data = request.get_json()

    # Validación básica de los datos del usuario
    required_fields = ['username', 'descripcion', 'email']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan campos obligatorios en usuario'}), 400

    try:
        # Actualizamos el usuario
        update_usuario(user_id, data)

        # Si se pasa un persona_id, actualizamos los datos de la persona
        if 'persona_id' in data:
            update_usuario_persona(data['persona_id'], data['persona'])

        # Si se pasa un empresa_id, actualizamos los datos de la empresa
        if 'empresa_id' in data:
            update_usuario_empresa(data['empresa_id'], data['empresa'])

        return jsonify({'message': 'Datos actualizados exitosamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@usuarios_bp.route('/<int:user_id>', methods=['DELETE']) #NO SE USA
def borrar_usuario(user_id):
    delete_usuario(user_id)
    return jsonify({'message': 'Eliminado exitosamente'}), 200

@usuarios_bp.route('/validar-username/<string:username>', methods=['GET']) #NO SE USA
def validar_username(username):
    resultado = get_validar_username_usuario(username)
    
    if resultado['encontrado']:
        return jsonify({'existe': True, 'message': 'El username ya está en uso'}), 200
    else:
        return jsonify({'existe': False, 'message': 'El username está disponible'}), 200
