from flask import Blueprint, request, jsonify, abort

from app.comprobante_pago.controlador_comprobante_pago import (
    get_comprobantes_by_cliente_id,
    get_comprobantes_by_prestador_id,
    create_comprobante_pago,
    get_all_comprobantes_pago   
)

comprobante_pago_bp = Blueprint('comprobante_pago', __name__)

# Obtener todos los comprobantes de contrato (sin filtro)
@comprobante_pago_bp.route('/', methods=['GET'])
def listar_comprobantes():
        comprobantes = get_all_comprobantes_pago()
        return jsonify(comprobantes), 200
    

# Obtener los comprobantes de un cliente
@comprobante_pago_bp.route('/cliente/<int:cliente_id>', methods=['GET'])
def listar_comprobantes_cliente(cliente_id):
    try:
        comprobantes = get_comprobantes_by_cliente_id(cliente_id)
        return jsonify(comprobantes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Obtener los comprobantes de un prestador
@comprobante_pago_bp.route('/prestador/<int:prestador_id>', methods=['GET'])
def listar_comprobantes_prestador(prestador_id):
    try:
        comprobantes = get_comprobantes_by_prestador_id(prestador_id)
        return jsonify(comprobantes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Crear un nuevo comprobante de contrato
@comprobante_pago_bp.route('/', methods=['POST'])
def crear_comprobante():
    data = request.get_json()
    try:
        comprobante_id = create_comprobante_pago(data)
        return jsonify({'comprobante_contrato_id': comprobante_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500