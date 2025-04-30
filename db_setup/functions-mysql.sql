DROP PROCEDURE IF EXISTS registrar_persona_usuario_cf;
DELIMITER $$

CREATE PROCEDURE registrar_persona_usuario_cf(
    IN _nombre VARCHAR(100),
    IN _apellido VARCHAR(100),
    IN _telefono VARCHAR(20),
    IN _fecha_nac DATE,
    IN _email VARCHAR(100),
    IN _password_hash VARCHAR(255),
    IN _username VARCHAR(50),
    IN _url_picture VARCHAR(255),
    IN _descripcion VARCHAR(255)
)
BEGIN
    DECLARE nueva_persona_id INT;
    DECLARE nuevo_usuario_id INT;

    INSERT INTO persona (nombre, apellido, telefono, fecha_nacimiento)
    VALUES (_nombre, _apellido, _telefono, _fecha_nac);
    
    SET nueva_persona_id = LAST_INSERT_ID();

    INSERT INTO usuario (username, email, password_hash, fecha_creacion, url_picture, descripcion)
    VALUES (_username, _email, _password_hash, CURDATE(), _url_picture, _descripcion);

    SET nuevo_usuario_id = LAST_INSERT_ID();

    UPDATE persona 
    SET usuario_id = nuevo_usuario_id
    WHERE persona_id = nueva_persona_id;
END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS registrar_persona_usuario_sf;
DELIMITER $$

CREATE PROCEDURE registrar_persona_usuario_sf(
    IN _nombre VARCHAR(255),
    IN _apellido VARCHAR(255),
    IN _telefono VARCHAR(20),
    IN _fecha_nac DATE,
    IN _email VARCHAR(255),
    IN _password_hash VARCHAR(255),
    IN _username VARCHAR(255),
    IN _descripcion VARCHAR(255)
)
BEGIN
    DECLARE nueva_persona_id INT;
    DECLARE nuevo_usuario_id INT;

    INSERT INTO persona (nombre, apellido, telefono, fecha_nacimiento)
    VALUES (_nombre, _apellido, _telefono, _fecha_nac);
    
    SET nueva_persona_id = LAST_INSERT_ID();

    INSERT INTO usuario (username, email, password_hash, fecha_creacion, url_picture, descripcion)
    VALUES (_username, _email, _password_hash, CURDATE(), '1.jpg', _descripcion);
    
    SET nuevo_usuario_id = LAST_INSERT_ID();

    UPDATE persona
    SET usuario_id = nuevo_usuario_id
    WHERE persona_id = nueva_persona_id;
END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS registrar_empresa_usuario_cf;
DELIMITER $$

CREATE PROCEDURE registrar_empresa_usuario_cf(
    IN _nombre_empresa VARCHAR(255),
    IN _descripcion_empresa VARCHAR(255),
    IN _email VARCHAR(255),
    IN _password_hash VARCHAR(255),
    IN _username VARCHAR(255),
    IN _url_picture VARCHAR(255),
    IN _descripcion VARCHAR(255)
)
BEGIN
    DECLARE nueva_empresa_id INT;
    DECLARE nuevo_usuario_id INT;

    INSERT INTO empresa (nombre, descripcion, fecha_creacion)
    VALUES (_nombre_empresa, _descripcion_empresa, CURDATE());
    
    SET nueva_empresa_id = LAST_INSERT_ID();

    INSERT INTO usuario (username, email, password_hash, fecha_creacion, url_picture, descripcion)
    VALUES (_username, _email, _password_hash, CURDATE(), _url_picture, _descripcion);
    
    SET nuevo_usuario_id = LAST_INSERT_ID();

    UPDATE empresa
    SET usuario_id = nuevo_usuario_id
    WHERE empresa_id = nueva_empresa_id;
END $$

DELIMITER ;

DROP PROCEDURE IF EXISTS registrar_empresa_usuario_sf;
DELIMITER $$

CREATE PROCEDURE registrar_empresa_usuario_sf(
    IN _nombre_empresa VARCHAR(255),
    IN _descripcion_empresa VARCHAR(255),
    IN _email VARCHAR(255),
    IN _password_hash VARCHAR(255),
    IN _username VARCHAR(255),
    IN _descripcion VARCHAR(255)
)
BEGIN
    DECLARE nueva_empresa_id INT;
    DECLARE nuevo_usuario_id INT;

    INSERT INTO empresa (nombre, descripcion, fecha_creacion)
    VALUES (_nombre_empresa, _descripcion_empresa, CURDATE());
    
    SET nueva_empresa_id = LAST_INSERT_ID();

    INSERT INTO usuario (username, email, password_hash, fecha_creacion, url_picture, descripcion)
    VALUES (_username, _email, _password_hash, CURDATE(), '2.jpg', _descripcion);
    
    SET nuevo_usuario_id = LAST_INSERT_ID();

    UPDATE empresa
    SET usuario_id = nuevo_usuario_id
    WHERE empresa_id = nueva_empresa_id;
END $$

DELIMITER ;

