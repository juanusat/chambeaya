-- Necesito 20 usuarios 
-- De esos 20 usuarios (5 empresas , 15 personas) 
-- Mujeres
CALL registrar_persona_usuario_cf('Valeria', 'Romero','968797956', '2001-04-12', 'valeria.romero@gmail.com', 'hash123','romerito12' ,'Mujer-1.jpg', 'Soy una persona comprometida con el aprendizaje constante y la mejora continua, con especial interés en el desarrollo profesional y humano.');
CALL registrar_persona_usuario_cf('Lucía', 'Fernández','935702359', '2000-11-08', 'lucia.fernandez@hotmail.com', 'hash456','lucifer000','Mujer-2.jpg', 'Cuento con una actitud proactiva y una sólida capacidad de análisis. Me adapto con facilidad a distintos entornos y disfruto trabajar en equipo.');
CALL registrar_persona_usuario_cf('Camila', 'Torres','942771215', '1999-02-25', 'camila.torres@yahoo.com', 'hash789','c.torres99','Mujer-3.jpg', 'Me considero una persona responsable, perseverante y con alto sentido ético. Valoro el trabajo bien hecho y el compromiso en cada tarea.');
CALL registrar_persona_usuario_cf('Diana', 'Rivas','917272400', '2002-06-19', 'diana.rivas@gmail.com', 'hash101','dianarvs02','Mujer-4.jpg', 'Con una fuerte vocación por el servicio y la educación, me esfuerzo en aportar con ideas que generen impacto positivo en las personas.');
CALL registrar_persona_usuario_cf('Andrea', 'Martínez','941581685', '2003-01-30', 'andrea.martinez@outlook.com', 'hash202','a.mart2003','Mujer-5.jpg', 'Soy una persona organizada, empática y con gran interés por la cultura y el desarrollo social.');
CALL registrar_persona_usuario_cf('Sofía', 'Guzmán','999060906', '2000-12-15', 'sofia.guzman@mail.com', 'hash303','sg.12','Mujer-6.jpg', 'Me caracterizo por ser entusiasta, colaborativa y con una mentalidad orientada al crecimiento profesional continuo.');
CALL registrar_persona_usuario_sf('Paula', 'Herrera','934028397', '2001-07-07', 'paula.herrera@gmail.com','hash404','herrera.p', 'Tengo un marcado interés en temas de salud mental y educación. Mi objetivo es contribuir con iniciativas que generen bienestar y equidad.');

-- Hombres
CALL registrar_persona_usuario_cf('Mateo', 'López','928613369', '1998-03-14', 'mateo.lopez@gmail.com', 'hash505','el.lopez98','Hombre-1.jpg', 'Soy un profesional orientado a resultados, con alto sentido de responsabilidad y enfoque en la mejora de procesos.');
CALL registrar_persona_usuario_cf('Sebastián', 'Castillo','947520982', '1999-09-01', 'sebastian.castillo@hotmail.com', 'hash606','s.castle01','Hombre-2.jpg', 'Cuento con una sólida ética de trabajo, gran disposición para el aprendizaje y capacidad de liderazgo en contextos colaborativos.');
CALL registrar_persona_usuario_cf('Diego', 'Ramírez','997572428', '2001-05-18', 'diego.ramirez@yahoo.com', 'hash707','dram.05','Hombre-3.jpg', 'Soy una persona analítica, organizada y con vocación por el desarrollo creativo y la innovación aplicada.');
CALL registrar_persona_usuario_cf('Lucas', 'Sánchez','954838183', '2000-10-23', 'lucas.sanchez@gmail.com', 'hash808','ellucas.02','Hombre-4.jpg', 'Me destaco por mi compromiso, pensamiento crítico y capacidad para afrontar nuevos desafíos con una visión estratégica.');
CALL registrar_persona_usuario_cf('Gabriel', 'Vargas','931858631', '2002-02-06', 'gabriel.vargas@outlook.com', 'hash909','loco.vargas06','Hombre-5.jpg', 'Tengo gran interés por la tecnología y la resolución de problemas. Soy constante, curioso y orientado a soluciones.');
CALL registrar_persona_usuario_cf('Tomás', 'Navarro','968625532', '2003-08-29', 'tomas.navarro@mail.com', 'hash000','tomas.navarro','Hombre-6.jpg', 'Me considero una persona positiva, comprometida y con disposición para contribuir al desarrollo de proyectos sostenibles.');
CALL registrar_persona_usuario_cf('Bruno', 'Flores','943937946', '1997-06-10', 'bruno.flores@gmail.com', 'hashabc','brunoxflowers','Hombre-7.jpg', 'Soy un profesional orientado a la excelencia, con experiencia en entornos creativos y habilidades para el trabajo colaborativo.');
CALL registrar_persona_usuario_sf('Álvaro', 'Rojas','920928263', '1998-01-05', 'alvaro.rojas@gmail.com', 'hashdef','a.red98', 'Tengo interés en el desarrollo integral y continuo, manteniendo siempre una actitud receptiva, respetuosa y comprometida.');

