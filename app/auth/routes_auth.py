from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from app.auth.controlador_auth import verificar_credenciales
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = verificar_credenciales(username, password)
    if not user:
        return jsonify({"msg": "Credenciales inválidas"}), 401

    expires = timedelta(days=30) if remember else None
    access_token = create_access_token(
        identity=user['usuario_id'],
        additional_claims={"username": user['username']},
        expires_delta=expires
    )

    resp = make_response(jsonify({"msg": "Inicio de sesión exitoso"}))
    set_access_cookies(resp, access_token)
    return resp

@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"msg": "Sesión cerrada correctamente"}))
    unset_jwt_cookies(response)
    return response