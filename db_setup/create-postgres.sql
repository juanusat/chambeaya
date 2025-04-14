create table contrato (
    id varchar,
    servicio_id int,
    cliente_id int,
    prestador_id int,
    estado varchar(20),
    fecha_inicio timestamp,
    fecha_finalizacion timestamp,
    primary key (id)
);

create table usuario (
    id varchar,
    email varchar(100) not null unique,
    password_hash text not null,
    fecha_creacion timestamp,
    admin boolean not null,
    url_picture varchar,
    primary key (id)
);

create table comprobante_contrato (
    id varchar,
    contrato_id int,
    monto decimal not null,
    metodo_pago_id int,
    fecha_pago timestamp,
    primary key (id)
);

create table comentario (
    id varchar,
    contrato_id int,
    calificacion int,
    comentario text,
    fecha_creacion timestamp,
    primary key (id)
);

create table persona (
    id varchar,
    usuario_id int unique,
    nombre varchar(100) not null,
    apellido varchar(100) not null,
    fecha_nacimiento date,
    primary key (id)
);



create table metodo_pago (
    id varchar,
    nombre varchar(50) not null unique,
    primary key (id)
);

create table publicacion_medio (
    id integer,
    pulicacion_id integer not null,
    tamanio integer,
    time timestamp with time zone,
    primary key (id)
);

create table empresa (
    id varchar,
    usuario_id int unique,
    nombre varchar(255) not null unique,
    descripcion text,
    fecha_creacion timestamp,
    primary key (id)
);

create table categoria (
    id varchar,
    nombre varchar(100) not null unique,
    primary key (id)
);

create table publicacion (
    id integer,
    categoria_id integer,
    usuario_id integer,
    titulo varchar(255) not null,
    descripcion text not null,
    precio decimal not null,
    fecha_creacion timestamp,
    primary key (id)
);

alter table comentario
add constraint fk_comentario_contrato_id_contrato_id foreign key(contrato_id) references contrato(id);

alter table comprobante_contrato
add constraint fk_comprobante_contrato_contrato_id_contrato_id foreign key(contrato_id) references contrato(id);

alter table comprobante_contrato
add constraint fk_comprobante_contrato_metodo_pago_id_metodo_pago_id foreign key(metodo_pago_id) references metodo_pago(id);

alter table contrato
add constraint fk_contrato_cliente_id_usuario_id foreign key(cliente_id) references usuario(id);

alter table contrato
add constraint fk_contrato_prestador_id_usuario_id foreign key(prestador_id) references usuario(id);

alter table contrato
add constraint fk_contrato_servicio_id_publicacion_id foreign key(servicio_id) references publicacion(id);

alter table empresa
add constraint fk_empresa_usuario_id_usuario_id foreign key(usuario_id) references usuario(id);

alter table persona
add constraint fk_persona_usuario_id_usuario_id foreign key(usuario_id) references usuario(id);

alter table publicacion
add constraint fk_publicacion_categoria_id_categoria_id foreign key(categoria_id) references categoria(id);

alter table publicacion
add constraint fk_publicacion_usuario_id_usuario_id foreign key(usuario_id) references usuario(id);

alter table publicacion_medio
add constraint fk_publicacion_medio_pulicacion_id_publicacion_id foreign key(pulicacion_id) references publicacion(id);
