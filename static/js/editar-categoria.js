const mensajeDiv = document.getElementById('mensaje');
const comboCategorias = document.getElementById('combo-categorias');
const inputBuscar = document.getElementById('buscar-nombre');
const inputEditar = document.getElementById('nombre-editar');
const inputCrear = document.getElementById('nombre-crear');
const sectionEditar = document.getElementById('editar-categoria');

let categoriaSeleccionada = null; // objeto {categoria_id, nombre}

function mostrarMensaje(texto, esError = false) {
    mensajeDiv.textContent = texto;
    mensajeDiv.className = esError ? 'error' : '';
    if (!texto) mensajeDiv.className = '';
}

async function cargarCategorias() {
    try {
        const res = await fetch('/api/categoria/');
        if (!res.ok) throw new Error('Error cargando categorías');
        const categorias = await res.json();
        // Limpia combo
        comboCategorias.innerHTML = '<option value="">-- Seleccionar categoría --</option>';
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.categoria_id;
            option.textContent = cat.nombre;
            comboCategorias.appendChild(option);
        });
    } catch (err) {
        mostrarMensaje(err.message, true);
    }
}

async function buscarCategoriaPorNombre(nombre) {
    if (!nombre.trim()) {
        mostrarMensaje('Ingrese un nombre para buscar', true);
        return;
    }
    try {
        const res = await fetch(`/api/categoria/${encodeURIComponent(nombre)}`);
        if (!res.ok) {
            mostrarMensaje('Categoría no encontrada', true);
            ocultarEdicion();
            return;
        }
        const cat = await res.json();
        // El backend devuelve {categoria_id: ...} o {error: ...}
        if (cat.error) {
            mostrarMensaje(cat.error, true);
            ocultarEdicion();
            return;
        }
        categoriaSeleccionada = cat;
        mostrarEdicion(cat);
        comboCategorias.value = cat.categoria_id;
        mostrarMensaje('');
    } catch (err) {
        mostrarMensaje('Error buscando categoría', true);
        ocultarEdicion();
    }
}

function mostrarEdicion(cat) {
    sectionEditar.style.display = 'block';
    inputEditar.value = cat.nombre || '';
}

function ocultarEdicion() {
    sectionEditar.style.display = 'none';
    inputEditar.value = '';
    categoriaSeleccionada = null;
}

async function modificarCategoria() {
    if (!categoriaSeleccionada) {
        mostrarMensaje('Seleccione o busque una categoría para modificar', true);
        return;
    }
    const nuevoNombre = inputEditar.value.trim();
    if (!nuevoNombre) {
        mostrarMensaje('El nombre de la categoría no puede quedar vacío', true);
        return;
    }
    try {
        const res = await fetch(`/api/categoria/${categoriaSeleccionada.categoria_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevoNombre })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Error modificando categoría');
        }
        mostrarMensaje('Categoría modificada correctamente');
        await cargarCategorias();
        ocultarEdicion();
    } catch (err) {
        mostrarMensaje(err.message, true);
    }
}

async function crearCategoria() {
    const nombre = inputCrear.value.trim();
    if (!nombre) {
        mostrarMensaje('Ingrese un nombre válido para la nueva categoría', true);
        return;
    }
    try {
        const res = await fetch('/api/categoria/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Error creando categoría');
        }
        mostrarMensaje('Categoría creada correctamente');
        inputCrear.value = '';
        await cargarCategorias();
    } catch (err) {
        mostrarMensaje(err.message, true);
    }
}

// Eventos

document.getElementById('btn-buscar').addEventListener('click', () => {
    buscarCategoriaPorNombre(inputBuscar.value);
});

comboCategorias.addEventListener('change', () => {
    const id = comboCategorias.value;
    if (!id) {
        ocultarEdicion();
        mostrarMensaje('');
        return;
    }
    // Buscar categoría por id en el combo para mostrar nombre y editar
    const opcion = comboCategorias.selectedOptions[0];
    categoriaSeleccionada = {
        categoria_id: parseInt(id),
        nombre: opcion.textContent
    };
    mostrarEdicion(categoriaSeleccionada);
    mostrarMensaje('');
});

document.getElementById('btn-modificar').addEventListener('click', modificarCategoria);

document.getElementById('btn-crear').addEventListener('click', crearCategoria);

// Carga inicial
document.addEventListener('DOMContentLoaded', cargarCategorias);
