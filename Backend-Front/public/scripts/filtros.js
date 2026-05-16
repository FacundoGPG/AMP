function filtrarTabla(data, filtros, config) {
  return data.filter((item) => {
    return Object.entries(filtros).every(([campo, valor]) => {
      if (!valor || valor === "Todos") return true;

      const index = config[campo];
      return String(item[index]).toLowerCase().includes(valor.toLowerCase());
    });
  });
}

function filtrarPorFechas(data, fechaInicio, fechaFin, indexFecha) {
  if (!fechaInicio && !fechaFin) return data;

  return data.filter((item) => {
    const fechaItem = new Date(item[indexFecha]);
    const desde = fechaInicio ? new Date(fechaInicio) : null;
    const hasta = fechaFin ? new Date(fechaFin) : null;

    if (desde && fechaItem < desde) return false;
    if (hasta && fechaItem > hasta) return false;

    return true;
  });
}

function limpiarCamposFiltro(ids) {
  ids.forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.value = "";
  });
}