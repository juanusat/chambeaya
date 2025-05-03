from flask import Flask, render_template, abort, Response, request
from flask import redirect, url_for, make_response
import json
from datetime import date
from app.publicacion.routes_publicacion import publicaciones_bp
from app.contrato.routes_contrato import contratos_bp
from app.usuario.routes_usuario import usuarios_bp
from app.usuario.controlador_usuario import get_usuario_by_username
from app.auth.routes_auth import auth_bp
from flask_jwt_extended import (
    JWTManager,
    verify_jwt_in_request,
    get_jwt_identity,
    get_jwt,
    unset_jwt_cookies
)
from flask_jwt_extended.exceptions import NoAuthorizationError
from jwt.exceptions import ExpiredSignatureError
from flask import g
from app.config import JWT_CONFIG, SECRET_KEY
import jwt

def custom_render_html(template_path):
    with open(f"site/{template_path}", 'r', encoding='utf-8') as f:
        html = f.read()

    header = ''
    if getattr(g, 'user_id', None):
        user = get_usuario_by_username(g.username)
        if user:
            header_file = 'static/templates/header_user.html'
            with open(header_file, 'r', encoding='utf-8') as f:
                header = f.read()
            header = header.replace('USERNAME', user['nombre'] + ' ' + user['apellido'])
            header = header.replace('USERNICK', user['username'])
            header = header.replace('default-pic-profile.jpg', user['url_picture'] or 'default-pic-profile.jpg')
    else:
        with open('static/templates/header.html', 'r', encoding='utf-8') as f:
            header = f.read()

    with open('static/templates/footer.html', 'r', encoding='utf-8') as f:
        footer = f.read()

    html = html.replace('<div class="header"></div>', header)
    html = html.replace('<div class="footer"></div>', footer)

    return html

def create_app():
    app = Flask(__name__, static_folder='./../static', template_folder='./../site')
    for key, value in JWT_CONFIG.items():
        app.config[key] = value
    
    JWTManager(app)
    
    @app.errorhandler(ExpiredSignatureError)
    def handle_token_expired_error(error):
        # Eliminar la cookie del JWT
        response = make_response(redirect(url_for('inicio')))
        unset_jwt_cookies(response)
    
        return response
    @app.before_request
    def cargar_usuario_en_g():
        try:
            verify_jwt_in_request()
            g.user_id = int(get_jwt_identity())
            claims = get_jwt()
            g.username = claims.get("username")
        except NoAuthorizationError:
            g.user_id = None
            g.username = None

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(publicaciones_bp, url_prefix='/api/publicaciones')
    app.register_blueprint(usuarios_bp, url_prefix='/api/usuarios')
    app.register_blueprint(contratos_bp, url_prefix='/api/contratos')
    
    @app.route('/')
    def inicio():
        html = custom_render_html('inicio.html')
        return Response(html, mimetype='text/html')

    @app.route('/@<username>')
    def perfil(username):
        user_dict = get_usuario_by_username(username)
        if not user_dict:
            abort(404, description="Usuario no encontrado")
        for key, value in user_dict.items():
            if isinstance(value, date):
                user_dict[key] = value.isoformat()

        user_json = json.dumps(user_dict)
        html = custom_render_html('usuario.html')
        titulo_pagina = f"{user_dict['nombre']} {user_dict['apellido']}"
        titulo_pagina += f" (@{user_dict['username']})"
        html = html.replace('(USERNAME)', titulo_pagina)
        html = html.replace('["json"]', user_json)
        return Response(html, mimetype='text/html')

    @app.route('/acceder')
    def acceder():
        html = custom_render_html('acceder.html')
        return Response(html, mimetype='text/html')

    return app