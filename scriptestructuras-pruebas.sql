--
-- Configuracion de Inserts a las Tables creadas
--
--

--
-- Inserts a Cliente
--

INSERT INTO public."Cliente" VALUES (1, 'Juan Perez', 'Fisica', 'JUAP800101AAA', 'CDMX', 'juan@mail.com', '5512345678', 'Activo');
INSERT INTO public."Cliente" VALUES (2, 'Maria Lopez', 'Fisica', 'MALO850202BBB', 'Monterrey', 'maria@mail.com', '5587654321', 'Activo');
INSERT INTO public."Cliente" VALUES (3, 'Empresa XYZ', 'Moral', 'XYZ900303CCC', 'Guadalajara', 'contacto@xyz.com', '5545678912', 'Activo');
INSERT INTO public."Cliente" VALUES (4, 'Luis Martinez', 'Fisica', 'LUMA900404DDD', 'Toluca', 'luis@mail.com', '5511111111', 'Activo');
INSERT INTO public."Cliente" VALUES (5, 'Ana Torres', 'Fisica', 'ANTO910505EEE', 'Puebla', 'ana@mail.com', '5522222222', 'Activo');
INSERT INTO public."Cliente" VALUES (6, 'Roberto Diaz', 'Fisica', 'RODI920606FFF', 'Queretaro', 'roberto@mail.com', '5533333333', 'Activo');
INSERT INTO public."Cliente" VALUES (7, 'Fernanda Cruz', 'Fisica', 'FECR930707GGG', 'CDMX', 'fernanda@mail.com', '5544444444', 'Activo');
INSERT INTO public."Cliente" VALUES (8, 'Carlos Herrera', 'Fisica', 'CAHE940808HHH', 'Monterrey', 'carlos@mail.com', '5555555555', 'Activo');
INSERT INTO public."Cliente" VALUES (9, 'Daniela Vargas', 'Fisica', 'DAVA950909III', 'Guadalajara', 'daniela@mail.com', '5566666666', 'Activo');
INSERT INTO public."Cliente" VALUES (10, 'Grupo Alfa SA', 'Moral', 'ALFA960101JJJ', 'CDMX', 'contacto@alfa.com', '5577777777', 'Activo');
INSERT INTO public."Cliente" VALUES (11, 'Constructora Beta', 'Moral', 'BETA970202KKK', 'Monterrey', 'beta@mail.com', '5588888888', 'Activo');
INSERT INTO public."Cliente" VALUES (12, 'Servicios Gamma', 'Moral', 'GAMM980303LLL', 'Puebla', 'gamma@mail.com', '5599999999', 'Activo');
INSERT INTO public."Cliente" VALUES (13, 'Miguel Reyes', 'Fisica', 'MIRE990404MMM', 'Toluca', 'miguel@mail.com', '5510101010', 'Activo');
INSERT INTO public."Cliente" VALUES (14, 'Sofia Morales', 'Fisica', 'SOMO000505NNN', 'CDMX', 'sofia@mail.com', '5520202020', 'Activo');
INSERT INTO public."Cliente" VALUES (15, 'Oscar Flores', 'Fisica', 'OSFL010606OOO', 'Guadalajara', 'oscar@mail.com', '5530303030', 'Activo');
INSERT INTO public."Cliente" VALUES (16, 'Paula Jimenez', 'Fisica', 'PAJI020707PPP', 'Monterrey', 'paula@mail.com', '5540404040', 'Activo');
INSERT INTO public."Cliente" VALUES (17, 'Ricardo Luna', 'Fisica', 'RILU030808QQQ', 'Puebla', 'ricardo@mail.com', '5550505050', 'Activo');
INSERT INTO public."Cliente" VALUES (18, 'Empresa Delta', 'Moral', 'DELT040909RRR', 'CDMX', 'delta@mail.com', '5560606060', 'Activo');
INSERT INTO public."Cliente" VALUES (19, 'Empresa Omega', 'Moral', 'OMEG050101SSS', 'Toluca', 'omega@mail.com', '5570707070', 'Activo');
INSERT INTO public."Cliente" VALUES (20, 'Consultora Sigma', 'Moral', 'SIGM060202TTT', 'Queretaro', 'sigma@mail.com', '5580808080', 'Activo');

--
-- Inserts a Usuario
--

