

--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.1

-- Started on 2026-04-20 21:41:05

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Configuracion de TABLES
--

CREATE TABLE public."Cliente" (
    ID_Cliente INTEGER NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Tipo_Persona VARCHAR(20) NOT NULL,
    RFC VARCHAR(13) NOT NULL,
    Domicilio VARCHAR(150) NOT NULL,
    Correo VARCHAR(100) NOT NULL,
    Telefono VARCHAR(20) NOT NULL,
    Estatus VARCHAR(20) NOT NULL
);

CREATE TABLE public."Usuario" (
    ID_Usuario INTEGER NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Rol VARCHAR(30) NOT NULL,
    Correo VARCHAR(100) NOT NULL
);

CREATE TABLE public."Producto" (
    ID_Producto INTEGER NOT NULL,
    Nombre VARCHAR(50) NOT NULL,
    Tipo VARCHAR(30) NOT NULL
);

CREATE TABLE public."Contrato" (
    ID_Contrato INTEGER NOT NULL,
    ID_Cliente INTEGER NOT NULL,
    Fecha_Inicio TIMESTAMP NOT NULL,
    Fecha_Fin TIMESTAMP,
    Estatus VARCHAR(20) NOT NULL,
    Saldo NUMERIC(12,2) NOT NULL
);

CREATE TABLE public."Operacion" (
    ID_Operacion INTEGER NOT NULL,
    ID_Cliente INTEGER NOT NULL,
    ID_Producto INTEGER NOT NULL,
    Fecha TIMESTAMP NOT NULL,
    Monto NUMERIC(12,2) NOT NULL,
    Tipo_Operacion VARCHAR(30) NOT NULL,
    Estado VARCHAR(20) NOT NULL
);

CREATE TABLE public."Reporte" (
    ID_Reporte INTEGER NOT NULL,
    Tipo VARCHAR(20) NOT NULL,
    Fecha_Generacion TIMESTAMP NOT NULL,
    Estatus_Envio VARCHAR(20) NOT NULL
);

CREATE TABLE public."Reporte_Operacion" (
    ID_Reporte INTEGER NOT NULL,
    ID_Operacion INTEGER NOT NULL
);

CREATE TABLE public."Alerta" (
    ID_Alerta INTEGER NOT NULL,
    Tipo_Alerta VARCHAR(20) NOT NULL,
    Fecha_Generacion TIMESTAMP NOT NULL,
    Motivo VARCHAR(200) NOT NULL,
    Estatus VARCHAR(20) NOT NULL
);

CREATE TABLE public."Alerta_Buzon" (
    ID_Alerta INTEGER NOT NULL,
    Descripcion_Reporte VARCHAR(300) NOT NULL,
    Evidencia BYTEA,
    Token_Seguimiento VARCHAR(100) NOT NULL
);

CREATE TABLE public."Alerta_Automatica" (
    ID_Alerta INTEGER NOT NULL,
    ID_Operacion INTEGER NOT NULL
);

CREATE TABLE public."Caso" (
    ID_Caso INTEGER NOT NULL,
    ID_Alerta INTEGER NOT NULL,
    Descripcion VARCHAR(300) NOT NULL,
    Estatus VARCHAR(20) NOT NULL,
    Fecha_Apertura TIMESTAMP NOT NULL,
    Fecha_Cierre TIMESTAMP
);

CREATE TABLE public."Usuario_Caso" (
    ID_Usuario INTEGER NOT NULL,
    ID_Caso INTEGER NOT NULL,
    Fecha_Asignacion TIMESTAMP NOT NULL,
    Estatus_Atencion VARCHAR(20),
    Comentario VARCHAR(300)
);

CREATE TABLE public."Documento" (
    ID_Documento INTEGER NOT NULL,
    ID_Cliente INTEGER NOT NULL,
    Tipo_Documento VARCHAR(50) NOT NULL,
    Estatus_Validacion VARCHAR(20) NOT NULL,
    Fecha_Creacion TIMESTAMP NOT NULL
);

