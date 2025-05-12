from flask import Blueprint, request, jsonify, make_response, g, redirect, url_for
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from app.auth.controlador_auth import (
    verificar_credenciales, 
    actualizar_password,
    actualizar_email,
    actualizar_descripcion,
)
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    remember = data.get("remember", False)

    user = verificar_credenciales(username, password)
    if not user:
        return jsonify({"msg": "Credenciales inválidas"}), 401

    expires = timedelta(days=30) if remember else None
    access_token = create_access_token(
        identity=str(user['usuario_id']),
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

@auth_bp.route('/actualizar_password',methods=['POST'])
def update_password(): 
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    data = request.get_json()
    actualizar_password(data.get("password") , getattr(g, 'user_id', None) )
    return jsonify({'message':'Contraseña actualizada exitosamente'}), 200

@auth_bp.route('/actualizar_email',methods=['POST'])
def update_email(): 
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    data = request.get_json()
    actualizar_email(data.get("email") , getattr(g, 'user_id', None) )
    return jsonify({'message':'Email actualizado exitosamente'}), 200

@auth_bp.route('/actualizar_descripcion',methods=['POST'])
def update_descripcion(): 
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    data = request.get_json()
    actualizar_descripcion(data.get("descripcion") , getattr(g, 'user_id', None) )
    return jsonify({'message':'Descripcion actualizada exitosamente'}), 200
    
    