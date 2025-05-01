from flask import Flask, render_template, abort
import json
from datetime import date
from app.publicacion.routes_publicacion import publicaciones_bp
from app.contrato.routes_contrato import contratos_bp
from app.usuario.routes_usuario import usuarios_bp
from app.usuario.controlador_usuario import get_usuario_by_username


def create_app():
    app = Flask(__name__, static_folder='./../static', template_folder='./../site')

    # Registramos los Blueprints con sus prefijos
    app.register_blueprint(publicaciones_bp, url_prefix='/api/publicaciones')
    app.register_blueprint(usuarios_bp, url_prefix='/api/usuarios')
    app.register_blueprint(contratos_bp, url_prefix='/api/contratos')
    
    @app.route('/')
    def inicio():
        return render_template('inicio.html')

    @app.route('/@<username>')
    def perfil(username):
        user = get_usuario_by_username(username)
        if not user:
            abort(404, description="Usuario no encontrado")
        for key, value in user.items():
            if isinstance(value, date):
                user[key] = value.isoformat()

        user_json = json.dumps(user)
        return render_template('usuario.html', user=user, user_json=user_json)

    return app