INSERT INTO public."Usuario" VALUES (1, 'Carlos Admin', 'Administrador', 'admin@sistema.com');
INSERT INTO public."Usuario" VALUES (2, 'Laura Oficial', 'Oficial', 'oficial@sistema.com');
INSERT INTO public."Usuario" VALUES (3, 'Pedro Empleado', 'Empleado', 'empleado@sistema.com');
INSERT INTO public."Usuario" VALUES (4, 'Ana Admin', 'Administrador', 'ana.admin@sistema.com');
INSERT INTO public."Usuario" VALUES (5, 'Luis Oficial', 'Oficial', 'luis.oficial@sistema.com');
INSERT INTO public."Usuario" VALUES (6, 'Sofia Oficial', 'Oficial', 'sofia.oficial@sistema.com');
INSERT INTO public."Usuario" VALUES (7, 'Miguel Empleado', 'Empleado', 'miguel@sistema.com');
INSERT INTO public."Usuario" VALUES (8, 'Laura Empleado', 'Empleado', 'laura@sistema.com');
INSERT INTO public."Usuario" VALUES (9, 'Pedro Empleado2', 'Empleado', 'pedro2@sistema.com');
INSERT INTO public."Usuario" VALUES (10, 'Carlos Auditor', 'Oficial', 'auditor@sistema.com');
INSERT INTO public."Usuario" VALUES (11, 'Admin Secundario', 'Administrador', 'admin2@sistema.com');
INSERT INTO public."Usuario" VALUES (12, 'Jorge Castillo', 'Empleado', 'jorge.castillo@sistema.com');
INSERT INTO public."Usuario" VALUES (13, 'Daniela Rios', 'Empleado', 'daniela.rios@sistema.com');
INSERT INTO public."Usuario" VALUES (14, 'Fernando Aguilar', 'Empleado', 'fernando.aguilar@sistema.com');
INSERT INTO public."Usuario" VALUES (15, 'Gabriela Mendoza', 'Empleado', 'gabriela.mendoza@sistema.com');
INSERT INTO public."Usuario" VALUES (16, 'Ricardo Pacheco', 'Oficial', 'ricardo.pacheco@sistema.com');
INSERT INTO public."Usuario" VALUES (17, 'Veronica Salinas', 'Oficial', 'veronica.salinas@sistema.com');
INSERT INTO public."Usuario" VALUES (18, 'Alejandro Navarro', 'Empleado', 'alejandro.navarro@sistema.com');
INSERT INTO public."Usuario" VALUES (19, 'Patricia Ortega', 'Empleado', 'patricia.ortega@sistema.com');
INSERT INTO public."Usuario" VALUES (20, 'Hector Zamora', 'Administrador', 'hector.zamora@sistema.com');


--
-- Inserts a Producto
--

INSERT INTO public."Producto" VALUES (1, 'Credito Personal', 'Credito');
INSERT INTO public."Producto" VALUES (2, 'Arrendamiento', 'Financiero');
INSERT INTO public."Producto" VALUES (3, 'Credito Automotriz', 'Credito');
INSERT INTO public."Producto" VALUES (4, 'Credito Hipotecario', 'Credito');
INSERT INTO public."Producto" VALUES (5, 'Leasing Industrial', 'Financiero');
INSERT INTO public."Producto" VALUES (6, 'Factoraje', 'Financiero');
INSERT INTO public."Producto" VALUES (7, 'Credito Empresarial', 'Credito');
INSERT INTO public."Producto" VALUES (8, 'Microcredito', 'Credito');
INSERT INTO public."Producto" VALUES (9, 'Arrendamiento Puro', 'Financiero');
INSERT INTO public."Producto" VALUES (10, 'Arrendamiento Financiero', 'Financiero');


--
-- Inserts a Contrato
--

