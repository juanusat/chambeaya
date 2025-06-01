from flask import Blueprint, request, jsonify, abort, g, redirect, url_for
from app.usuario.controlador_usuario import es_admin
from app.categoria.controlador_categoria import (
    get_all_categoria,
    get_categoria_id,
    #Añadido por Luis
    crear_categoria,
    modificar_categoria
)

categoria_bp = Blueprint('categoria', __name__)

@categoria_bp.route('/', methods=['GET']) 
def listar_categorias():
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    cats = get_all_categoria()
    return jsonify(cats), 200 

@categoria_bp.route('/<nom_cat>', methods=['GET']) 
def buscar_categoria_id_by_nombre(nom_cat):
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    cat = get_categoria_id(nom_cat)
    if not cat:
        return jsonify({"error": "Categoría no encontrada"}), 404

    return jsonify(cat), 200

#Añadido por Luis
@categoria_bp.route('/', methods=['POST'])
def agregar_categoria():
    if not es_admin():
        abort(403, "No autorizado")
    data = request.get_json()
    nombre = data.get("nombre")
    if not nombre:
        abort(400, "Nombre de categoría requerido")
    try:
        crear_categoria(nombre)
    except Exception as e:
        abort(500, str(e))
    return jsonify({"message": "Categoría creada"}), 201

@categoria_bp.route('/<int:categoria_id>', methods=['PUT'])
def editar_categoria(categoria_id):
    if not es_admin():
        abort(403, "No autorizado")
    data = request.get_json()
    nuevo_nombre = data.get("nombre")
    if not nuevo_nombre:
        abort(400, "Nuevo nombre requerido")
    try:
        modificar_categoria(categoria_id, nuevo_nombre)
    except Exception as e:
        abort(500, str(e))
    return jsonify({"message": "Categoría modificada"}), 200