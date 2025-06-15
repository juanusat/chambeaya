from flask import Blueprint
from . import controlador_seguridad as controller

seguridad_bp = Blueprint('seguridad_bp', __name__)

@seguridad_bp.route('/sesiones', methods=['GET'])
def get_sesiones():
    return controller.obtener_sesiones_usuario_actual()


@seguridad_bp.route('/sesiones/<string:clave_hash>', methods=['DELETE'])
def delete_sesion(clave_hash):
    return controller.invalidar_sesion_usuario(clave_hash)