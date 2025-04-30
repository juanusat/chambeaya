-- Necesito 20 usuarios 
-- De esos 20 usuarios (5 empresas , 15 personas) 
-- Mujeres
SELECT registrar_persona_usuario_cf('Valeria', 'Romero', '2001-04-12', 'valeria.romero@gmail.com', 'hash123','romerito12' ,'Mujer-1.jpg');
SELECT registrar_persona_usuario_cf('Lucía', 'Fernández', '2000-11-08', 'lucia.fernandez@hotmail.com', 'hash456','lucifer000','Mujer-2.jpg');
SELECT registrar_persona_usuario_cf('Camila', 'Torres', '1999-02-25', 'camila.torres@yahoo.com', 'hash789','c.torres99','Mujer-3.jpg');
SELECT registrar_persona_usuario_cf('Diana', 'Rivas', '2002-06-19', 'diana.rivas@gmail.com', 'hash101','dianarvs02','Mujer-4.jpg');
SELECT registrar_persona_usuario_cf('Andrea', 'Martínez', '2003-01-30', 'andrea.martinez@outlook.com', 'hash202','a.mart2003','Mujer-5.jpg');
SELECT registrar_persona_usuario_cf('Sofía', 'Guzmán', '2000-12-15', 'sofia.guzman@mail.com', 'hash303','sg.12','Mujer-6.jpg');
SELECT registrar_persona_usuario_sf('Paula', 'Herrera', '2001-07-07', 'paula.herrera@gmail.com','hash404','herrera.p');

-- Hombres
SELECT registrar_persona_usuario_cf('Mateo', 'López', '1998-03-14', 'mateo.lopez@gmail.com', 'hash505','el.lopez98','Hombre-1.jpg');
SELECT registrar_persona_usuario_cf('Sebastián', 'Castillo', '1999-09-01', 'sebastian.castillo@hotmail.com', 'hash606','s.castle01','Hombre-2.jpg');
SELECT registrar_persona_usuario_cf('Diego', 'Ramírez', '2001-05-18', 'diego.ramirez@yahoo.com', 'hash707','dram.05','Hombre-3.jpg');
SELECT registrar_persona_usuario_cf('Lucas', 'Sánchez', '2000-10-23', 'lucas.sanchez@gmail.com', 'hash808','ellucas.02','Hombre-4.jpg');
SELECT registrar_persona_usuario_cf('Gabriel', 'Vargas', '2002-02-06', 'gabriel.vargas@outlook.com', 'hash909','loco.vargas06','Hombre-5.jpg');
SELECT registrar_persona_usuario_cf('Tomás', 'Navarro', '2003-08-29', 'tomas.navarro@mail.com', 'hash000','tomas.navarro','Hombre-6.jpg');
SELECT registrar_persona_usuario_cf('Bruno', 'Flores', '1997-06-10', 'bruno.flores@gmail.com', 'hashabc','brunoxflowers','Hombre-7.jpg');
SELECT registrar_persona_usuario_sf('Álvaro', 'Rojas', '1998-01-05', 'alvaro.rojas@gmail.com', 'hashdef','a.red98');

--Empresas
SELECT registrar_empresa_usuario_cf('TechNova', 'Empresa de tecnología e innovación', 'contacto@technova.com', 'hash001','nova_tech.pe','TechNova_.jpg');
SELECT registrar_empresa_usuario_cf('AgroPerú', 'Empresa dedicada a soluciones agrícolas', 'info@agroperu.pe', 'hash002','agroperu.pe','AgroPeru.jpg');
SELECT registrar_empresa_usuario_cf('Constructora Andina', 'Empresa constructora especializada en obras civiles','const.andinap','admin@constructoraandina.com', 'hash003', 'ConstructoraAndina.png');
SELECT registrar_empresa_usuario_cf('BioVida', 'Empresa de productos naturales y ecológicos', 'ventas@biovida.pe', 'hash004','biovid.peru','BioVida.jpeg');
SELECT registrar_empresa_usuario_sf('EduDigital', 'Plataforma de educación virtual e innovación educativa', 'soporte@edudigital.com', 'hash005','e.digital');


