-- usuarios_permisos.sql
-- Sistema RBAC para control de acceso basado en roles
-- Complemento de la base de datos principal
-- Nota: La tabla "Usuario" ya existe en el sistema principal.

-- Acciones por permiso



 -- Cliente 
 -- Puede subir archivos relacionados a su situacion

INSERT INTO public."Rol_Permiso" (ID_Rol, ID_Permiso)
SELECT r.ID_Rol, p.ID_Permiso
FROM public."Rol" r, public."Permiso" p
WHERE r.Nombre = 'Cliente'
  AND p.Clave IN ('subir_evidencia')
ON CONFLICT (ID_Rol, ID_Permiso) DO NOTHING;
 
-- Empleado
-- crea alertas_buzon y sube evidencia
INSERT INTO public."Rol_Permiso" (ID_Rol, ID_Permiso)
SELECT r.ID_Rol, p.ID_Permiso
FROM public."Rol" r, public."Permiso" p
WHERE r.Nombre = 'Empleado'
  AND p.Clave IN ('crear_alerta', 'subir_evidencia')
ON CONFLICT (ID_Rol, ID_Permiso) DO NOTHING;
 
-- Oficial_Cumplimiento
-- ve, valida y gestiona alertas y ve documentación
INSERT INTO public."Rol_Permiso" (ID_Rol, ID_Permiso)
SELECT r.ID_Rol, p.ID_Permiso
FROM public."Rol" r, public."Permiso" p
WHERE r.Nombre = 'Oficial_Cumplimiento'
  AND p.Clave IN ('ver_alertas', 'validar_alertas', 'ver_documentacion', 'gestionar_alertas')
ON CONFLICT (ID_Rol, ID_Permiso) DO NOTHING;

-- Administrador 
-- gestión del sistema y usuarios, sin intervenir en alertas
INSERT INTO public."Rol_Permiso" (ID_Rol, ID_Permiso)
SELECT r.ID_Rol, p.ID_Permiso
FROM public."Rol" r, public."Permiso" p
WHERE r.Nombre = 'Administrador'
  AND p.Clave IN ('gestionar_usuarios', 'configurar_listas')
ON CONFLICT (ID_Rol, ID_Permiso) DO NOTHING;
 
-- Auditoria 
-- visibilidad de todo, sin modificar ni gestionar usuarios
INSERT INTO public."Rol_Permiso" (ID_Rol, ID_Permiso)
SELECT r.ID_Rol, p.ID_Permiso
FROM public."Rol" r, public."Permiso" p
WHERE r.Nombre = 'Auditoria'
  AND p.Clave IN ('ver_alertas', 'ver_documentacion', 'configurar_listas')
ON CONFLICT (ID_Rol, ID_Permiso) DO NOTHING;