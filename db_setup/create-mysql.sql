-- Conectarse a MariaDB y asegurarse de que estamos en la base de datos correcta
DROP DATABASE IF EXISTS `chambeaya-t`;
CREATE DATABASE `chambeaya-t`;
USE `chambeaya-t`;

-- Crear tablas desde cero

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE personas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    CONSTRAINT fk_persona_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_empresa_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    categoria_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_servicio_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_servicio_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE contratos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    prestador_id INT,
    servicio_id INT,
    estado ENUM('pendiente', 'en progreso', 'completado', 'cancelado') DEFAULT 'pendiente',
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_finalizacion TIMESTAMP NULL,
    CONSTRAINT fk_contrato_cliente FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    CONSTRAINT fk_contrato_prestador FOREIGN KEY (prestador_id) REFERENCES usuarios(id),
    CONSTRAINT fk_contrato_servicio FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);

CREATE TABLE metodo_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE comprobante_contrato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contrato_id INT,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago_id INT,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comprobante_contrato FOREIGN KEY (contrato_id) REFERENCES contratos(id),
    CONSTRAINT fk_comprobante_metodo FOREIGN KEY (metodo_pago_id) REFERENCES metodo_pago(id)
);

CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contrato_id INT,
    cliente_id INT,
    prestador_id INT,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comentario_contrato FOREIGN KEY (contrato_id) REFERENCES contratos(id),
    CONSTRAINT fk_comentario_cliente FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    CONSTRAINT fk_comentario_prestador FOREIGN KEY (prestador_id) REFERENCES usuarios(id)
);