-- Empresas
CALL registrar_empresa_usuario_cf('TechNova', '20123456781', 'contacto@technova.com', 'hash001','nova_tech.pe','TechNova_.jpg','Empresa de tecnología e innovación');
CALL registrar_empresa_usuario_cf('AgroPerú', '10456789374', 'info@agroperu.pe', 'hash002','agroperu.pe','AgroPeru.jpg','Empresa dedicada a soluciones agrícolas');
CALL registrar_empresa_usuario_cf('Constructora Andina', '20567891236','const.andinap','admin@constructoraandina.com', 'hash003', 'ConstructoraAndina.png','Empresa constructora especializada en obras civiles');
CALL registrar_empresa_usuario_cf('BioVida', '10234567896', 'ventas@biovida.pe', 'hash004','biovid.peru','BioVida.jpeg','Empresa de productos naturales y ecológicos');
CALL registrar_empresa_usuario_sf('EduDigital', '20678912340', 'soporte@edudigital.com', 'hash005','e.digital','Plataforma de educación virtual e innovación educativa');

-- Categorías
INSERT INTO categoria (nombre) VALUES 
('Tecnología'), -- 1
('Salud'), -- 2
('Educación'), -- 3
('Ingeniería'),-- 4
('Administración'),-- 5
('Marketing'),-- 6
('Contabilidad'),-- 7
('Recursos Humanos'),-- 8
('Diseño Gráfico'),-- 9
('Logística'),-- 10
('Carpintería'),-- 11
('Albañilería'),-- 12
('Electricidad'),-- 13
('Fontanería'),-- 14
('Pintura'),-- 15
('Mecánica Automotriz'),-- 16
('Chef'),-- 17
('Mesero'),-- 18
('Seguridad'),-- 19
('Limpieza'),-- 20
('Niñera'),-- 21
('Jardinería'),-- 22
('Repartidor'),-- 23
('Panadería'),-- 24
('Barbería'),-- 25
('Peluquería'),-- 26
('Confección'),-- 27
('Soldadura'),-- 28
('Gasfitería'),-- 29
('Técnico en Computación');-- 30

