import os
import random
import datetime
from datetime import timedelta
from flask import Blueprint, request, jsonify, make_response, g, redirect, url_for, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from app.auth.controlador_auth import (
    verificar_credenciales,
    registrar_empresa,
    registrar_persona,
    actualizar_password
)
import os
from werkzeug.utils import secure_filename
from app.seguridad.d_conn import crear_sesion

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

    from app.auth.controlador_auth import registrar_clave_sesion
    clave_sesion = registrar_clave_sesion(user['usuario_id'], user['username'], user['email'])
    expires = timedelta(days=30) if remember else None
    access_token = create_access_token(
        identity=str(user['usuario_id']),
        additional_claims={
            "username": user['username'],
            "clave": clave_sesion
        },
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

@auth_bp.route('/registrar_empresa', methods=['POST'])
def registrar_empresa_route():
    nombre = request.form.get('nombre')
    ruc = request.form.get('ruc')
    fecha_creacion = request.form.get('fechaCreacion')
    correo = request.form.get('correo')
    usuario = request.form.get('usuario')
    contrasena = request.form.get('contrasena')
    try:
        registrar_empresa(
            nombre,
            ruc,
            fecha_creacion,
            correo,
            usuario,
            contrasena
        )
        return jsonify({}), 200
    except Exception as e:
        return jsonify({'msg': str(e)}), 400

@auth_bp.route('/registrar_persona', methods=['POST'])
def registrar_persona_route():
    nombres = request.form.get('nombres')
    apellidos = request.form.get('apellidos')
    fecha_nacimiento = request.form.get('fechaNacimiento')
    telefono = request.form.get('telefono')
    correo = request.form.get('correo')
    usuario = request.form.get('usuario')
    contrasena = request.form.get('contrasena')
    foto = request.files.get('foto')

    timestamp = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
    random_number = random.randint(10, 99)
    extension = secure_filename(foto.filename).rsplit('.', 1)[-1]
    filename = f"{usuario}--{timestamp}-{random_number}.{extension}"

    upload_folder = os.path.abspath(os.path.join(current_app.root_path, '..', 'static', 'uploads'))
    os.makedirs(upload_folder, exist_ok=True)
    foto_path = os.path.join(upload_folder, filename)
    foto.save(foto_path)

    try:
        registrar_persona(
            nombres,
            apellidos,
            telefono,
            fecha_nacimiento,
            correo,
            usuario,
            contrasena,
            filename
        )
        return jsonify({}), 200
    except Exception as e:
        return jsonify({'msg': str(e)}), 400
    
@auth_bp.route('/username', methods=['GET'])
def get_current_username():
    if not getattr(g, 'user_id', None):
        return jsonify({"error": "No autenticado. Por favor, inicia sesión."}), 401
    current_username = getattr(g, 'username', None)
    if current_username:
        return jsonify({"username": current_username}), 200
    else:
        return jsonify({"error": "No se pudo obtener el nombre de usuario."}), 500
