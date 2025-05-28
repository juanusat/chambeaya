from flask import Blueprint, request, jsonify, abort, g, redirect, url_for

from app.notificaciones.controlador_notificaciones import (
    consultarNotificaciones,
)


notificaciones_bp = Blueprint('notificaciones', __name__)

@notificaciones_bp.route('/', methods=['GET'])
def listar_notificacioness():
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    nots = consultarNotificaciones(getattr(g, 'user_id', None))
    return jsonify(nots), 200