from flask import Blueprint, request, jsonify, abort

from app.contrato.controlador_contrato import (
  get_all_contratos, 
  get_contratos_by_prestador_id,
  get_contratos_by_cliente_id,
  get_contratos_by_publicacion_id,
  get_contratos_by_categoria_nombre,
)

contratos_bp = Blueprint('contratos', __name__)

@contratos_bp.route('/', methods=['GET'])
def listar_contratos():
    conts = get_all_contratos()
    return jsonify(conts), 200

@contratos_bp.route('/prestador/<int:prestador_id>', methods=['GET'])
def obtener_contratos_por_prestador_id(prestador_id):
    conts = get_contratos_by_prestador_id(prestador_id)
    return jsonify(conts), 200

@contratos_bp.route('/cliente/<int:cliente_id>', methods=['GET'])
def obtener_contratos_por_cliente_id(cliente_id):
    conts = get_contratos_by_cliente_id(cliente_id)
    return jsonify(conts), 200

@contratos_bp.route('/publicacion/<int:publicacion_id>', methods=['GET'])
def obtener_contratos_por_publicacion_id(publicacion_id):
    conts = get_contratos_by_publicacion_id(publicacion_id)
    return jsonify(conts), 200

@contratos_bp.route('/categoria/<nom_cat>', methods=['GET'])
def obtener_contratos_por_categoria_nombre(nom_cat):
    conts = get_contratos_by_categoria_nombre(nom_cat)
    return jsonify(conts), 200