-- De esas 15 personas (10 con servicios, 5 sin servicios); 
	-- Primero las categorias 
	INSERT INTO categoria (nombre) VALUES ('Tecnología'); --1
	INSERT INTO categoria (nombre) VALUES ('Salud'); --2
	INSERT INTO categoria (nombre) VALUES ('Educación'); --3
	INSERT INTO categoria (nombre) VALUES ('Ingeniería');--4
	INSERT INTO categoria (nombre) VALUES ('Administración');--5
	INSERT INTO categoria (nombre) VALUES ('Marketing');--6
	INSERT INTO categoria (nombre) VALUES ('Contabilidad');--7
	INSERT INTO categoria (nombre) VALUES ('Recursos Humanos');--8
	INSERT INTO categoria (nombre) VALUES ('Diseño Gráfico');--9
	INSERT INTO categoria (nombre) VALUES ('Logística');--10
	INSERT INTO categoria (nombre) VALUES ('Carpintería');--11
	INSERT INTO categoria (nombre) VALUES ('Albañilería');--12
	INSERT INTO categoria (nombre) VALUES ('Electricidad');--13
	INSERT INTO categoria (nombre) VALUES ('Fontanería');--14
	INSERT INTO categoria (nombre) VALUES ('Pintura');--15
	INSERT INTO categoria (nombre) VALUES ('Mecánica Automotriz');--16
	INSERT INTO categoria (nombre) VALUES ('Chef');--17
	INSERT INTO categoria (nombre) VALUES ('Mesero');--18
	INSERT INTO categoria (nombre) VALUES ('Seguridad');--19
	INSERT INTO categoria (nombre) VALUES ('Limpieza');--20
	INSERT INTO categoria (nombre) VALUES ('Niñera');--21
	INSERT INTO categoria (nombre) VALUES ('Jardinería');--22
	INSERT INTO categoria (nombre) VALUES ('Repartidor');--23
	INSERT INTO categoria (nombre) VALUES ('Panadería');--24
	INSERT INTO categoria (nombre) VALUES ('Barbería');--25
	INSERT INTO categoria (nombre) VALUES ('Peluquería');--26
	INSERT INTO categoria (nombre) VALUES ('Confección');--27
	INSERT INTO categoria (nombre) VALUES ('Soldadura');--28
	INSERT INTO categoria (nombre) VALUES ('Gasfitería');--29
	INSERT INTO categoria (nombre) VALUES ('Técnico en Computación');--30

	--Ahora las 10 publicaciones
	INSERT INTO publicacion (categoria_id, usuario_id, titulo, descripcion, precio, fecha_creacion)
	VALUES
	(20, 2, 'Servicios de limpieza de casas', 'Limpieza profunda para viviendas, incluye limpieza de alfombras y ventanas.', 150.00, '2025-01-12'),  -- Limpieza
	(2, 1, 'Consulta médica privada', 'Atención médica para consulta de salud general y bienestar.', 300.00, '2025-03-25'),  -- Salud
	(16, 12, 'Reparación de motores de autos', 'Mantenimiento y reparación de motores automotrices para vehículos particulares.', 1200.00, '2025-02-18'),  -- Mecánica Automotriz
	(5, 10, 'Consultoría empresarial', 'Asesoramiento en la creación y expansión de empresas, con enfoque en crecimiento estratégico.', 850.00, '2025-04-03'),  -- Administración
	(3, 7, 'Clases particulares de inglés', 'Cursos de inglés personalizados, desde nivel básico hasta avanzado.', 50.00, '2025-01-30'),  -- Educación
	(12, 13, 'Reformas de albañilería', 'Servicio de albañilería para renovaciones de interiores y exteriores en casas y oficinas.', 1100.00, '2025-02-07'),  -- Albañilería
	(4, 6, 'Proyectos de ingeniería civil', 'Diseño y ejecución de proyectos de construcción, incluyendo estructuras y cimentación.', 2000.00, '2025-03-02'),  -- Ingeniería
	(6, 9, 'Marketing digital para negocios', 'Creación y gestión de campañas publicitarias en redes sociales y Google Ads.', 500.00, '2025-04-14'),  -- Marketing
	(9, 11, 'Diseño de logotipos y branding', 'Creación de identidad visual para empresas, incluyendo logotipos y material gráfico.', 400.00, '2025-01-19'),  -- Diseño Gráfico
	(14, 8, 'Instalación de fontanería en edificios', 'Instalación y mantenimiento de sistemas de fontanería en proyectos residenciales y comerciales.', 900.00, '2025-03-10');  -- Fontanería

	-- Para los 10 sus respectivas publicacion_medio 
		-- Medios para publicación 1
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (1, 25288, '2025-01-24 08:40:12');
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (1, 1302011,'2025-01-25 12:41:50 ');
		
		-- Medios para publicación 2
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (2, 7051, '2025-04-03 18:09:21');
		
		-- Medios para publicación 3
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (3, 13317, '2025-03-24 07:50:08');
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (3, 11495, '2025-03-24 09:32:28');
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (3, 13493, '2025-03-25 11:22:47');
		
		-- Medios para publicación 4
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (4, 50150, '2025-04-30 23:11:42');
		
		-- Medios para publicación 5
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (5, 7496, '2025-03-01 12:36:55');
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (5, 7964, '2025-03-01 12:39:13');
		
		-- Medios para publicación 6
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (6, 13579, '2025-03-19 15:27:13');
		
		-- Medios para publicación 7
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (7, 12457, '2025-04-04 14:45:02');
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (7, 10923, '2025-04-04 14:54:29');
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (7, 11923, '2025-04-04 13:03:12');
		
		-- Medios para publicación 8
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (8, 7618, '2025-05-16 19:33:40');
		
		-- Medios para publicación 9
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (9, 99569, '2025-02-25 21:18:29');
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (9, 6410, '2025-02-25 21:19:08');
		
		-- Medios para publicación 10
		INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES (10, 71070, '2025-04-10 09:02:14');


