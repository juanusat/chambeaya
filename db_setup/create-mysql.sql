CREATE TABLE contrato (
    contrato_id INT AUTO_INCREMENT PRIMARY KEY,
    servicio_id INT,
    cliente_id INT,
    prestador_id INT,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en progreso', 'completado', 'cancelado')),
    fecha_inicio DATE,
    fecha_finalizacion DATE
);

CREATE TABLE usuario (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(64) NOT NULL,
    fecha_creacion DATE,
    admin TINYINT(1) NOT NULL,
    url_picture VARCHAR(40)
);

CREATE TABLE comprobante_contrato (
    comprobante_contrato_id INT AUTO_INCREMENT PRIMARY KEY,
    contrato_id INT,
    monto DECIMAL(7,2) NOT NULL,
    metodo_pago_id INT,
    fecha_pago DATE
);

CREATE TABLE comentario (
    comentario_id INT AUTO_INCREMENT PRIMARY KEY,
    contrato_id INT,
    calificacion INT,
    comentario VARCHAR(255),
    fecha_creacion DATE
);

CREATE TABLE persona (
    persona_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE
);

CREATE TABLE metodo_pago (
    metodo_pago_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE publicacion_medio (
    publicacion_medio_id INT AUTO_INCREMENT PRIMARY KEY,
    pulicacion_id INT NOT NULL,
    tamanio INT,
    fecha_hora TIMESTAMP
);

CREATE TABLE empresa (
    empresa_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    fecha_creacion DATE
);

CREATE TABLE categoria (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE publicacion (
    publicacion_id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT,
    usuario_id INT,
    titulo VARCHAR(80) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    precio DECIMAL NOT NULL,
    fecha_creacion DATE
);

-- Claves foráneas
ALTER TABLE comentario
ADD CONSTRAINT fk_comentario_contrato_id FOREIGN KEY (contrato_id) REFERENCES contrato(contrato_id);

ALTER TABLE comprobante_contrato
ADD CONSTRAINT fk_comprobante_contrato_contrato_id FOREIGN KEY (contrato_id) REFERENCES contrato(contrato_id);

ALTER TABLE comprobante_contrato
ADD CONSTRAINT fk_comprobante_contrato_metodo_pago_id FOREIGN KEY (metodo_pago_id) REFERENCES metodo_pago(metodo_pago_id);

ALTER TABLE contrato
ADD CONSTRAINT fk_contrato_cliente_id FOREIGN KEY (cliente_id) REFERENCES usuario(usuario_id);

ALTER TABLE contrato
ADD CONSTRAINT fk_contrato_prestador_id FOREIGN KEY (prestador_id) REFERENCES usuario(usuario_id);

ALTER TABLE contrato
ADD CONSTRAINT fk_contrato_servicio_id FOREIGN KEY (servicio_id) REFERENCES publicacion(publicacion_id);

ALTER TABLE empresa
ADD CONSTRAINT fk_empresa_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id);

ALTER TABLE persona
ADD CONSTRAINT fk_persona_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id);

ALTER TABLE publicacion
ADD CONSTRAINT fk_publicacion_categoria_id FOREIGN KEY (categoria_id) REFERENCES categoria(categoria_id);

ALTER TABLE publicacion
ADD CONSTRAINT fk_publicacion_usuario_id FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id);

ALTER TABLE publicacion_medio
ADD CONSTRAINT fk_publicacion_medio_publicacion_id FOREIGN KEY (pulicacion_id) REFERENCES publicacion(publicacion_id);
