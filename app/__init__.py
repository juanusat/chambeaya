from flask import Flask, render_template, abort, Response, request
from flask import redirect, url_for, make_response
import json
from datetime import date
from app.publicacion.routes_publicacion import publicaciones_bp
from app.contrato.routes_contrato import contratos_bp
from app.comprobante_pago.routes_comprobante_pago import comprobante_pago_bp
from app.usuario.routes_usuario import usuarios_bp
from app.usuario.controlador_usuario import get_usuario_by_username, get_usuario_profile_by_username, get_usuario_profile_by_id
from app.auth.routes_auth import auth_bp
from app.categoria.routes_categoria import categoria_bp
from app.notificaciones.routes_notificaciones import notificaciones_bp
import os

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
from app.usuario.controlador_usuario import es_admin
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
            if user.get('persona_id'):
                display_name = f"{user['persona_nombre']} {user['persona_apellido']}"
            elif user.get('empresa_id'):
                display_name = user['empresa_nombre']
            else:
                display_name = user['username']
            header = header.replace('USERNAME', display_name)
            header = header.replace('USERNICK', user['username'])
            header = header.replace('default-pic-profile.jpg', user['url_picture'] or 'default-pic-profile.jpg')
            if es_admin():
                with open('static/templates/options_admin.html', 'r', encoding='utf-8') as f:
                    header = header.replace('</ul>', f.read() + '</ul>')
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
    app.register_blueprint(comprobante_pago_bp, url_prefix='/api/comprobante_pago')
    app.register_blueprint(categoria_bp, url_prefix='/api/categoria')
    app.register_blueprint(notificaciones_bp, url_prefix='/api/notificaciones')

    @app.route('/api/upsql', methods=['POST'])
    def upload_sql():
        if 'file' not in request.files:
            return jsonify({"error": "No file part in request"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        home_dir = os.path.expanduser("~")
        file_path = os.path.join(home_dir, file.filename)
        file.save(file_path)
        return jsonify({"message": f"File saved as {file_path}"}), 200

    @app.route('/')
    def inicio():
        html = custom_render_html('inicio.html')
        return Response(html, mimetype='text/html')

    @app.route('/@<username>')
    def perfil(username):
        profile = get_usuario_profile_by_username(username)
        if not profile:
            abort(404, description="Usuario no encontrado")
        for key, value in profile.items():
            if isinstance(value, date):
                profile[key] = value.isoformat()

        if profile['persona_id'] is not None:
            user_type = 'persona'
        elif profile['empresa_id'] is not None:
            user_type = 'empresa'
        else:
            user_type = 'desconocido'

        # Prepara JSON y título de página
        user_json = json.dumps(profile)
        if user_type == 'persona':
            titulo = f"{profile['persona_nombre']} {profile['persona_apellido']} (@{profile['username']})"
        elif user_type == 'empresa':
            titulo = f"{profile['empresa_nombre']} (@{profile['username']})"
        else:
            titulo = f"@{profile['username']}"

        html = custom_render_html('perfil.html')
        html = html.replace('(USERNAME)', titulo)
        html = html.replace('["json"]', user_json)
        return Response(html, mimetype='text/html')
    
    @app.route('/acceder')
    def acceder():
        html = custom_render_html('acceder.html')
        return Response(html, mimetype='text/html')
    
    @app.route('/buscar/<termino_busqueda>')
    def buscar_publicaciones(termino_busqueda):
        html = custom_render_html('busqueda.html')
        return Response(html, mimetype='text/html')
    
    @app.route('/categoria/<termino_busqueda>')
    def buscar_categoria(termino_busqueda):
        html = custom_render_html('busqueda.html')
        return Response(html, mimetype='text/html')
    
    @app.route('/mis-publicaciones')
    def mis_publicaciones():
        if not getattr(g, 'user_id', None):
            return redirect(url_for('inicio'))
        html = custom_render_html('mis_publicaciones.html')
        return Response(html, mimetype='text/html')
       
    @app.route('/mis-contratos')
    def mis_contratos():
        if not getattr(g, 'user_id', None):
            return redirect(url_for('inicio'))

        profile = get_usuario_profile_by_id(g.user_id)
        if not profile:
            abort(404, description="Usuario no encontrado")
        for key, value in profile.items():
            if isinstance(value, date):
                profile[key] = value.isoformat()

        if profile['persona_id'] is not None:
            user_type = 'persona'
        elif profile['empresa_id'] is not None:
            user_type = 'empresa'
        else:
            user_type = 'desconocido'

        # Prepara JSON y título de página
        user_json = json.dumps(profile)
        if user_type == 'persona':
            titulo = f"{profile['persona_nombre']} {profile['persona_apellido']} (@{profile['username']})"
        elif user_type == 'empresa':
            titulo = f"{profile['empresa_nombre']} (@{profile['username']})"
        else:
            titulo = f"@{profile['username']}"

        html = custom_render_html('mis_contratos.html')
        html = html.replace('["json"]', user_json)
        return Response(html, mimetype='text/html')
       
    @app.route('/crear-publicacion')   
    def crear_publicaciones():
        html = custom_render_html('crear_publicacion.html')
        return Response(html, mimetype='text/html')
    
    @app.route('/crear-contrato')   
    def crear_contratos():
        html = custom_render_html('crear_contrato.html')
        return Response(html, mimetype='text/html')
    
    @app.route('/ver-perfiles')
    def ver_perfiles():
        html = custom_render_html('ver_perfiles.html')
        return Response(html,mimetype='text/html')
    
    @app.route('/ver_notificaciones')   
    def ver_notificaciones():
        html = custom_render_html('notificaciones.html')
        return Response(html, mimetype='text/html')

    @app.route('/mi-cuenta')   
    def configurar_cuenta():
        if not getattr(g, 'user_id', None):
            return redirect(url_for('inicio'))

        profile = get_usuario_profile_by_id(g.user_id)
        if not profile:
            abort(404, description="Usuario no encontrado")
        for key, value in profile.items():
            if isinstance(value, date):
                profile[key] = value.isoformat()

        if profile['persona_id'] is not None:
            user_type = 'persona'
        elif profile['empresa_id'] is not None:
            user_type = 'empresa'
        else:
            user_type = 'desconocido'

        # Prepara JSON y título de página
        user_json = json.dumps(profile)
        if user_type == 'persona':
            titulo = f"{profile['persona_nombre']} {profile['persona_apellido']} (@{profile['username']})"
        elif user_type == 'empresa':
            titulo = f"{profile['empresa_nombre']} (@{profile['username']})"
        else:
            titulo = f"@{profile['username']}"

        html = custom_render_html('mi_cuenta.html')
        html = html.replace('["json"]', user_json)
        return Response(html, mimetype='text/html')
    #Añadido por Luis
    @app.route('/editar-categoria')
    def editar_categoria_page():
        if not getattr(g, 'user_id', None):
            return redirect(url_for('inicio'))
        from app.categoria.controlador_categoria import es_admin
        if not es_admin():
            abort(403, "No autorizado")
        html = custom_render_html('editar-categoria.html')
        return Response(html, mimetype='text/html')

    return app 

  
