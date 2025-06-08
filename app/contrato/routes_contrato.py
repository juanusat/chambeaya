from flask import Blueprint, request, jsonify, abort, g, redirect, url_for
from app.bd_conn import get_db_connection
import pymysql
from app.contrato.controlador_contrato import ( 
  get_mis_contratos, 
  get_contratos_by_prestador_id,
  get_contratos_by_cliente_id,
  get_contratos_by_publicacion_id,
  get_contratos_by_categoria_nombre,
  get_contratos_by_estado,
  create_contrato,
  update_contrato,
  get_contrato_data,
  marcar_contrato_completado,
  actualizar_estado_contrato,
  finalizar_contrato,
  obtener_comentario_del_contrato,
  create_comentario,
  update_comentario,
  contrato_pertenece_a_cliente,
  estado_del_contrato,
  delete_comentario,
  finalizar_contrato
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

@contratos_bp.route('/editar_contrato/<int:conts_id>', methods=['PUT']) # VALIDAR G
def update_contrato(conts_id):
    data = request.get_json()
    update_contrato(conts_id, data)
    return jsonify({'message': 'Actualizado exitosamente'}), 200

@contratos_bp.route('/comentario/<int:conts_id>', methods=['GET'])
def comentario_por_contrato(conts_id):

    comentario = obtener_comentario_del_contrato(conts_id)
    if comentario:
        calificacion, texto, fecha_creacion, nombre_cliente, nombre_prestador = comentario
        resultado = {
            "calificacion": calificacion,
            "comentario": texto,
            "fecha_creacion": fecha_creacion.isoformat() if fecha_creacion else None,
            "nombre_cliente": nombre_cliente,
            "nombre_prestador": nombre_prestador
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

    # Validar datos mínimos
    if not data or 'calificacion' not in data or 'comentario' not in data:
        return jsonify({'mensaje': 'Faltan datos obligatorios'}), 400

    if not (1 <= data['calificacion'] <= 5):
        return jsonify({'mensaje': 'Calificación inválida'}), 400

    data['contrato_id'] = conts_id
    create_comentario(data)

    return jsonify({'message': 'Comentario creado exitosamente'}), 201

@contratos_bp.route('/editar_comentario/<int:conts_id>', methods=['PUT'])
def editar_comentario_contrato(conts_id):
    user_id = getattr(g, 'user_id', None)
    if not user_id:
        return jsonify({'error': 'No autorizado'}), 401

    # Verifica que el contrato pertenezca al cliente que hace la petición
    if not contrato_pertenece_a_cliente(conts_id, user_id):
        return jsonify({'error': 'Solo el cliente puede modificar el comentario'}), 403

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Datos JSON no proporcionados'}), 400

    # Validar campos obligatorios (ejemplo: comentario y calificacion)
    comentario = data.get('comentario')
    calificacion = data.get('calificacion')

    if comentario is None or calificacion is None:
        return jsonify({'error': 'Faltan campos obligatorios'}), 400

    # Llama a la función que actualiza el comentario en la base de datos
    actualizado = update_comentario(conts_id, data)
    if not actualizado:
        return jsonify({'error': 'Comentario no encontrado para este contrato'}), 404

    return jsonify({'message': 'Comentario actualizado exitosamente'}), 200

@contratos_bp.route('/editar_contrato/<int:conts_id>/finalizado', methods=['PUT'])
def finalizar_contrato_route(conts_id):
    try:
        finalizar_contrato(conts_id)
        return jsonify({'message': 'Contrato finalizado exitosamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@contratos_bp.route('/eliminar_comentario/<int:conts_id>', methods=['DELETE'])
def eliminar_comentario_contrato(conts_id):
    user_id = getattr(g, 'user_id', None)
    if not user_id:
        abort(401, 'No autorizado')
    
    if not contrato_pertenece_a_cliente(conts_id, user_id):
        abort(403, 'Solo el cliente puede eliminar el comentario')
    
    estado = estado_del_contrato(conts_id)
    if estado != 'finalizado':
        abort(400, 'Solo se puede eliminar comentarios de contratos finalizados')

    if delete_comentario(conts_id):
        return jsonify({'message': 'Comentario eliminado exitosamente'}), 200
    else:
        abort(404, 'Comentario no encontrado')

@contratos_bp.route('/estado_detalle/<int:conts_id>', methods=['GET'])
def estado_por_contrato(conts_id):
    try:
        estado = estado_del_contrato(conts_id)
        if estado:
            return jsonify({"estado": estado}), 200
        else:
            return jsonify({"mensaje": "Contrato no encontrado o sin estado"}), 404
    except Exception as e:
        print(f"Error al obtener estado: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

@contratos_bp.route('/<int:contrato_id>', methods=['GET'])
def obtener_contrato_por_id(contrato_id):
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(""" 
                SELECT 
                    c.contrato_id,
                    p.titulo AS servicio,
                    p.descripcion AS descripcion_servicio,
                    CASE
                        WHEN per_pres.usuario_id IS NOT NULL THEN CONCAT(per_pres.nombre, ' ', per_pres.apellido)
                        WHEN emp_pres.usuario_id IS NOT NULL THEN emp_pres.nombre
                        ELSE 'Desconocido'
                    END AS empleador,
                    u_pres.username AS username_empleado,
                    CASE
                        WHEN per_cli.usuario_id IS NOT NULL THEN CONCAT(per_cli.nombre, ' ', per_cli.apellido)
                        WHEN emp_cli.usuario_id IS NOT NULL THEN emp_cli.nombre
                        ELSE 'Desconocido'
                    END AS cliente,
                    u_cli.username AS username_cliente,
                    u_pres.url_picture AS imagenP,
                    u_cli.url_picture AS imagenC,
                    c.precio,
                    COALESCE(SUM(cc.monto), 0) AS precio_pagado,  -- suma de pagos hechos para el contrato
                    c.estado,
                    c.fecha_inicio,
                    c.fecha_finalizacion
                FROM contrato c
                JOIN publicacion p ON c.servicio_id = p.publicacion_id
                JOIN usuario u_cli ON c.cliente_id = u_cli.usuario_id
                LEFT JOIN persona per_cli ON per_cli.usuario_id = u_cli.usuario_id
                LEFT JOIN empresa emp_cli ON emp_cli.usuario_id = u_cli.usuario_id
                JOIN usuario u_pres ON c.prestador_id = u_pres.usuario_id
                LEFT JOIN persona per_pres ON per_pres.usuario_id = u_pres.usuario_id
                LEFT JOIN empresa emp_pres ON emp_pres.usuario_id = u_pres.usuario_id
                LEFT JOIN comprobante_contrato cc ON cc.contrato_id = c.contrato_id
                WHERE c.contrato_id = %s AND (c.prestador_id = %s OR c.cliente_id = %s)
                GROUP BY 
                    c.contrato_id,
                    p.titulo,
                    p.descripcion,
                    per_pres.usuario_id,
                    emp_pres.usuario_id,
                    u_pres.username,
                    per_cli.usuario_id,
                    emp_cli.usuario_id,
                    u_cli.username,
                    u_pres.url_picture,
                    u_cli.url_picture,
                    c.precio,
                    c.estado,
                    c.fecha_inicio,
                    c.fecha_finalizacion;
            """, (contrato_id, getattr(g, 'user_id', None), getattr(g, 'user_id', None)))
            contrato = cursor.fetchone()
            if contrato:
                return jsonify(contrato), 200
            else:
                return jsonify({'error': 'Contrato no encontrado o acceso denegado'}), 404
    finally:
        conn.close()

@contratos_bp.route('/editar_contrato/<int:conts_id>/completado', methods=['PUT'])
def completar_contrato_route(conts_id):
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    try:
        contrato = get_contrato_data(conts_id)
        if not contrato:
            return jsonify({'error': 'Contrato no encontrado'}), 404
        if g.user_id != contrato.get('prestador_id'):
            return jsonify({'error': 'Acceso denegado'}), 403
        if contrato['precio_pagado'] >= contrato['precio']:
            finalizar_contrato(conts_id)
            return jsonify({'message': 'Contrato finalizado exitosamente'}), 200
        marcar_contrato_completado(conts_id)
        return jsonify({'message': 'Contrato marcado como completado'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contratos_bp.route('/editar_contrato/<int:conts_id>/finalizado', methods=['PUT'])
def finalizar_contrato_route(conts_id):
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    try:
        contrato = get_contrato_data(conts_id)
        if not contrato:
            return jsonify({'error': 'Contrato no encontrado'}), 404
        if g.user_id not in (contrato.get('prestador_id'), contrato.get('cliente_id')):
            return jsonify({'error': 'Acceso denegado'}), 403
        if contrato['estado'] == 'completado' and contrato['precio_pagado'] >= contrato['precio']:
            finalizar_contrato(conts_id)
            return jsonify({'message': 'Contrato finalizado exitosamente'}), 200
        return jsonify({'error': 'No se puede finalizar: debe estar completado por el prestador y pagado al 100%'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contratos_bp.route('/editar_contrato/<int:conts_id>/<string:nom_estado>', methods=['PUT'])
def modificar_contrato_estado_route(conts_id, nom_estado):
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    try:
        contrato = get_contrato_data(conts_id)
        if not contrato:
            return jsonify({'error': 'Contrato no encontrado'}), 404
        actualizar_estado_contrato(conts_id, nom_estado)
        return jsonify({'message': f"Estado del contrato actualizado a '{nom_estado}'"}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500