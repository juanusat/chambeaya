from flask import Flask, render_template
from app.publicacion.routes_publicacion import publicaciones_bp
from app.usuario.routes_usuario import usuarios_bp


def create_app():
    app = Flask(__name__, static_folder='./../static', template_folder='./../site')

    # Registramos los Blueprints con sus prefijos
    app.register_blueprint(publicaciones_bp, url_prefix='/api/publicaciones')
    app.register_blueprint(usuarios_bp, url_prefix='/api/usuarios')
    
    @app.route('/')
    def inicio():
        return render_template('inicio.html')

    return app