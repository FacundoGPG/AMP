function escaparCSV(valor) {
  const texto = String(valor ?? "");
  return `"${texto.replace(/"/g, '""')}"`;
}

function fechaArchivo() {
  return new Date().toISOString().slice(0, 10);
}

function nombreCSV(nombreBase) {
  return `${nombreBase}_${fechaArchivo()}.csv`;
}

function parseCSV(data, options) {
  const fields = options.fields || [];
  const delimiter = options.delimiter || ";";
  const encabezados = fields.map((field) => escaparCSV(field.label || field.value)).join(delimiter);
  const contenido = data.map((row) => (
    fields.map((field) => {
      const valor = typeof field.value === "function"
        ? field.value(row)
        : row[field.value];

      return escaparCSV(valor);
    }).join(delimiter)
  ));

  return [encabezados, ...contenido].join("\r\n");
}

function normalizarOpcionesExport(nombreArchivo, fields, data) {
  if (typeof nombreArchivo === "object") {
    return nombreArchivo;
  }

  return {
    filename: nombreArchivo,
    fields,
    data,
    delimiter: ";"
  };
}

function exportarCSV(options, fields, data) {
  const config = normalizarOpcionesExport(options, fields, data);
  const csv = parseCSV(config.data || [], {
    fields: config.fields,
    delimiter: config.delimiter || ";"
  });
  const contenidoCSV = "\uFEFF" + csv;
  const blob = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = config.filename || nombreCSV(config.nombreBase || "exportacion");
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
