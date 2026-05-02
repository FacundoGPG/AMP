document.addEventListener("DOMContentLoaded", () => {
  const tableContainer = document.getElementById("operaciones-table");
  if (!tableContainer) return;

  const operaciones = [
    ["OP-001", "Ana López", "Crédito Personal", "Transferencia", "$25,000", "24/05/2024", "Exitosa", "Bajo"],
    ["OP-002", "Empresa X", "Factoraje", "Depósito", "$150,000", "24/05/2024", "Exitosa", "Medio"],
    ["OP-003", "Juan Pérez", "Crédito Empresarial", "Retiro", "$8,500", "24/05/2024", "En revisión", "Alto"],
    ["OP-004", "Carlos Ruiz", "Crédito Personal", "Transferencia", "$12,000", "24/05/2024", "Sospechosa", "Alto"],
    ["OP-005", "María García", "Disposición", "Pago", "$1,250", "24/05/2024", "Exitosa", "Bajo"]
  ];

  new gridjs.Grid({
    columns: ["ID Operación", "Cliente", "Producto", "Tipo", "Monto", "Fecha", "Estatus", "Riesgo"],
    data: operaciones,
    search: false,
    sort: true,
    pagination: { limit: 10 }
  }).render(tableContainer);
});