from flask import Blueprint, request, jsonify, abort, g, redirect, url_for
from app.usuario.controlador_usuario import (
    get_all_usuarios,
    get_usuario_by_id,
    actualizar_email,
    actualizar_descripcion,
    get_validar_username_usuario,
    get_usuario_by_username,
    buscar_usuarios_para_autocompletar_db,
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

@usuarios_bp.route('/actualizar_email',methods=['POST'])
def update_email(): 
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    data = request.get_json()
    actualizar_email(data.get("email") , getattr(g, 'user_id', None) )
    return jsonify({'message':'Email actualizado exitosamente'}), 200

@usuarios_bp.route('/actualizar_descripcion',methods=['POST'])
def update_descripcion(): 
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    data = request.get_json()
    actualizar_descripcion(data.get("descripcion") , getattr(g, 'user_id', None) )
    return jsonify({'message':'Descripcion actualizada exitosamente'}), 200

@usuarios_bp.route('/<username>',methods=['GET'])
def buscar_usuario_by_username(username):
    resultado = get_usuario_by_username(username)
    if not resultado:
        abort(404, description="Publicación no encontrada")
    return jsonify(resultado), 200  

@usuarios_bp.route('/buscar_autocompletar', methods=['GET'])
def api_buscar_usuarios_autocompletar():
    if not getattr(g, 'user_id', None):
        return jsonify({"error": "No autorizado"}), 401

    query = request.args.get('q', '').strip()
    if not query:
        return jsonify([])
    usuarios_encontrados = buscar_usuarios_para_autocompletar_db(query)
    return jsonify(usuarios_encontrados), 200
