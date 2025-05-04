from flask import Blueprint, request, jsonify, abort, g, redirect, url_for
from app.categoria.controlador_categoria import (
    get_all_categoria,
)

categoria_bp = Blueprint('categoria', __name__)

@categoria_bp.route('/', methods=['GET']) 
def listar_categorias():
    if not getattr(g, 'user_id', None):
        return redirect(url_for('inicio'))
    cats = get_all_categoria()
    return jsonify(cats), 200