

const tableContainer = document.getElementById("operaciones-table");
const operaciones = [
  ["OP-001", "Ana López", "Crédito Personal", "Transferencia", "$25,000", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-002", "Empresa X", "Factoraje", "Depósito", "$150,000", "24/05/2024", "Exitosa", "Medio"],
  ["OP-003", "Juan Pérez", "Crédito Empresarial", "Retiro", "$8,500", "24/05/2024", "En revisión", "Alto"],
  ["OP-004", "Carlos Ruiz", "Crédito Personal", "Transferencia", "$12,000", "24/05/2024", "Sospechosa", "Alto"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
  ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"],
];
if (tableContainer) {
  new gridjs.Grid({
    columns: [
      "ID Operacion",
      "Cliente",
      "Producto",
      "Tipo",
      "Monto",
      "Fecha",
      "Estatus",
      "Riesgo"
    ],
    data: operaciones,
    search: false ,
    sort: true,
    pagination: {
      limit: 10
    }
  }).render(tableContainer);
}

document.addEventListener("DOMContentLoaded", () => {
const tableContainer = document.getElementById("alertas-table");
const alertas = [
  ["AL-0001", "2024-05-24 13:45", "Ana López", "Transacción inusual", "Transferencia por monto elevado detectada.", "Alta", "En revisión"],
  ["AL-0002", "2024-05-24 12:30", "Empresa X", "Patrón inusual", "Múltiples operaciones fraccionadas.", "Media", "Abierta"],
  ["AL-0003", "2024-05-24 11:15", "Juan Pérez", "Datos inconsistentes", "Diferencia en documentación.", "Alta", "En revisión"],
  ["AL-0004", "2024-05-24 10:05", "Carlos Ruiz", "Actividad sospechosa", "Cambio de dispositivo frecuente.", "Alta", "Abierta"],
  ["AL-0005", "2024-05-24 09:40", "María García", "Perfil de riesgo", "Coincidencia en listas restrictivas.", "Alta", "Cerrada"],
  ["AL-0006", "2024-05-24 09:10", "Distribuidora Z", "Uso inusual", "Operaciones fuera del patrón.", "Media", "En revisión"],
  ["AL-0007", "2024-05-24 08:55", "Pedro Martínez", "Transacción inusual", "Depósitos recurrentes.", "Media", "Abierta"],
  ["AL-0008", "2024-05-24 08:20", "Constructora AB", "Patrón inusual", "Pagos a múltiples beneficiarios.", "Baja", "Cerrada"],
  ["AL-0009", "2024-05-24 07:50", "Laura Sánchez", "Datos inconsistentes", "Datos fiscales incorrectos.", "Media", "Abierta"],
  ["AL-0010", "2024-05-24 07:15", "Servicios GHI", "Actividad sospechosa", "Descargas inusuales.", "Alta", "En revisión"],
  ["AL-0011", "2024-05-24 07:20", "Servicios 234", "Actividad sospechosa", "Descargas inusuales.", "Medio", "Cerrada"],
  ["AL-0011", "2024-05-24 07:20", "Servicios 123", "Actividad sospechosa", "Descargas inusuales.", "Alta", "Abierta"]
];

if (tableContainer) {
  new gridjs.Grid({
    columns: [
      "ID Alerta",
      "Fecha",
      "Cliente",
      "Tipo de Alerta",
      "Descripción",
      "Prioridad",
      "Estatus"
    ],
    data: alertas,
    search: false,
    sort: true,
    pagination: {
      limit: 10
    }
  }).render(tableContainer);

  
}})

