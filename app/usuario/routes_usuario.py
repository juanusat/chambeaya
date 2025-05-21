from flask import Blueprint, request, jsonify, abort, g, redirect, url_for
from app.usuario.controlador_usuario import (
    get_all_usuarios,
    get_usuario_by_id,
    update_usuario_persona,
    update_usuario_empresa,
    get_validar_username_usuario
)

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/', methods=['GET'])
def listar_usuarios():
    users = get_all_usuarios()
    return jsonify(users), 200


@usuarios_bp.route('/validar-username/<string:username>', methods=['GET'])
def validar_username(username):
    resultado = get_validar_username_usuario(username)
    
    if resultado['encontrado']:
        return jsonify({'existe': True, 'message': 'El username ya está en uso'}), 200
    else:
        return jsonify({'existe': False, 'message': 'El username está disponible'}), 200
