from flask import Blueprint, request, jsonify, abort, g, redirect, url_for
from app.publicacion.controlador_publicacion import (
    get_all_publicaciones,
    get_publicacion_by_id,
    create_publicacion,
    update_publicacion,
    delete_publicacion,
    darbaja_publicacion,
    get_publicacion_by_id_usuario,
    get_publicacion_by_categoria_nombre,
    get_publicacion_by_palabra,
)

publicaciones_bp = Blueprint('publicaciones', __name__)

@publicaciones_bp.route('/', methods=['GET']) # YA ESTÁ
def listar_publicaciones():
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    pubs = get_all_publicaciones(getattr(g, 'user_id', None))
    return jsonify(pubs), 200

@publicaciones_bp.route('/<int:pub_id>', methods=['GET']) # NO SE USA
def obtener_publicacion(pub_id):
    pub = get_publicacion_by_id(pub_id)
    if not pub:
        abort(404, description="Publicación no encontrada")
    return jsonify(pub), 200 

@publicaciones_bp.route('/publicador/<int:user_id>',methods=['GET'])
def obtener_publicacion_by_user_id(user_id):
    pubs = get_publicacion_by_id_usuario(user_id)
    return jsonify(pubs), 200

@publicaciones_bp.route('/categoria/<nombre_cat>',methods=['GET'])
def obtener_publicaciones_by_categoria_nombre(nombre_cat):
    pubs = get_publicacion_by_categoria_nombre(nombre_cat)
    return jsonify(pubs),200 

@publicaciones_bp.route('/<palabra>',methods=['GET'])
def obtener_publicaciones_by_palabra(palabra): 
    pubs= get_publicacion_by_palabra(palabra)
    return jsonify(pubs), 200

@publicaciones_bp.route('/nueva_publicacion', methods=['POST']) # VALIDAR G
def nueva_publicacion():
    data = request.get_json()
    new_id = create_publicacion(data)
    return jsonify({'publicacion_id': new_id}), 200

@publicaciones_bp.route('/editar_publicacion/<int:pub_id>', methods=['PUT']) # VALIDAR G
def editar_publicacion(pub_id):
    data = request.get_json()
    update_publicacion(pub_id, data)
    return jsonify({'message': 'Actualizado exitosamente'}), 200

@publicaciones_bp.route('/borrar_publicacion/<int:pub_id>', methods=['DELETE']) # NO SE USA
def borrar_publicacion(pub_id):
    delete_publicacion(pub_id)
    return jsonify({'message': 'Eliminado exitosamente'}), 200 

@publicaciones_bp.route('/dar_baja_publicacion/<int:pub_id>', methods=['PUT']) # VALIDAR G
def darbaja_publicacion(pub_id):
    darbaja_publicacion(pub_id)
    return jsonify({'message':'Dado de baja exitosamente'}), 200

