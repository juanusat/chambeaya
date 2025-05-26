from flask import Blueprint, request, jsonify, abort, g, redirect, url_for
from app.categoria.controlador_categoria import (
    get_all_categoria,
    get_categoria_id,
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