-- Publicaciones
INSERT INTO publicacion (categoria_id, usuario_id, titulo, descripcion, precio, estado, fecha_creacion)
VALUES
(20, 2, 'Servicios de limpieza de casas', 'Limpieza profunda para viviendas, incluye limpieza de alfombras y ventanas.', 150.00, TRUE, '2025-01-12'),  
(2, 1, 'Consulta médica privada', 'Atención médica para consulta de salud general y bienestar.', 300.00, TRUE, '2025-03-25'),  
(16, 12, 'Reparación de motores de autos', 'Mantenimiento y reparación de motores automotrices para vehículos particulares.', 1200.00, TRUE, '2025-02-18'),  
(5, 10, 'Consultoría empresarial', 'Asesoramiento en la creación y expansión de empresas, con enfoque en crecimiento estratégico.', 850.00, TRUE, '2025-04-03'),  
(3, 7, 'Clases particulares de inglés', 'Cursos de inglés personalizados, desde nivel básico hasta avanzado.', 50.00, TRUE, '2025-01-30'),  
(12, 13, 'Reformas de albañilería', 'Servicio de albañilería para renovaciones de interiores y exteriores en casas y oficinas.', 1100.00, TRUE, '2025-02-07'),  
(4, 6, 'Proyectos de ingeniería civil', 'Diseño y ejecución de proyectos de construcción, incluyendo estructuras y cimentación.', 2000.00, TRUE, '2025-03-02'),  
(6, 9, 'Marketing digital para negocios', 'Creación y gestión de campañas publicitarias en redes sociales y Google Ads.', 500.00, TRUE, '2025-04-14'),  
(9, 11, 'Diseño de logotipos y branding', 'Creación de identidad visual para empresas, incluyendo logotipos y material gráfico.', 400.00, TRUE, '2025-01-19'),  
(14, 8, 'Instalación de fontanería en edificios', 'Instalación y mantenimiento de sistemas de fontanería en proyectos residenciales y comerciales.', 900.00, TRUE, '2025-03-10');

-- Publicación medio
INSERT INTO publicacion_medio (publicacion_id, tamanio, fecha_hora) VALUES
(1, 25288, '2025-01-24 08:40:12'),
(1, 1302011,'2025-01-25 12:41:50'),
(2, 7051, '2025-04-03 18:09:21'),
(3, 13317, '2025-03-24 07:50:08'),
(3, 11495, '2025-03-24 09:32:28'),
(3, 13493, '2025-03-25 11:22:47'),
(4, 50150, '2025-04-30 23:11:42'),
(5, 7496, '2025-03-01 12:36:55'),
(5, 7964, '2025-03-01 12:39:13'),
(6, 13579, '2025-03-19 15:27:13'),
(7, 12457, '2025-04-04 14:45:02'),
(7, 10923, '2025-04-04 14:54:29'),
(7, 11923, '2025-04-04 13:03:12'),
(8, 7618, '2025-05-16 19:33:40'),
(9, 99569, '2025-02-25 21:18:17'),
(10, 75920, '2025-03-01 14:18:30'),
(10, 86520, '2025-03-01 14:25:55');


INSERT INTO contrato (servicio_id, cliente_id, prestador_id, precio ,estado, fecha_inicio, fecha_finalizacion)
VALUES
	-- Publicación 1: prestador_id = 2
	(1, 5, 2, 150.00,'finalizado', '2025-01-14', '2025-01-20'),
	
	-- Publicación 2: prestador_id = 1
	(2, 3, 1, 300.00,'cancelado', '2025-03-28', '2025-04-10'),
	
	-- Publicación 3: prestador_id = 12
	(3, 4, 12, 1200.00,'finalizado', '2025-02-20', '2025-02-25'),
	
	-- Publicación 4: prestador_id = 10
	(4, 6, 10, 850.00,'en progreso', '2025-04-05', '2025-04-20'),
	
	-- Publicación 5: prestador_id = 7
	(5, 9, 7, 50.00,'finalizado', '2025-02-01', '2025-02-15'),
	
	-- Publicación 6: prestador_id = 13
	(6, 11, 13, 1100.00,'en progreso', '2025-02-09', '2025-02-16'),
	
	-- Publicación 7: prestador_id = 6
	(7, 2, 6, 2000.00,'finalizado', '2025-03-04', '2025-03-30');

-- Inserción de métodos de pago
INSERT INTO metodo_pago (nombre) VALUES
    ('crédito'),
    ('debito'),
    ('depósito'),
    ('paypal');

-- Inserción de comprobantes de pago
INSERT INTO comprobante_contrato(contrato_id, monto, metodo_pago_id, fecha_pago) 
VALUES
    (1, 150.00, 3, '2025-01-21'),
    (3, 1200.00, 1, '2025-02-28'),
    (5, 50.00, 2, '2025-02-16'),
    (7, 2000.00, 4, '2025-03-31');

-- Inserción de comentarios relacionados con los contratos
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