DROP PROCEDURE IF EXISTS registrar_persona_usuario_cf;
DELIMITER $$

CREATE PROCEDURE registrar_persona_usuario_cf(
    IN _nombre VARCHAR(255),
    IN _apellido VARCHAR(255),
    IN _fecha_nac DATE,
    IN _email VARCHAR(255),
    IN _password_hash VARCHAR(255),
    IN _url_picture VARCHAR(255)
)
BEGIN
    DECLARE nueva_persona_id INT;
    DECLARE nuevo_usuario_id INT;
    DECLARE username_generado VARCHAR(16);

    -- Si no se proporciona _url_picture, se establece como NULL
    IF _url_picture IS NULL THEN
        SET _url_picture = NULL;
    END IF;

    -- 1. Insertamos la persona sin usuario_id aún
    INSERT INTO persona (nombre, apellido, fecha_nacimiento)
    VALUES (_nombre, _apellido, _fecha_nac);
    
    -- Obtenemos el ID de la persona recién insertada
    SET nueva_persona_id = LAST_INSERT_ID();

    -- 2. Generamos un username (opcional, simple ejemplo)
    SET username_generado = LOWER(CONCAT(SUBSTRING(_nombre, 1, 3), SUBSTRING(_apellido, 1, 3)));

    -- 3. Insertamos el usuario
    INSERT INTO usuario (username, email, password_hash, fecha_creacion, url_picture)
    VALUES (username_generado, _email, _password_hash, CURDATE(), _url_picture);
    
    -- Obtenemos el ID del usuario recién insertado
    SET nuevo_usuario_id = LAST_INSERT_ID();

    -- 4. Actualizamos la persona con el usuario_id generado
    UPDATE persona
    SET usuario_id = nuevo_usuario_id
    WHERE persona_id = nueva_persona_id;
END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS registrar_persona_usuario_sf;
DELIMITER $$

CREATE PROCEDURE registrar_persona_usuario_sf(
    IN _nombre VARCHAR(255),
    IN _apellido VARCHAR(255),
    IN _fecha_nac DATE,
    IN _email VARCHAR(255),
    IN _password_hash VARCHAR(255)
)
BEGIN
    DECLARE nueva_persona_id INT;
    DECLARE nuevo_usuario_id INT;
    DECLARE username_generado VARCHAR(16);
    DECLARE url_picture VARCHAR(255);

    -- Establecer el valor predeterminado de la foto (1.jpg)
    SET url_picture = '1.jpg';

    -- 1. Insertamos la persona sin usuario_id aún
    INSERT INTO persona (nombre, apellido, fecha_nacimiento)
    VALUES (_nombre, _apellido, _fecha_nac);
    
    -- Obtenemos el ID de la persona recién insertada
    SET nueva_persona_id = LAST_INSERT_ID();

    -- 2. Generamos un username (opcional, simple ejemplo)
    SET username_generado = LOWER(CONCAT(SUBSTRING(_nombre, 1, 3), SUBSTRING(_apellido, 1, 3)));

    -- 3. Insertamos el usuario
    INSERT INTO usuario (username, email, password_hash, fecha_creacion, url_picture)
    VALUES (username_generado, _email, _password_hash, CURDATE(), url_picture);
    
    -- Obtenemos el ID del usuario recién insertado
    SET nuevo_usuario_id = LAST_INSERT_ID();

    -- 4. Actualizamos la persona con el usuario_id generado
    UPDATE persona
    SET usuario_id = nuevo_usuario_id
    WHERE persona_id = nueva_persona_id;
END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS registrar_empresa_usuario_cf;
DELIMITER $$

CREATE PROCEDURE registrar_empresa_usuario_cf(
    IN _nombre_empresa VARCHAR(255),
    IN _descripcion VARCHAR(255),
    IN _email VARCHAR(255),
    IN _password_hash VARCHAR(255),
    IN _url_picture VARCHAR(255)
)
BEGIN
    DECLARE nueva_empresa_id INT;
    DECLARE nuevo_usuario_id INT;
    DECLARE username_generado VARCHAR(16);

    -- Si no se proporciona _url_picture, se establece como NULL
    IF _url_picture IS NULL THEN
        SET _url_picture = NULL;
    END IF;

    -- 1. Insertamos la empresa sin usuario_id aún
    INSERT INTO empresa (nombre, descripcion, fecha_creacion)
    VALUES (_nombre_empresa, _descripcion, CURDATE());
    
    -- Obtenemos el ID de la empresa recién insertada
    SET nueva_empresa_id = LAST_INSERT_ID();

    -- 2. Generamos un username basado en la empresa (3 primeras letras)
    SET username_generado = LOWER(REPLACE(SUBSTRING(_nombre_empresa, 1, 6), ' ', ''));

    -- 3. Insertamos el usuario
    INSERT INTO usuario (username, email, password_hash, fecha_creacion, url_picture)
    VALUES (username_generado, _email, _password_hash, CURDATE(), _url_picture);
    
    -- Obtenemos el ID del usuario recién insertado
    SET nuevo_usuario_id = LAST_INSERT_ID();

    -- 4. Actualizamos la empresa con el usuario_id generado
    UPDATE empresa
    SET usuario_id = nuevo_usuario_id
    WHERE empresa_id = nueva_empresa_id;
END$$

DELIMITER ;

DROP PROCEDURE IF EXISTS registrar_empresa_usuario_sf;
DELIMITER $$
DELIMITER $$

CREATE PROCEDURE registrar_empresa_usuario_sf(
    IN _nombre_empresa VARCHAR(255),
    IN _descripcion VARCHAR(255),
    IN _email VARCHAR(255),
    IN _password_hash VARCHAR(255)
)
BEGIN
    DECLARE nueva_empresa_id INT;
    DECLARE nuevo_usuario_id INT;
    DECLARE username_generado VARCHAR(16);
    DECLARE url_picture VARCHAR(255);

    -- Establecer el valor predeterminado de la foto (2.jpg)
    SET url_picture = '2.jpg';

    -- 1. Insertamos la empresa sin usuario_id aún
    INSERT INTO empresa (nombre, descripcion, fecha_creacion)
    VALUES (_nombre_empresa, _descripcion, CURDATE());
    
    -- Obtenemos el ID de la empresa recién insertada
    SET nueva_empresa_id = LAST_INSERT_ID();

    -- 2. Generamos un username basado en la empresa (3 primeras letras)
    SET username_generado = LOWER(REPLACE(SUBSTRING(_nombre_empresa, 1, 6), ' ', ''));

    -- 3. Insertamos el usuario
    INSERT INTO usuario (username, email, password_hash, fecha_creacion, url_picture)
    VALUES (username_generado, _email, _password_hash, CURDATE(), url_picture);
    
    -- Obtenemos el ID del usuario recién insertado
    SET nuevo_usuario_id = LAST_INSERT_ID();

    -- 4. Actualizamos la empresa con el usuario_id generado
    UPDATE empresa
    SET usuario_id = nuevo_usuario_id
    WHERE empresa_id = nueva_empresa_id;
END$$

DELIMITER ;