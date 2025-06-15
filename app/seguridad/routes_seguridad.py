# app/seguridad/routes_seguridad.py

from flask import Blueprint, request
from . import controlador_seguridad as controller

# Creamos un Blueprint para agrupar las rutas de seguridad
# El primer argumento 'seguridad_api' es el nombre del blueprint.
# El segundo '__name__' es estándar.
# El tercero 'url_prefix' antepone '/api/seguridad' a todas las rutas del blueprint.
seguridad_bp = Blueprint('seguridad_bp', __name__)

@seguridad_bp.route('/sesiones', methods=['GET'])
def get_sesiones():
    """
    Endpoint para obtener la lista de sesiones del usuario actual.
    Llamada desde el frontend con: fetch('/api/seguridad/sesiones')
    """
    return controller.obtener_sesiones_usuario_actual()


@seguridad_bp.route('/sesiones/<string:clave_hash>', methods=['DELETE'])
def delete_sesion(clave_hash):
    """
    Endpoint para eliminar una sesión específica por su clave_hash.
    Llamada desde el frontend con: fetch('/api/seguridad/sesiones/LA_CLAVE_HASH', { method: 'DELETE' })
    """
    return controller.invalidar_sesion_usuario(clave_hash)