INSERT INTO public."Contrato" VALUES (1, 1, '2025-01-01', NULL, 'Activo', 50000);
INSERT INTO public."Contrato" VALUES (2, 2, '2025-02-01', NULL, 'Activo', 120000);
INSERT INTO public."Contrato" VALUES (3, 3, '2025-01-05', NULL, 'Activo', 75000);
INSERT INTO public."Contrato" VALUES (4, 4, '2025-01-10', NULL, 'Activo', 60000);
INSERT INTO public."Contrato" VALUES (5, 5, '2025-01-15', NULL, 'Activo', 90000);
INSERT INTO public."Contrato" VALUES (6, 6, '2025-01-20', NULL, 'Activo', 110000);
INSERT INTO public."Contrato" VALUES (7, 7, '2025-01-25', NULL, 'Activo', 45000);
INSERT INTO public."Contrato" VALUES (8, 8, '2025-01-28', NULL, 'Activo', 300000);
INSERT INTO public."Contrato" VALUES (9, 9, '2025-02-02', NULL, 'Activo', 25000);
INSERT INTO public."Contrato" VALUES (10, 10, '2025-02-05', NULL, 'Activo', 200000);
INSERT INTO public."Contrato" VALUES (11, 11, '2025-02-08', NULL, 'Activo', 95000);
INSERT INTO public."Contrato" VALUES (12, 12, '2025-02-10', NULL, 'Activo', 87000);
INSERT INTO public."Contrato" VALUES (13, 13, '2025-02-12', NULL, 'Activo', 43000);
INSERT INTO public."Contrato" VALUES (14, 14, '2025-02-14', NULL, 'Activo', 120000);
INSERT INTO public."Contrato" VALUES (15, 15, '2025-02-16', NULL, 'Activo', 67000);
INSERT INTO public."Contrato" VALUES (16, 16, '2025-02-18', NULL, 'Activo', 52000);
INSERT INTO public."Contrato" VALUES (17, 17, '2025-02-20', NULL, 'Activo', 76000);
INSERT INTO public."Contrato" VALUES (18, 18, '2025-02-22', NULL, 'Activo', 134000);
INSERT INTO public."Contrato" VALUES (19, 19, '2025-02-24', NULL, 'Activo', 41000);
INSERT INTO public."Contrato" VALUES (20, 20, '2025-02-26', NULL, 'Activo', 99000);
INSERT INTO public."Contrato" VALUES (21, 1, '2025-03-01', NULL, 'Activo', 150000);
INSERT INTO public."Contrato" VALUES (22, 2, '2025-03-02', NULL, 'Activo', 32000);
INSERT INTO public."Contrato" VALUES (23, 3, '2025-03-03', NULL, 'Activo', 78000);
INSERT INTO public."Contrato" VALUES (24, 4, '2025-03-04', NULL, 'Activo', 56000);
INSERT INTO public."Contrato" VALUES (25, 5, '2025-03-05', NULL, 'Activo', 99000);
INSERT INTO public."Contrato" VALUES (26, 6, '2025-03-06', NULL, 'Activo', 15000);
INSERT INTO public."Contrato" VALUES (27, 7, '2025-03-07', NULL, 'Activo', 88000);
INSERT INTO public."Contrato" VALUES (28, 8, '2025-03-08', NULL, 'Activo', 61000);
INSERT INTO public."Contrato" VALUES (29, 9, '2025-03-09', NULL, 'Activo', 73000);
INSERT INTO public."Contrato" VALUES (30, 10, '2025-03-10', NULL, 'Activo', 27000);
INSERT INTO public."Contrato" VALUES (31, 11, '2025-03-11', NULL, 'Activo', 66000);
INSERT INTO public."Contrato" VALUES (32, 12, '2025-03-12', NULL, 'Activo', 38000);
INSERT INTO public."Contrato" VALUES (33, 13, '2025-03-13', NULL, 'Activo', 44000);
INSERT INTO public."Contrato" VALUES (34, 14, '2025-03-14', NULL, 'Activo', 91000);
INSERT INTO public."Contrato" VALUES (35, 15, '2025-03-15', NULL, 'Activo', 120000);
INSERT INTO public."Contrato" VALUES (36, 16, '2025-03-16', NULL, 'Activo', 25000);
INSERT INTO public."Contrato" VALUES (37, 17, '2025-03-17', NULL, 'Activo', 70000);
INSERT INTO public."Contrato" VALUES (38, 18, '2025-03-18', NULL, 'Activo', 64000);
INSERT INTO public."Contrato" VALUES (39, 19, '2025-03-19', NULL, 'Activo', 85000);
INSERT INTO public."Contrato" VALUES (40, 20, '2025-03-20', NULL, 'Activo', 33000);
INSERT INTO public."Contrato" VALUES (41, 1, '2025-03-21', NULL, 'Activo', 91000);
INSERT INTO public."Contrato" VALUES (42, 2, '2025-03-22', NULL, 'Activo', 47000);
INSERT INTO public."Contrato" VALUES (43, 3, '2025-03-23', NULL, 'Activo', 102000);
INSERT INTO public."Contrato" VALUES (44, 4, '2025-03-24', NULL, 'Activo', 29000);
INSERT INTO public."Contrato" VALUES (45, 5, '2025-03-25', NULL, 'Activo', 76000);
INSERT INTO public."Contrato" VALUES (46, 6, '2025-03-26', NULL, 'Activo', 88000);
INSERT INTO public."Contrato" VALUES (47, 7, '2025-03-27', NULL, 'Activo', 134000);
INSERT INTO public."Contrato" VALUES (48, 8, '2025-03-28', NULL, 'Activo', 41000);
INSERT INTO public."Contrato" VALUES (49, 9, '2025-03-29', NULL, 'Activo', 99000);
INSERT INTO public."Contrato" VALUES (50, 10, '2025-03-30', NULL, 'Activo', 50000);

--
-- Inserts a Operacion
--

