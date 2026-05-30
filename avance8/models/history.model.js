const pool = require("../config/database");

exports.History = class {

  static async findAll() {
    const sql = `
      SELECT
        h.ID_Historial AS "ID",
        u.Nombre || ' ' || u.Apellido AS "Usuario",
        h.Actividad AS "Actividad",
        h.Modulo AS "Modulo",
        h.Fecha AS "Fecha",
        h.Estado AS "Estado"
      FROM public."Historial" h
      JOIN public."Usuario" u ON u.ID_Usuario = h.ID_Usuario
      ORDER BY h.Fecha DESC
    `;
    const result = await pool.query(sql);
    return result.rows;
  }

  static async findByModulo(modulo) {
    const sql = `
      SELECT
        h.ID_Historial AS "ID",
        u.Nombre || ' ' || u.Apellido AS "Usuario",
        h.Actividad AS "Actividad",
        h.Modulo AS "Modulo",
        h.Fecha AS "Fecha",
        h.Estado AS "Estado"
      FROM public."Historial" h
      JOIN public."Usuario" u ON u.ID_Usuario = h.ID_Usuario
      WHERE h.Modulo = $1
      ORDER BY h.Fecha DESC
    `;
    const result = await pool.query(sql, [modulo]);
    return result.rows;
  }
};