-- De esas 10 publicaciones (7 han sido contratadas , 3 aun no contratadas); 	
-- De esos 7 (4 ya finalizados con paga (comentarios), 1 cancelado, 2 pendientes de pago); 

	INSERT INTO contrato (servicio_id, cliente_id, prestador_id, estado, fecha_inicio, fecha_finalizacion)
VALUES
	-- Publicación 1: prestador_id = 2
	(1, 5, 2, 'finalizado', '2025-01-14', '2025-01-20'),
	
	-- Publicación 2: prestador_id = 1
	(2, 3, 1, 'cancelado', '2025-03-28', '2025-04-10'),
	
	-- Publicación 3: prestador_id = 12
	(3, 4, 12, 'finalizado', '2025-02-20', '2025-02-25'),
	
	-- Publicación 4: prestador_id = 10
	(4, 6, 10, 'en progreso', '2025-04-05', '2025-04-20'),
	
	-- Publicación 5: prestador_id = 7
	(5, 9, 7, 'finalizado', '2025-02-01', '2025-02-15'),
	
	-- Publicación 6: prestador_id = 13
	(6, 11, 13, 'en progreso', '2025-02-09', '2025-02-16'),
	
	-- Publicación 7: prestador_id = 6
	(7, 2, 6, 'finalizado', '2025-03-04', '2025-03-30');

--4 ya finalizados con paga (comentarios) 
	-- primero los metodo de pago 
		INSERT INTO metodo_pago (nombre) VALUES
		('crédito'),
		('debito'),
		('depósito'),
		('paypal'); 
	-- Ahora los comprobantes 
		INSERT INTO comprobante_contrato(contrato_id,monto,metodo_pago_id,fecha_pago)VALUES
		(1,150.00,3,'2025-01-21'),
		(3,1200.00,1,'2025-02-28'),
		(5,50.00,2,'2025-02-16'),
		(7,2000.00,4,'2025-03-31'); 
	-- Ahora los comentarios 
		-- Contrato 1 (publicacion_id = 1, cliente_id = 5, prestador_id = 2)
		INSERT INTO comentario (contrato_id, calificacion, comentario, fecha_creacion)
		VALUES 
		(1, 5, 'Excelente servicio de limpieza, dejaron mi casa impecable. Muy recomendados.', '2025-01-21');
		
		-- Contrato 2 (publicacion_id = 3, cliente_id = 4, prestador_id = 12)
		INSERT INTO comentario (contrato_id, calificacion, comentario, fecha_creacion)
		VALUES 
		(2, 4, 'El mecánico hizo un buen trabajo. Solo tardó un poco más de lo esperado.', '2025-02-27');
		
		-- Contrato 3 (publicacion_id = 5, cliente_id = 9, prestador_id = 7)
		INSERT INTO comentario (contrato_id, calificacion, comentario, fecha_creacion)
		VALUES 
		(3, 3, 'Las clases de inglés estuvieron bien, aunque me hubiera gustado más práctica oral.', '2025-02-17');
		
		-- Contrato 4 (publicacion_id = 7, cliente_id = 2, prestador_id = 6)
		INSERT INTO comentario (contrato_id, calificacion, comentario, fecha_creacion)
		VALUES 
		(4, 5, 'El ingeniero entregó los planos a tiempo y con mucha precisión. Muy profesional.', '2025-04-01');