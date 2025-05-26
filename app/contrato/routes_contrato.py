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
  obtener_comentario_del_contrato,
  create_comentario,
  update_comentario,
  contrato_pertenece_a_cliente
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



#-----------------------------------------------------------------
@contratos_bp.route('/nuevo_contrato', methods=['POST'])
def nuevo_contrato():
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio')) 
    data = request.get_json()
    required_fields = ['servicio_id', 'cliente_id', 'precio', 'fecha_inicio', 'fecha_finalizacion']
    if not all(field in data and data[field] is not None for field in required_fields):
        return jsonify({'error': 'Faltan campos requeridos o son nulos'}), 400
    try:
        new_id = create_contrato(getattr(g, 'user_id', None), data)
        return jsonify({'contrato_id': new_id}), 200
    except Exception as e:
        return jsonify({'error': 'Error al crear el contrato', 'details': str(e)}), 500
#-----------------------------------------------------------------


@contratos_bp.route('/editar_contrato/<int:conts_id>', methods=['PUT']) # VALIDAR G
def editar_publicacion(conts_id):
    data = request.get_json()
    update_contrato(conts_id, data)
    return jsonify({'message': 'Actualizado exitosamente'}), 200

@contratos_bp.route('/editar_contrato/cancelar/<int:conts_id>', methods=['PUT']) # VALIDAR G
def darbaja_publicacion(conts_id):
    darbaja_contrato(conts_id)
    return jsonify({'message': 'Actualizado exitosamente'}), 200

@contratos_bp.route('/comentario/<int:conts_id>', methods=['GET'])
def comentario_por_contrato(conts_id):
    comentario = obtener_comentario_del_contrato(conts_id)
    if comentario:
        calificacion, texto, fecha_creacion = comentario
        resultado = {
            "calificacion": calificacion,
            "comentario": texto,
            "fecha_creacion": fecha_creacion.isoformat() if fecha_creacion else None
        }
        return jsonify(resultado), 200
    else:
        return jsonify({"mensaje": "No se encontró comentario para el contrato"}), 404

@contratos_bp.route('/nuevo_comentario/<int:conts_id>', methods=['POST'])
def crear_comentario_contrato(conts_id):
    user_id = getattr(g, 'user_id', None)
    if not user_id:
        abort(401, 'No autorizado')

    if not contrato_pertenece_a_cliente(conts_id, user_id):
        abort(403, 'Solo el cliente puede comentar')

    data = request.get_json()
    data['contrato_id'] = conts_id
    create_comentario(data)
    return jsonify({'message': 'Comentario creado exitosamente'}), 201


@contratos_bp.route('/editar_comentario/<int:comentario_id>', methods=['PUT'])
def editar_comentario_contrato(comentario_id):
    user_id = getattr(g, 'user_id', None)
    if not user_id:
        abort(401, 'No autorizado')

    data = request.get_json()
    contrato_id = data.get('contrato_id')

    if not contrato_pertenece_a_cliente(contrato_id, user_id):
        abort(403, 'Solo el cliente puede modificar el comentario')

    update_comentario(comentario_id, data)
    return jsonify({'message': 'Comentario actualizado exitosamente'}), 200