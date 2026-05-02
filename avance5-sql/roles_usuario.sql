-- roles_usuario.sql
-- Asignacion de Roles por cada "Usuario"


-- Administrador  = 2  usuarios  (1, 2)
-- Oficial        = 4  usuarios  (3, 4, 5, 6)
-- Auditoria      = 2  usuarios  (7, 8)
-- Empleado       = 12  usuarios  (9 al 20)
 
INSERT INTO public."Usuario_Rol" (ID_Usuario, ID_Rol)
SELECT u, r.ID_Rol FROM (VALUES (1),(2)) AS t(u), public."Rol" r
WHERE r.Nombre = 'Administrador'
ON CONFLICT (ID_Usuario, ID_Rol) DO NOTHING;
 
INSERT INTO public."Usuario_Rol" (ID_Usuario, ID_Rol)
SELECT u, r.ID_Rol FROM (VALUES (3),(4),(5),(6)) AS t(u), public."Rol" r
WHERE r.Nombre = 'Oficial_Cumplimiento'
ON CONFLICT (ID_Usuario, ID_Rol) DO NOTHING;
 
INSERT INTO public."Usuario_Rol" (ID_Usuario, ID_Rol)
SELECT u, r.ID_Rol FROM (VALUES (7),(8)) AS t(u), public."Rol" r
WHERE r.Nombre = 'Auditoria'
ON CONFLICT (ID_Usuario, ID_Rol) DO NOTHING;
 
INSERT INTO public."Usuario_Rol" (ID_Usuario, ID_Rol)
SELECT u, r.ID_Rol FROM (VALUES (9),(10),(11),(12),(13),(14),(15),(16),(17),(18),(19),(20)) AS t(u), public."Rol" r
WHERE r.Nombre = 'Empleado'
ON CONFLICT (ID_Usuario, ID_Rol) DO NOTHING;