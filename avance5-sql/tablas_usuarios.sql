-- tablas_usuarios.sql
-- Sistema RBAC para control de acceso basado en roles
-- Complemento de la base de datos principal
-- Nota: La tabla "Usuario" ya existe en el sistema principal.




-- Nuevas tablas para autenticacion y rol de usuarios

 
CREATE TABLE IF NOT EXISTS public."Rol" (
    ID_Rol  SERIAL      PRIMARY KEY,
    Nombre  VARCHAR(50) NOT NULL UNIQUE
);
 
CREATE TABLE IF NOT EXISTS public."Permiso" (
    ID_Permiso  SERIAL      PRIMARY KEY,
    Clave       VARCHAR(60) NOT NULL UNIQUE
);
 
CREATE TABLE IF NOT EXISTS public."Usuario_Rol" (
    ID_Usuario  INTEGER NOT NULL REFERENCES public."Usuario"(ID_Usuario) ON DELETE CASCADE,
    ID_Rol      INTEGER NOT NULL REFERENCES public."Rol"(ID_Rol)         ON DELETE CASCADE,
    PRIMARY KEY (ID_Usuario, ID_Rol)
);
 
CREATE TABLE IF NOT EXISTS public."Rol_Permiso" (
    ID_Rol      INTEGER NOT NULL REFERENCES public."Rol"(ID_Rol)         ON DELETE CASCADE,
    ID_Permiso  INTEGER NOT NULL REFERENCES public."Permiso"(ID_Permiso) ON DELETE CASCADE,
    PRIMARY KEY (ID_Rol, ID_Permiso)
);
 

-- Creacion de los indices del usuario y rol

 
CREATE INDEX IF NOT EXISTS idx_usuario_rol_usuario  ON public."Usuario_Rol" (ID_Usuario);
CREATE INDEX IF NOT EXISTS idx_usuario_rol_rol      ON public."Usuario_Rol" (ID_Rol);
CREATE INDEX IF NOT EXISTS idx_rol_permiso_rol      ON public."Rol_Permiso" (ID_Rol);
CREATE INDEX IF NOT EXISTS idx_rol_permiso_permiso  ON public."Rol_Permiso" (ID_Permiso);

-- Establecer los tipos de roles que van a existir en el sistema

INSERT INTO public."Rol" (Nombre) VALUES
    ('Cliente'),
    ('Empleado'),
    ('Oficial_Cumplimiento'),
    ('Auditoria')
ON CONFLICT (Nombre) DO NOTHING;

-- Establecer los diferentes tipos de permisos que existen en
-- el sistema y con lo que se definira cada usuario.
 
INSERT INTO public."Permiso" (Clave) VALUES
    ('ver_alertas'),
    ('crear_alerta'),
    ('gestionar_alertas'),
    ('validar_alertas'),
    ('subir_evidencia'),
    ('ver_documentacion'),
    ('gestionar_usuarios'),
    ('configurar_listas')
ON CONFLICT (Clave) DO NOTHING;
