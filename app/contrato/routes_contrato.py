from flask import Blueprint, request, jsonify, abort, g, redirect, url_for

from app.contrato.controlador_contrato import ( 
  get_mis_contratos, 
  get_contratos_by_prestador_id,
  get_contratos_by_cliente_id,
  get_contratos_by_publicacion_id,
  get_contratos_by_categoria_nombre,
  get_contratos_by_estado,
  create_contrato,
  update_contrato,
  darbaja_contrato,
)

contratos_bp = Blueprint('contratos', __name__)

@contratos_bp.route('/', methods=['GET'])
def listar_contratos():
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    conts = get_mis_contratos(getattr(g, 'user_id', None))
    return jsonify(conts), 200

@contratos_bp.route('/prestador/<int:prestador_id>', methods=['GET']) # NO SE USA
def obtener_contratos_por_prestador_id(prestador_id):
    conts = get_contratos_by_prestador_id(prestador_id)
    return jsonify(conts), 200

@contratos_bp.route('/cliente/<int:cliente_id>', methods=['GET']) # NO SE USA
def obtener_contratos_por_cliente_id(cliente_id):
    conts = get_contratos_by_cliente_id(cliente_id)
    return jsonify(conts), 200

@contratos_bp.route('/publicacion/<int:publicacion_id>', methods=['GET']) # VALIDAR G
def obtener_contratos_por_publicacion_id(publicacion_id):
    conts = get_contratos_by_publicacion_id(publicacion_id)
    return jsonify(conts), 200

@contratos_bp.route('/categoria/<nom_cat>', methods=['GET']) # QUIZÁ SE USE
def obtener_contratos_por_categoria_nombre(nom_cat):
    conts = get_contratos_by_categoria_nombre(nom_cat)
    return jsonify(conts), 200

@contratos_bp.route('/estado/<estado_nombre>',methods=['GET']) # QUIZÁ SE USE
def obtener_contratos_por_estado_nombre(estado_nombre):
    conts= get_contratos_by_estado(estado_nombre)
    return jsonify(conts), 200 

@contratos_bp.route('/nuevo_contrato', methods=['POST']) # VALIDAR G
def nuevo_contrato():
    data = request.get_json()
    new_id = create_contrato(data)
    return jsonify({'contrato_id': new_id}), 200 

@contratos_bp.route('/editar_contrato/<int:conts_id>', methods=['PUT']) # VALIDAR G
def editar_publicacion(conts_id):
    data = request.get_json()
    update_contrato(conts_id, data)
    return jsonify({'message': 'Actualizado exitosamente'}), 200

@contratos_bp.route('/editar_contrato/cancelar/<int:conts_id>', methods=['PUT']) # VALIDAR G
def darbaja_publicacion(conts_id):
    darbaja_contrato(conts_id)
    return jsonify({'message': 'Actualizado exitosamente'}), 200