CREATE TABLE public."Validacion_Documento" (
    ID_Usuario INTEGER NOT NULL,
    ID_Documento INTEGER NOT NULL,
    Metodo_Validacion VARCHAR(50),
    Evidencia BYTEA
);

CREATE TABLE public."Lista_Riesgo" (
    ID_Lista INTEGER NOT NULL,
    Tipo_Lista VARCHAR(30) NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Fuente VARCHAR(100) NOT NULL
);

CREATE TABLE public."Validacion_Lista" (
    ID_Cliente INTEGER NOT NULL,
    ID_Lista INTEGER NOT NULL,
    Fecha_Validacion TIMESTAMP NOT NULL,
    Resultado VARCHAR(20),
    Coincidencia VARCHAR(20),
    ID_Usuario INTEGER
);

CREATE TABLE public."Configuracion_Lista" (
    ID_Usuario INTEGER NOT NULL,
    ID_Lista INTEGER NOT NULL,
    Fecha_Configuracion TIMESTAMP NOT NULL,
    Tipo_Accion VARCHAR(30),
    Descripcion_Cambio VARCHAR(200)
);




--
-- CONSTRAINTS 
--
-- PRIMARY KEYS
--

ALTER TABLE public."Cliente"
ADD CONSTRAINT pk_cliente PRIMARY KEY (ID_Cliente);

ALTER TABLE public."Usuario"
ADD CONSTRAINT pk_usuario PRIMARY KEY (ID_Usuario);

ALTER TABLE public."Producto"
ADD CONSTRAINT pk_producto PRIMARY KEY (ID_Producto);

ALTER TABLE public."Contrato"
ADD CONSTRAINT pk_contrato PRIMARY KEY (ID_Contrato);

ALTER TABLE public."Operacion"
ADD CONSTRAINT pk_operacion PRIMARY KEY (ID_Operacion);

ALTER TABLE public."Reporte"
ADD CONSTRAINT pk_reporte PRIMARY KEY (ID_Reporte);

ALTER TABLE public."Reporte_Operacion"
ADD CONSTRAINT pk_reporte_operacion PRIMARY KEY (ID_Reporte, ID_Operacion);

ALTER TABLE public."Alerta"
ADD CONSTRAINT pk_alerta PRIMARY KEY (ID_Alerta);

ALTER TABLE public."Alerta_Buzon"
ADD CONSTRAINT pk_alerta_buzon PRIMARY KEY (ID_Alerta);

ALTER TABLE public."Alerta_Automatica"
ADD CONSTRAINT pk_alerta_auto PRIMARY KEY (ID_Alerta);

ALTER TABLE public."Caso"
ADD CONSTRAINT pk_caso PRIMARY KEY (ID_Caso);

ALTER TABLE public."Usuario_Caso"
ADD CONSTRAINT pk_usuario_caso PRIMARY KEY (ID_Usuario, ID_Caso);

ALTER TABLE public."Documento"
ADD CONSTRAINT pk_documento PRIMARY KEY (ID_Documento);

ALTER TABLE public."Validacion_Documento"
ADD CONSTRAINT pk_validacion_doc PRIMARY KEY (ID_Usuario, ID_Documento);

ALTER TABLE public."Lista_Riesgo"
ADD CONSTRAINT pk_lista PRIMARY KEY (ID_Lista);

ALTER TABLE public."Validacion_Lista"
ADD CONSTRAINT pk_validacion_lista PRIMARY KEY (ID_Cliente, ID_Lista, Fecha_Validacion);

ALTER TABLE public."Configuracion_Lista"
ADD CONSTRAINT pk_config_lista PRIMARY KEY (ID_Usuario, ID_Lista, Fecha_Configuracion);


--
-- CONSTRAINTS 
--
-- FOREIGN KEYS
--

