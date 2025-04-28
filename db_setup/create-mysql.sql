create table contrato (
    contrato_id int auto_increment,
    servicio_id int,
    cliente_id int,
    prestador_id int,
    estado varchar(20) not null default 'pendiente',
    fecha_inicio date not null,
    fecha_finalizacion date not null,
    primary key (contrato_id),
    check (estado in ('pendiente', 'rechazado' ,'en espera', 'en progreso', 'completado', 'finalizado' , 'cancelado'))
);

create table usuario (
    usuario_id int auto_increment,
    username varchar(16) not null unique,
    email varchar(100) not null unique,
    password_hash varchar(64) not null,
    fecha_creacion date not null,
    admin boolean not null default false,
    url_picture varchar(40),
    primary key (usuario_id)
);

create table comprobante_contrato (
    comprobante_contrato_id int auto_increment,
    contrato_id int,
    monto decimal(7,2) not null,
    metodo_pago_id int not null,
    fecha_pago date not null,
    primary key (comprobante_contrato_id)
);

create table comentario (
    comentario_id int auto_increment,
    contrato_id int,
    calificacion int,
    comentario varchar(255) not null,
    fecha_creacion date not null,
    primary key (comentario_id)
);

create table persona (
    persona_id int auto_increment,
    usuario_id int unique,
    nombre varchar(100) not null,
    apellido varchar(100) not null,
    fecha_nacimiento date not null,
    primary key (persona_id)
);

create table metodo_pago (
    metodo_pago_id int auto_increment,
    nombre varchar(50) not null unique,
    primary key (metodo_pago_id)
);

create table publicacion_medio (
    publicacion_medio_id int auto_increment,
    publicacion_id int not null,
    tamanio int not null,
    fecha_hora datetime not null,
    primary key (publicacion_medio_id)
);

create table empresa (
    empresa_id int auto_increment,
    usuario_id int unique,
    nombre varchar(255) not null unique,
    descripcion varchar(255) not null,
    fecha_creacion date not null,
    primary key (empresa_id)
);

create table categoria (
    categoria_id int auto_increment,
    nombre varchar(100) not null unique,
    primary key (categoria_id)
);

create table publicacion (
    publicacion_id int auto_increment,
    categoria_id int,
    usuario_id int,
    titulo varchar(80) not null,
    descripcion varchar(255) not null,
    precio decimal not null,
    fecha_creacion date not null,
    primary key (publicacion_id)
);

alter table comentario
add constraint fk_comentario_contrato_id_contrato_id foreign key (contrato_id) references contrato(contrato_id);

alter table comprobante_contrato
add constraint fk_comprobante_contrato_contrato_id_contrato_id foreign key (contrato_id) references contrato(contrato_id);

alter table comprobante_contrato
add constraint fk_comprobante_contrato_metodo_pago_id_metodo_pago_id foreign key (metodo_pago_id) references metodo_pago(metodo_pago_id);

alter table contrato
add constraint fk_contrato_cliente_id_usuario_id foreign key (cliente_id) references usuario(usuario_id);

alter table contrato
add constraint fk_contrato_prestador_id_usuario_id foreign key (prestador_id) references usuario(usuario_id);

alter table contrato
add constraint fk_contrato_servicio_id_publicacion_id foreign key (servicio_id) references publicacion(publicacion_id);

alter table empresa
add constraint fk_empresa_usuario_id_usuario_id foreign key (usuario_id) references usuario(usuario_id);

alter table persona
add constraint fk_persona_usuario_id_usuario_id foreign key (usuario_id) references usuario(usuario_id);

alter table publicacion
add constraint fk_publicacion_categoria_id_categoria_id foreign key (categoria_id) references categoria(categoria_id);

alter table publicacion
add constraint fk_publicacion_usuario_id_usuario_id foreign key (usuario_id) references usuario(usuario_id);

alter table publicacion_medio
add constraint fk_publicacion_medio_pulicacion_id_publicacion_id foreign key (publicacion_id) references publicacion(publicacion_id);