from flask import Blueprint, request, jsonify, abort
from app.publicacion.controlador_publicacion import (
    get_all_publicaciones,
    get_publicacion_by_id,
    create_publicacion,
    update_publicacion,
    delete_publicacion,
)

publicaciones_bp = Blueprint('publicaciones', __name__)

@publicaciones_bp.route('/', methods=['GET'])
def listar_publicaciones():
    pubs = get_all_publicaciones()
    return jsonify(pubs), 200

@publicaciones_bp.route('/<int:pub_id>', methods=['GET'])
def obtener_publicacion(pub_id):
    pub = get_publicacion_by_id(pub_id)
    if not pub:
        abort(404, description="Publicación no encontrada")
    return jsonify(pub), 200

@publicaciones_bp.route('/', methods=['POST'])
def nueva_publicacion():
    data = request.get_json()
    new_id = create_publicacion(data)
    return jsonify({'publicacion_id': new_id}), 201

@publicaciones_bp.route('/<int:pub_id>', methods=['PUT'])
def editar_publicacion(pub_id):
    data = request.get_json()
    update_publicacion(pub_id, data)
    return jsonify({'message': 'Actualizado exitosamente'}), 200

@publicaciones_bp.route('/<int:pub_id>', methods=['DELETE'])
def borrar_publicacion(pub_id):
    delete_publicacion(pub_id)
    return jsonify({'message': 'Eliminado exitosamente'}), 200