ALTER TABLE public."Contrato"
ADD CONSTRAINT fk_contrato_cliente
FOREIGN KEY (ID_Cliente) REFERENCES public."Cliente"(ID_Cliente);

ALTER TABLE public."Operacion"
ADD CONSTRAINT fk_operacion_cliente
FOREIGN KEY (ID_Cliente) REFERENCES public."Cliente"(ID_Cliente);

ALTER TABLE public."Operacion"
ADD CONSTRAINT fk_operacion_producto
FOREIGN KEY (ID_Producto) REFERENCES public."Producto"(ID_Producto);

ALTER TABLE public."Reporte_Operacion"
ADD CONSTRAINT fk_rep_op_reporte
FOREIGN KEY (ID_Reporte) REFERENCES public."Reporte"(ID_Reporte);

ALTER TABLE public."Reporte_Operacion"
ADD CONSTRAINT fk_rep_op_operacion
FOREIGN KEY (ID_Operacion) REFERENCES public."Operacion"(ID_Operacion);

ALTER TABLE public."Alerta_Buzon"
ADD CONSTRAINT fk_alerta_buzon
FOREIGN KEY (ID_Alerta) REFERENCES public."Alerta"(ID_Alerta);

ALTER TABLE public."Alerta_Automatica"
ADD CONSTRAINT fk_alerta_auto
FOREIGN KEY (ID_Alerta) REFERENCES public."Alerta"(ID_Alerta);

ALTER TABLE public."Alerta_Automatica"
ADD CONSTRAINT fk_alerta_operacion
FOREIGN KEY (ID_Operacion) REFERENCES public."Operacion"(ID_Operacion);

ALTER TABLE public."Caso"
ADD CONSTRAINT fk_caso_alerta
FOREIGN KEY (ID_Alerta) REFERENCES public."Alerta"(ID_Alerta);

ALTER TABLE public."Usuario_Caso"
ADD CONSTRAINT fk_usuario_caso_usuario
FOREIGN KEY (ID_Usuario) REFERENCES public."Usuario"(ID_Usuario);

ALTER TABLE public."Usuario_Caso"
ADD CONSTRAINT fk_usuario_caso_caso
FOREIGN KEY (ID_Caso) REFERENCES public."Caso"(ID_Caso);

ALTER TABLE public."Documento"
ADD CONSTRAINT fk_documento_cliente
FOREIGN KEY (ID_Cliente) REFERENCES public."Cliente"(ID_Cliente);

ALTER TABLE public."Validacion_Documento"
ADD CONSTRAINT fk_val_doc_usuario
FOREIGN KEY (ID_Usuario) REFERENCES public."Usuario"(ID_Usuario);

ALTER TABLE public."Validacion_Documento"
ADD CONSTRAINT fk_val_doc_documento
FOREIGN KEY (ID_Documento) REFERENCES public."Documento"(ID_Documento);

ALTER TABLE public."Validacion_Lista"
ADD CONSTRAINT fk_val_lista_cliente
FOREIGN KEY (ID_Cliente) REFERENCES public."Cliente"(ID_Cliente);

ALTER TABLE public."Validacion_Lista"
ADD CONSTRAINT fk_val_lista_lista
FOREIGN KEY (ID_Lista) REFERENCES public."Lista_Riesgo"(ID_Lista);

ALTER TABLE public."Validacion_Lista"
ADD CONSTRAINT fk_val_lista_usuario
FOREIGN KEY (ID_Usuario) REFERENCES public."Usuario"(ID_Usuario);

ALTER TABLE public."Configuracion_Lista"
ADD CONSTRAINT fk_config_usuario
FOREIGN KEY (ID_Usuario) REFERENCES public."Usuario"(ID_Usuario);

ALTER TABLE public."Configuracion_Lista"
ADD CONSTRAINT fk_config_lista
FOREIGN KEY (ID_Lista) REFERENCES public."Lista_Riesgo"(ID_Lista);



--
-- PostgreSQL database dump complete
--