INSERT INTO public."Operacion" VALUES (1, 1, 1, '2025-04-05', 15000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (2, 2, 2, '2025-04-06', 32000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (3, 3, 3, '2025-04-07', 27000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (4, 3, 1, '2025-04-08', 20000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (5, 4, 2, '2025-04-09', 75000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (6, 5, 3, '2025-04-10', 12000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (7, 6, 4, '2025-04-11', 98000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (8, 7, 5, '2025-04-12', 150000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (9, 8, 6, '2025-04-13', 300000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (10, 9, 7, '2025-04-14', 45000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (11, 10, 8, '2025-04-15', 60000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (12, 1, 2, '2025-04-16', 18000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (13, 2, 3, '2025-04-17', 22000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (14, 3, 4, '2025-04-18', 50000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (15, 4, 5, '2025-04-19', 125000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (16, 5, 6, '2025-04-20', 34000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (17, 6, 7, '2025-04-21', 87000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (18, 7, 8, '2025-04-22', 91000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (19, 8, 9, '2025-04-23', 43000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (20, 9, 10, '2025-04-24', 67000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (21, 10, 1, '2025-04-01', 21000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (22, 11, 2, '2025-04-02', 45000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (23, 12, 3, '2025-04-03', 32000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (24, 13, 4, '2025-04-04', 78000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (25, 14, 5, '2025-04-05', 56000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (26, 15, 6, '2025-04-06', 99000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (27, 16, 7, '2025-04-07', 15000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (28, 17, 8, '2025-04-08', 88000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (29, 18, 9, '2025-04-09', 61000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (30, 19, 10, '2025-04-10', 73000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (31, 20, 1, '2025-04-11', 27000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (32, 1, 2, '2025-04-12', 66000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (33, 2, 3, '2025-04-13', 38000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (34, 3, 4, '2025-04-14', 44000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (35, 4, 5, '2025-04-15', 91000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (36, 5, 6, '2025-04-16', 120000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (37, 6, 7, '2025-04-17', 25000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (38, 7, 8, '2025-04-18', 70000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (39, 8, 9, '2025-04-19', 64000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (40, 9, 10, '2025-04-20', 85000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (41, 10, 1, '2025-04-21', 33000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (42, 11, 2, '2025-04-22', 91000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (43, 12, 3, '2025-04-23', 47000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (44, 13, 4, '2025-04-24', 102000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (45, 14, 5, '2025-04-25', 29000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (46, 15, 6, '2025-04-26', 76000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (47, 16, 7, '2025-04-27', 88000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (48, 17, 8, '2025-04-28', 134000, 'Transferencia', 'Completada');
INSERT INTO public."Operacion" VALUES (49, 18, 9, '2025-04-29', 41000, 'Deposito', 'Completada');
INSERT INTO public."Operacion" VALUES (50, 19, 10, '2025-04-30', 99000, 'Transferencia', 'Completada');

--
-- Inserts a Reporte
--

INSERT INTO public."Reporte" VALUES (1, 'XML', '2025-04-10', 'Enviado');
INSERT INTO public."Reporte" VALUES (2, 'XML', '2025-04-11', 'Enviado');
INSERT INTO public."Reporte" VALUES (3, 'CSV', '2025-04-12', 'Enviado');
INSERT INTO public."Reporte" VALUES (4, 'XML', '2025-04-13', 'Pendiente');
INSERT INTO public."Reporte" VALUES (5, 'PDF', '2025-04-14', 'Enviado');
INSERT INTO public."Reporte" VALUES (6, 'XML', '2025-04-15', 'Error');
INSERT INTO public."Reporte" VALUES (7, 'CSV', '2025-04-16', 'Enviado');
INSERT INTO public."Reporte" VALUES (8, 'XML', '2025-04-17', 'Pendiente');
INSERT INTO public."Reporte" VALUES (9, 'PDF', '2025-04-18', 'Enviado');
INSERT INTO public."Reporte" VALUES (10, 'XML', '2025-04-19', 'Enviado');


--
-- Inserts a Reporte_Operacion
--

INSERT INTO public."Reporte_Operacion" VALUES (1, 1);
INSERT INTO public."Reporte_Operacion" VALUES (1, 2);
INSERT INTO public."Reporte_Operacion" VALUES (1, 3);
INSERT INTO public."Reporte_Operacion" VALUES (1, 4);
INSERT INTO public."Reporte_Operacion" VALUES (1, 5);
INSERT INTO public."Reporte_Operacion" VALUES (1, 6);
INSERT INTO public."Reporte_Operacion" VALUES (1, 7);
INSERT INTO public."Reporte_Operacion" VALUES (1, 8);
INSERT INTO public."Reporte_Operacion" VALUES (1, 9);
INSERT INTO public."Reporte_Operacion" VALUES (1, 10);
INSERT INTO public."Reporte_Operacion" VALUES (1, 11);
INSERT INTO public."Reporte_Operacion" VALUES (1, 12);
INSERT INTO public."Reporte_Operacion" VALUES (1, 13);
INSERT INTO public."Reporte_Operacion" VALUES (1, 14);
INSERT INTO public."Reporte_Operacion" VALUES (1, 15);
INSERT INTO public."Reporte_Operacion" VALUES (1, 16);
INSERT INTO public."Reporte_Operacion" VALUES (1, 17);
INSERT INTO public."Reporte_Operacion" VALUES (1, 18);
INSERT INTO public."Reporte_Operacion" VALUES (1, 19);
INSERT INTO public."Reporte_Operacion" VALUES (1, 20);
INSERT INTO public."Reporte_Operacion" VALUES (1, 21);
INSERT INTO public."Reporte_Operacion" VALUES (1, 22);
INSERT INTO public."Reporte_Operacion" VALUES (1, 23);
INSERT INTO public."Reporte_Operacion" VALUES (1, 24);
INSERT INTO public."Reporte_Operacion" VALUES (1, 25);
INSERT INTO public."Reporte_Operacion" VALUES (1, 26);
INSERT INTO public."Reporte_Operacion" VALUES (1, 27);
INSERT INTO public."Reporte_Operacion" VALUES (1, 28);
INSERT INTO public."Reporte_Operacion" VALUES (1, 29);
INSERT INTO public."Reporte_Operacion" VALUES (1, 30);
INSERT INTO public."Reporte_Operacion" VALUES (1, 31);
INSERT INTO public."Reporte_Operacion" VALUES (1, 32);
INSERT INTO public."Reporte_Operacion" VALUES (1, 33);
INSERT INTO public."Reporte_Operacion" VALUES (1, 34);
INSERT INTO public."Reporte_Operacion" VALUES (1, 35);
INSERT INTO public."Reporte_Operacion" VALUES (1, 36);
INSERT INTO public."Reporte_Operacion" VALUES (1, 37);
INSERT INTO public."Reporte_Operacion" VALUES (1, 38);
INSERT INTO public."Reporte_Operacion" VALUES (1, 39);
INSERT INTO public."Reporte_Operacion" VALUES (1, 40);
INSERT INTO public."Reporte_Operacion" VALUES (1, 41);
INSERT INTO public."Reporte_Operacion" VALUES (1, 42);
INSERT INTO public."Reporte_Operacion" VALUES (1, 43);
INSERT INTO public."Reporte_Operacion" VALUES (1, 44);
INSERT INTO public."Reporte_Operacion" VALUES (1, 45);
INSERT INTO public."Reporte_Operacion" VALUES (1, 46);
INSERT INTO public."Reporte_Operacion" VALUES (1, 47);
INSERT INTO public."Reporte_Operacion" VALUES (1, 48);
INSERT INTO public."Reporte_Operacion" VALUES (1, 49);
INSERT INTO public."Reporte_Operacion" VALUES (1, 50);


--
-- Inserts a Alerta
--

INSERT INTO public."Alerta" VALUES (1, 'Automatica', '2025-04-06', 'Monto elevado inusual', 'Abierta');
INSERT INTO public."Alerta" VALUES (2, 'Buzon', '2025-04-07', 'Actividad sospechosa reportada', 'Abierta');
INSERT INTO public."Alerta" VALUES (3, 'Automatica', '2025-04-08', 'Multiples depositos en corto periodo', 'Abierta');
INSERT INTO public."Alerta" VALUES (4, 'Automatica', '2025-04-09', 'Transferencia internacional atipica', 'Abierta');
INSERT INTO public."Alerta" VALUES (5, 'Buzon', '2025-04-10', 'Cliente nervioso durante verificacion', 'Abierta');
INSERT INTO public."Alerta" VALUES (6, 'Automatica', '2025-04-11', 'Operacion fuera de perfil del cliente', 'Abierta');
INSERT INTO public."Alerta" VALUES (7, 'Automatica', '2025-04-12', 'Uso inusual de credito empresarial', 'Abierta');
INSERT INTO public."Alerta" VALUES (8, 'Buzon', '2025-04-13', 'Documentacion inconsistente detectada', 'Abierta');
INSERT INTO public."Alerta" VALUES (9, 'Automatica', '2025-04-14', 'Incremento repentino en volumen de operaciones', 'Abierta');
INSERT INTO public."Alerta" VALUES (10, 'Automatica', '2025-04-15', 'Transferencias repetitivas a misma cuenta', 'Abierta');
INSERT INTO public."Alerta" VALUES (11, 'Buzon', '2025-04-16', 'Reporte interno de posible fraude', 'Abierta');
INSERT INTO public."Alerta" VALUES (12, 'Automatica', '2025-04-17', 'Depositos en efectivo superiores al promedio', 'Abierta');
INSERT INTO public."Alerta" VALUES (13, 'Automatica', '2025-04-18', 'Operacion vinculada a lista de riesgo', 'Abierta');
INSERT INTO public."Alerta" VALUES (14, 'Buzon', '2025-04-19', 'Cliente evita proporcionar informacion', 'Abierta');
INSERT INTO public."Alerta" VALUES (15, 'Automatica', '2025-04-20', 'Actividad fuera de horario habitual', 'Abierta');
INSERT INTO public."Alerta" VALUES (16, 'Automatica', '2025-04-21', 'Movimientos inconsistentes con ingresos declarados', 'Abierta');
INSERT INTO public."Alerta" VALUES (17, 'Buzon', '2025-04-22', 'Posible uso de identidad falsa', 'Abierta');
INSERT INTO public."Alerta" VALUES (18, 'Automatica', '2025-04-23', 'Transferencia fragmentada para evadir controles', 'Abierta');
INSERT INTO public."Alerta" VALUES (19, 'Automatica', '2025-04-24', 'Cuenta receptora previamente marcada', 'Abierta');
INSERT INTO public."Alerta" VALUES (20, 'Buzon', '2025-04-25', 'Empleado reporta comportamiento irregular', 'Abierta');


--
-- Inserts a Alerta_Buzon
--

INSERT INTO public."Alerta_Buzon" VALUES (2, 'Empleado reporta comportamiento extraño', NULL, 'TOKEN123ABC');
INSERT INTO public."Alerta_Buzon" VALUES (5, 'Cliente nervioso durante verificacion', NULL, 'TOKEN456DEF');
INSERT INTO public."Alerta_Buzon" VALUES (8, 'Documentacion inconsistente detectada', NULL, 'TOKEN789GHI');
INSERT INTO public."Alerta_Buzon" VALUES (11, 'Reporte interno de posible fraude', NULL, 'TOKEN321JKL');
INSERT INTO public."Alerta_Buzon" VALUES (14, 'Cliente evita proporcionar informacion', NULL, 'TOKEN654MNO');
INSERT INTO public."Alerta_Buzon" VALUES (17, 'Posible uso de identidad falsa', NULL, 'TOKEN987PQR');
INSERT INTO public."Alerta_Buzon" VALUES (20, 'Empleado reporta comportamiento irregular', NULL, 'TOKEN111STU');


--
-- Inserts a Alerta_Automatica
--

INSERT INTO public."Alerta_Automatica" VALUES (1, 3);
INSERT INTO public."Alerta_Automatica" VALUES (3, 1);
INSERT INTO public."Alerta_Automatica" VALUES (4, 2);
INSERT INTO public."Alerta_Automatica" VALUES (6, 3);
INSERT INTO public."Alerta_Automatica" VALUES (7, 4);
INSERT INTO public."Alerta_Automatica" VALUES (9, 5);
INSERT INTO public."Alerta_Automatica" VALUES (10, 6);
INSERT INTO public."Alerta_Automatica" VALUES (12, 7);
INSERT INTO public."Alerta_Automatica" VALUES (13, 8);
INSERT INTO public."Alerta_Automatica" VALUES (15, 9);
INSERT INTO public."Alerta_Automatica" VALUES (16, 10);
INSERT INTO public."Alerta_Automatica" VALUES (18, 2);
INSERT INTO public."Alerta_Automatica" VALUES (19, 4);


--
-- Inserts a Caso
--

INSERT INTO public."Caso" VALUES (1, 1, 'Revisión por posible lavado', 'En proceso', '2025-04-06', NULL);
INSERT INTO public."Caso" VALUES (2, 2, 'Investigación interna', 'Abierto', '2025-04-07', NULL);

INSERT INTO public."Caso" VALUES (3, 3, 'Analisis de depositos fraccionados', 'En proceso', '2025-04-08', NULL);
INSERT INTO public."Caso" VALUES (4, 4, 'Transferencia internacional sospechosa', 'Abierto', '2025-04-09', NULL);
INSERT INTO public."Caso" VALUES (5, 5, 'Validacion de comportamiento del cliente', 'En proceso', '2025-04-10', NULL);
INSERT INTO public."Caso" VALUES (6, 6, 'Operacion fuera de perfil financiero', 'En proceso', '2025-04-11', NULL);
INSERT INTO public."Caso" VALUES (7, 7, 'Uso inusual de credito empresarial', 'Abierto', '2025-04-12', NULL);
INSERT INTO public."Caso" VALUES (8, 8, 'Revision de documentos inconsistentes', 'En proceso', '2025-04-13', NULL);
INSERT INTO public."Caso" VALUES (9, 9, 'Incremento inusual en volumen de operaciones', 'Abierto', '2025-04-14', NULL);
INSERT INTO public."Caso" VALUES (10, 10, 'Transferencias repetitivas detectadas', 'En proceso', '2025-04-15', NULL);
INSERT INTO public."Caso" VALUES (11, 11, 'Posible fraude interno', 'Abierto', '2025-04-16', NULL);
INSERT INTO public."Caso" VALUES (12, 12, 'Depositos en efectivo elevados', 'En proceso', '2025-04-17', NULL);
INSERT INTO public."Caso" VALUES (13, 13, 'Coincidencia con lista de riesgo', 'Abierto', '2025-04-18', NULL);
INSERT INTO public."Caso" VALUES (14, 14, 'Cliente no proporciona informacion requerida', 'En proceso', '2025-04-19', NULL);
INSERT INTO public."Caso" VALUES (15, 15, 'Actividad fuera de horario habitual', 'Abierto', '2025-04-20', NULL);
INSERT INTO public."Caso" VALUES (16, 16, 'Movimientos inconsistentes con ingresos', 'En proceso', '2025-04-21', NULL);
INSERT INTO public."Caso" VALUES (17, 17, 'Posible suplantacion de identidad', 'Abierto', '2025-04-22', NULL);
INSERT INTO public."Caso" VALUES (18, 18, 'Transferencias fragmentadas detectadas', 'En proceso', '2025-04-23', NULL);
INSERT INTO public."Caso" VALUES (19, 19, 'Cuenta vinculada a operaciones riesgosas', 'Abierto', '2025-04-24', NULL);
INSERT INTO public."Caso" VALUES (20, 20, 'Reporte de comportamiento irregular', 'En proceso', '2025-04-25', NULL);


--
-- Inserts a Usuario_Caso
--

INSERT INTO public."Usuario_Caso" VALUES (2, 1, '2025-04-06', 'Asignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (2, 2, '2025-04-07', 'Asignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (3, 3, '2025-04-08', 'Asignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (4, 4, '2025-04-09', 'Asignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (5, 5, '2025-04-10', 'Asignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (6, 6, '2025-04-11', 'Asignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (7, 7, '2025-04-12', 'Asignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (8, 8, '2025-04-13', 'Asignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (9, 9, '2025-04-14', 'Asignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (10, 10, '2025-04-15', 'Asignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (11, 11, '2025-04-16', 'Asignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (12, 12, '2025-04-17', 'Asignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (13, 13, '2025-04-18', 'Asignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (14, 14, '2025-04-19', 'Asignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (15, 15, '2025-04-20', 'Asignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (16, 16, '2025-04-21', 'Asignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (17, 17, '2025-04-22', 'Asignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (18, 18, '2025-04-23', 'Asignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (19, 19, '2025-04-24', 'Asignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (20, 20, '2025-04-25', 'Asignado', 'En análisis');

INSERT INTO public."Usuario_Caso" VALUES (1, 1, '2025-04-08', 'Seguimiento', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (3, 2, '2025-04-09', 'Seguimiento', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (4, 3, '2025-04-10', 'Seguimiento', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (5, 4, '2025-04-11', 'Seguimiento', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (6, 5, '2025-04-12', 'Seguimiento', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (7, 6, '2025-04-13', 'Seguimiento', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (8, 7, '2025-04-14', 'Seguimiento', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (9, 8, '2025-04-15', 'Seguimiento', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (10, 9, '2025-04-16', 'Seguimiento', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (11, 10, '2025-04-17', 'Seguimiento', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (12, 11, '2025-04-18', 'Seguimiento', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (13, 12, '2025-04-19', 'Seguimiento', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (14, 13, '2025-04-20', 'Seguimiento', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (15, 14, '2025-04-21', 'Seguimiento', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (16, 15, '2025-04-22', 'Seguimiento', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (17, 16, '2025-04-23', 'Seguimiento', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (18, 17, '2025-04-24', 'Seguimiento', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (19, 18, '2025-04-25', 'Seguimiento', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (20, 19, '2025-04-26', 'Seguimiento', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (1, 20, '2025-04-27', 'Seguimiento', 'En análisis');

INSERT INTO public."Usuario_Caso" VALUES (2, 3, '2025-04-28', 'Reasignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (3, 5, '2025-04-29', 'Reasignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (4, 7, '2025-04-30', 'Reasignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (5, 9, '2025-05-01', 'Reasignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (6, 11, '2025-05-02', 'Reasignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (7, 13, '2025-05-03', 'Reasignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (8, 15, '2025-05-04', 'Reasignado', 'En análisis');
INSERT INTO public."Usuario_Caso" VALUES (9, 17, '2025-05-05', 'Reasignado', 'Pendiente');
INSERT INTO public."Usuario_Caso" VALUES (10, 19, '2025-05-06', 'Reasignado', 'En análisis');


--
-- Inserts a Documento
--

INSERT INTO public."Documento" VALUES (1, 1, 'INE', 'Validado', '2025-04-01');
INSERT INTO public."Documento" VALUES (2, 2, 'Comprobante Domicilio', 'Pendiente', '2025-04-02');
INSERT INTO public."Documento" VALUES (3, 3, 'Acta Constitutiva', 'Validado', '2025-04-03');
INSERT INTO public."Documento" VALUES (4, 4, 'INE', 'Validado', '2025-04-04');
INSERT INTO public."Documento" VALUES (5, 5, 'Pasaporte', 'Pendiente', '2025-04-05');
INSERT INTO public."Documento" VALUES (6, 6, 'INE', 'Validado', '2025-04-06');
INSERT INTO public."Documento" VALUES (7, 7, 'Comprobante Domicilio', 'Validado', '2025-04-07');
INSERT INTO public."Documento" VALUES (8, 8, 'Pasaporte', 'Pendiente', '2025-04-08');
INSERT INTO public."Documento" VALUES (9, 9, 'INE', 'Validado', '2025-04-09');
INSERT INTO public."Documento" VALUES (10, 10, 'Acta Constitutiva', 'Validado', '2025-04-10');
INSERT INTO public."Documento" VALUES (11, 11, 'Acta Constitutiva', 'Pendiente', '2025-04-11');
INSERT INTO public."Documento" VALUES (12, 12, 'INE', 'Validado', '2025-04-12');
INSERT INTO public."Documento" VALUES (13, 13, 'Pasaporte', 'Pendiente', '2025-04-13');
INSERT INTO public."Documento" VALUES (14, 14, 'INE', 'Validado', '2025-04-14');
INSERT INTO public."Documento" VALUES (15, 15, 'Comprobante Domicilio', 'Validado', '2025-04-15');
INSERT INTO public."Documento" VALUES (16, 16, 'INE', 'Pendiente', '2025-04-16');
INSERT INTO public."Documento" VALUES (17, 17, 'Pasaporte', 'Validado', '2025-04-17');
INSERT INTO public."Documento" VALUES (18, 18, 'Acta Constitutiva', 'Pendiente', '2025-04-18');
INSERT INTO public."Documento" VALUES (19, 19, 'INE', 'Validado', '2025-04-19');
INSERT INTO public."Documento" VALUES (20, 20, 'Comprobante Domicilio', 'Pendiente', '2025-04-20');



--
-- Inserts a Validacion_Documento
--

INSERT INTO public."Validacion_Documento" VALUES (2, 1, 'Manual', NULL);
INSERT INTO public."Validacion_Documento" VALUES (1, 1, 'Automatica', NULL);
INSERT INTO public."Validacion_Documento" VALUES (3, 2, 'Manual', NULL);
INSERT INTO public."Validacion_Documento" VALUES (4, 3, 'Automatica', NULL);
INSERT INTO public."Validacion_Documento" VALUES (5, 4, 'Manual', NULL);
INSERT INTO public."Validacion_Documento" VALUES (6, 5, 'Automatica', NULL);
INSERT INTO public."Validacion_Documento" VALUES (7, 6, 'Manual', NULL);
INSERT INTO public."Validacion_Documento" VALUES (8, 7, 'Automatica', NULL);
INSERT INTO public."Validacion_Documento" VALUES (9, 8, 'Manual', NULL);
INSERT INTO public."Validacion_Documento" VALUES (10, 9, 'Automatica', NULL);
INSERT INTO public."Validacion_Documento" VALUES (11, 10, 'Manual', NULL);
INSERT INTO public."Validacion_Documento" VALUES (12, 11, 'Automatica', NULL);
INSERT INTO public."Validacion_Documento" VALUES (13, 12, 'Manual', NULL);
INSERT INTO public."Validacion_Documento" VALUES (14, 13, 'Automatica', NULL);
INSERT INTO public."Validacion_Documento" VALUES (15, 14, 'Manual', NULL);
INSERT INTO public."Validacion_Documento" VALUES (16, 15, 'Automatica', NULL);
INSERT INTO public."Validacion_Documento" VALUES (17, 16, 'Manual', NULL);
INSERT INTO public."Validacion_Documento" VALUES (18, 17, 'Automatica', NULL);
INSERT INTO public."Validacion_Documento" VALUES (19, 18, 'Manual', NULL);
INSERT INTO public."Validacion_Documento" VALUES (20, 19, 'Automatica', NULL);
INSERT INTO public."Validacion_Documento" VALUES (1, 20, 'Manual', NULL);



--
-- Inserts a Lista_Riesgo
--

INSERT INTO public."Lista_Riesgo" VALUES (1, 'PEP', 'Lista PEP Nacional', 'Gobierno de Mexico');
INSERT INTO public."Lista_Riesgo" VALUES (2, 'Bloqueados', 'Lista de Personas Bloqueadas', 'SAT');
INSERT INTO public."Lista_Riesgo" VALUES (3, 'Bloqueados', 'Lista OFAC SDN', 'Departamento del Tesoro EUA');
INSERT INTO public."Lista_Riesgo" VALUES (4, 'Bloqueados', 'Lista de Sanciones ONU', 'Naciones Unidas');
INSERT INTO public."Lista_Riesgo" VALUES (5, 'Bloqueados', 'Lista de Sanciones UE', 'Union Europea');
INSERT INTO public."Lista_Riesgo" VALUES (6, 'Bloqueados', 'Notificaciones Rojas', 'Interpol');
INSERT INTO public."Lista_Riesgo" VALUES (7, 'Bloqueados', 'Personas Investigadas', 'Fiscalia General de la Republica');
INSERT INTO public."Lista_Riesgo" VALUES (8, 'Bloqueados', 'Empresas Factureras 69-B', 'SAT');
INSERT INTO public."Lista_Riesgo" VALUES (9, 'Bloqueados', 'Personas bajo investigacion financiera', 'UIF Mexico');
INSERT INTO public."Lista_Riesgo" VALUES (10, 'PEP', 'PEP Internacional', 'Organismos Internacionales');



--
-- Inserts a Validacion_Lista
--

INSERT INTO public."Validacion_Lista" VALUES (1, 1, '2025-04-01', 'Sin coincidencia', 'Ninguna', 2);
INSERT INTO public."Validacion_Lista" VALUES (2, 2, '2025-04-01', 'Coincidencia', 'Exacta', 2);
INSERT INTO public."Validacion_Lista" VALUES (3, 3, '2025-04-02', 'Sin coincidencia', 'Ninguna', 3);
INSERT INTO public."Validacion_Lista" VALUES (4, 4, '2025-04-02', 'Coincidencia', 'Parcial', 4);
INSERT INTO public."Validacion_Lista" VALUES (5, 5, '2025-04-03', 'Sin coincidencia', 'Ninguna', 5);
INSERT INTO public."Validacion_Lista" VALUES (6, 6, '2025-04-03', 'Coincidencia', 'Exacta', 6);
INSERT INTO public."Validacion_Lista" VALUES (7, 7, '2025-04-04', 'Sin coincidencia', 'Ninguna', 7);
INSERT INTO public."Validacion_Lista" VALUES (8, 8, '2025-04-04', 'Coincidencia', 'Parcial', 8);
INSERT INTO public."Validacion_Lista" VALUES (9, 9, '2025-04-05', 'Sin coincidencia', 'Ninguna', 9);
INSERT INTO public."Validacion_Lista" VALUES (10, 10, '2025-04-05', 'Coincidencia', 'Exacta', 10);
INSERT INTO public."Validacion_Lista" VALUES (11, 1, '2025-04-06', 'Sin coincidencia', 'Ninguna', 11);
INSERT INTO public."Validacion_Lista" VALUES (12, 2, '2025-04-06', 'Coincidencia', 'Parcial', 12);
INSERT INTO public."Validacion_Lista" VALUES (13, 3, '2025-04-07', 'Sin coincidencia', 'Ninguna', 13);
INSERT INTO public."Validacion_Lista" VALUES (14, 4, '2025-04-07', 'Coincidencia', 'Exacta', 14);
INSERT INTO public."Validacion_Lista" VALUES (15, 5, '2025-04-08', 'Sin coincidencia', 'Ninguna', 15);
INSERT INTO public."Validacion_Lista" VALUES (16, 6, '2025-04-08', 'Coincidencia', 'Parcial', 16);
INSERT INTO public."Validacion_Lista" VALUES (17, 7, '2025-04-09', 'Sin coincidencia', 'Ninguna', 17);
INSERT INTO public."Validacion_Lista" VALUES (18, 8, '2025-04-09', 'Coincidencia', 'Exacta', 18);
INSERT INTO public."Validacion_Lista" VALUES (19, 9, '2025-04-10', 'Sin coincidencia', 'Ninguna', 19);
INSERT INTO public."Validacion_Lista" VALUES (20, 10, '2025-04-10', 'Coincidencia', 'Parcial', 20);



--
-- Inserts a Configuracion_Lista
--

INSERT INTO public."Configuracion_Lista" VALUES (1, 1, '2025-03-01', 'Alta', 'Se agregó nueva lista');
INSERT INTO public."Configuracion_Lista" VALUES (1, 2, '2025-03-05', 'Actualizacion', 'Actualización de registros');
INSERT INTO public."Configuracion_Lista" VALUES (2, 3, '2025-03-06', 'Alta', 'Integración de lista OFAC');
INSERT INTO public."Configuracion_Lista" VALUES (2, 4, '2025-03-07', 'Alta', 'Incorporación de lista ONU');
INSERT INTO public."Configuracion_Lista" VALUES (3, 5, '2025-03-08', 'Actualizacion', 'Actualización de sanciones UE');
INSERT INTO public."Configuracion_Lista" VALUES (3, 6, '2025-03-09', 'Actualizacion', 'Sincronización con Interpol');
INSERT INTO public."Configuracion_Lista" VALUES (4, 7, '2025-03-10', 'Alta', 'Carga inicial de registros FGR');
INSERT INTO public."Configuracion_Lista" VALUES (4, 8, '2025-03-11', 'Actualizacion', 'Actualización de lista 69-B');
INSERT INTO public."Configuracion_Lista" VALUES (5, 9, '2025-03-12', 'Actualizacion', 'Revisión de lista UIF');
INSERT INTO public."Configuracion_Lista" VALUES (5, 10, '2025-03-13', 'Alta', 'Integración de PEP internacional');