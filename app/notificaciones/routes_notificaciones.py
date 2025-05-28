from flask import Blueprint, request, jsonify, abort, g, redirect, url_for

from app.notificaciones.controlador_notificaciones import (
    consultarNotificaciones,
)




notificaciones_bp = Blueprint('notificaciones', __name__)

@notificaciones_bp.route('/contratos/<int:contrato_id>', methods=['GET'])
def listar_contratos(contrato_id):
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    nots = consultarNotificaciones(getattr(g, 'user_id', None),contrato_id)
    return jsonify(nots), 200