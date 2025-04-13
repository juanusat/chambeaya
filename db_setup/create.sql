CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    admin BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE personas (
    id SERIAL PRIMARY KEY,
    usuario_id INT UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE
);

CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    usuario_id INT UNIQUE,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE servicios (
    id SERIAL PRIMARY KEY,
    usuario_id INT,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    categoria_id INT,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contratos (
    id SERIAL PRIMARY KEY,
    cliente_id INT,
    prestador_id INT,
    servicio_id INT,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'en progreso', 'completado', 'cancelado')) DEFAULT 'pendiente',
    fecha_inicio TIMESTAMP DEFAULT NOW(),
    fecha_finalizacion TIMESTAMP
);

CREATE TABLE metodo_pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE comprobante_contrato (
    id SERIAL PRIMARY KEY,
    contrato_id INT,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago_id INT,
    fecha_pago TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comentarios (
    id SERIAL PRIMARY KEY,
    contrato_id INT,
    cliente_id INT,
    prestador_id INT,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

ALTER TABLE personas ADD CONSTRAINT fk_persona_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id);
ALTER TABLE empresas ADD CONSTRAINT fk_empresa_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id);
ALTER TABLE servicios ADD CONSTRAINT fk_servicio_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id);
ALTER TABLE servicios ADD CONSTRAINT fk_servicio_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id);
ALTER TABLE contratos ADD CONSTRAINT fk_contrato_cliente FOREIGN KEY (cliente_id) REFERENCES usuarios(id);
ALTER TABLE contratos ADD CONSTRAINT fk_contrato_prestador FOREIGN KEY (prestador_id) REFERENCES usuarios(id);
ALTER TABLE contratos ADD CONSTRAINT fk_contrato_servicio FOREIGN KEY (servicio_id) REFERENCES servicios(id);
ALTER TABLE comprobante_contrato ADD CONSTRAINT fk_comprobante_contrato FOREIGN KEY (contrato_id) REFERENCES contratos(id);
ALTER TABLE comprobante_contrato ADD CONSTRAINT fk_comprobante_metodo FOREIGN KEY (metodo_pago_id) REFERENCES metodo_pago(id);
ALTER TABLE comentarios ADD CONSTRAINT fk_comentario_contrato FOREIGN KEY (contrato_id) REFERENCES contratos(id);
ALTER TABLE comentarios ADD CONSTRAINT fk_comentario_cliente FOREIGN KEY (cliente_id) REFERENCES usuarios(id);
ALTER TABLE comentarios ADD CONSTRAINT fk_comentario_prestador FOREIGN KEY (prestador_id) REFERENCES usuarios(id);