CREATE TABLE usuario (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL UNIQUE,
    clave CHAR(64) NOT NULL -- SHA-256 produce hashes de 64 caracteres hexadecimales
);
