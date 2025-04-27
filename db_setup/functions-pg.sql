-- Crear Persona_usuario con foto 
CREATE OR REPLACE FUNCTION registrar_persona_usuario_cf(
	_nombre varchar,
	_apellido varchar,
	_fecha_nac date,
	_email varchar,
	_password_hash varchar,
	_url_picture varchar DEFAULT NULL
) RETURNS void AS $$
DECLARE
	nueva_persona_id int;
	nuevo_usuario_id int;
	username_generado varchar(16);
BEGIN
	-- 1. Insertamos la persona sin usuario_id aún
	INSERT INTO persona (nombre, apellido, fecha_nacimiento)
	VALUES (_nombre, _apellido, _fecha_nac)
	RETURNING persona_id INTO nueva_persona_id;
	-- 2. Generamos un username (opcional, simple ejemplo)
	username_generado := lower(substring(_nombre from 1 for 3) || substring(_apellido from 1 for 3));
	-- 3. Insertamos el usuario
	INSERT INTO usuario (username, email, password_hash, fecha_creacion, url_picture)
	VALUES (username_generado, _email, _password_hash, CURRENT_DATE, _url_picture)
	RETURNING usuario_id INTO nuevo_usuario_id;
	-- 4. Actualizamos la persona con el usuario_id generado
	UPDATE persona SET usuario_id = nuevo_usuario_id
	WHERE persona_id = nueva_persona_id;
END;
$$ LANGUAGE plpgsql; 


-- Crear Persona_usuario sin foto(Defecto)
CREATE OR REPLACE FUNCTION registrar_persona_usuario_sf(
	_nombre varchar,
	_apellido varchar,
	_fecha_nac date,
	_email varchar,
	_password_hash varchar
) RETURNS void AS $$
DECLARE
	nueva_persona_id int;
	nuevo_usuario_id int;
	username_generado varchar(16);
BEGIN
	-- 1. Insertamos la persona sin usuario_id aún
	INSERT INTO persona (nombre, apellido, fecha_nacimiento)
	VALUES (_nombre, _apellido, _fecha_nac)
	RETURNING persona_id INTO nueva_persona_id;
	-- 2. Generamos un username (opcional, simple ejemplo)
	username_generado := lower(substring(_nombre from 1 for 3) || substring(_apellido from 1 for 3));
	-- 3. Insertamos el usuario
	INSERT INTO usuario (username, email, password_hash, fecha_creacion, url_picture)
	VALUES (username_generado, _email, _password_hash, CURRENT_DATE, '1.jpg')
	RETURNING usuario_id INTO nuevo_usuario_id;
	-- 4. Actualizamos la persona con el usuario_id generado
	UPDATE persona SET usuario_id = nuevo_usuario_id
	WHERE persona_id = nueva_persona_id;
END;
$$ LANGUAGE plpgsql; 


-- Crear Empresa_usuario con foto
CREATE OR REPLACE FUNCTION registrar_empresa_usuario_cf(
	_nombre_empresa varchar,
	_descripcion varchar,
	_email varchar,
	_password_hash varchar,
	_url_picture varchar DEFAULT NULL
) RETURNS void AS $$
DECLARE
	nueva_empresa_id int;
	nuevo_usuario_id int;
	username_generado varchar(16);
BEGIN
	-- 1. Insertamos la empresa sin usuario_id aún
	INSERT INTO empresa (nombre, descripcion, fecha_creacion)
	VALUES (_nombre_empresa, _descripcion, CURRENT_DATE)
	RETURNING empresa_id INTO nueva_empresa_id;

	-- 2. Generamos un username basado en la empresa (3 primeras letras)
	username_generado := lower(replace(substring(_nombre_empresa from 1 for 6), ' ', ''));

	-- 3. Insertamos el usuario
	INSERT INTO usuario (username, email, password_hash, fecha_creacion, url_picture)
	VALUES (username_generado, _email, _password_hash, CURRENT_DATE, _url_picture)
	RETURNING usuario_id INTO nuevo_usuario_id;

	-- 4. Actualizamos la empresa con el usuario_id generado
	UPDATE empresa SET usuario_id = nuevo_usuario_id
	WHERE empresa_id = nueva_empresa_id;
END;
$$ LANGUAGE plpgsql;


-- Crear Empresa_usuario sin foto(Defecto)
CREATE OR REPLACE FUNCTION registrar_empresa_usuario_sf(
	_nombre_empresa varchar,
	_descripcion varchar,
	_email varchar,
	_password_hash varchar
) RETURNS void AS $$
DECLARE
	nueva_empresa_id int;
	nuevo_usuario_id int;
	username_generado varchar(16);
BEGIN
	-- 1. Insertamos la empresa sin usuario_id aún
	INSERT INTO empresa (nombre, descripcion, fecha_creacion)
	VALUES (_nombre_empresa, _descripcion, CURRENT_DATE)
	RETURNING empresa_id INTO nueva_empresa_id;

	-- 2. Generamos un username basado en la empresa (3 primeras letras)
	username_generado := lower(replace(substring(_nombre_empresa from 1 for 6), ' ', ''));

	-- 3. Insertamos el usuario
	INSERT INTO usuario (username, email, password_hash, fecha_creacion, url_picture)
	VALUES (username_generado, _email, _password_hash, CURRENT_DATE, '2.jpg')
	RETURNING usuario_id INTO nuevo_usuario_id;

	-- 4. Actualizamos la empresa con el usuario_id generado
	UPDATE empresa SET usuario_id = nuevo_usuario_id
	WHERE empresa_id = nueva_empresa_id;
END;
$$ LANGUAGE plpgsql; 