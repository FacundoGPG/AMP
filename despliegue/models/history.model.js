/*const pool = require("../config/database");

exports.History = class {
  constructor(usuario, actividad, modulo, fecha, estado) {
    this.usuario = usuario;
    this.actividad = actividad;
    this.modulo = modulo;
    this.fecha = fecha;
    this.estado = estado;
  }

  async save() {
    const sql = `
      INSERT INTO public."Historial"
      (
        usuario,
        actividad,
        modulo,
        fecha,
        estado
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING
        id_historial AS "ID",
        usuario AS "Usuario",
        actividad AS "Actividad",
        modulo AS "Modulo",
        fecha AS "Fecha",
        estado AS "Estado"
    `;

    const { rows } = await pool.query(sql, [
      this.usuario,
      this.actividad,
      this.modulo,
      this.fecha,
      this.estado,
    ]);

    return rows[0];
  }

  static async findAll() {
    const sql = `
      SELECT
        id_historial AS "ID",
        usuario AS "Usuario",
        actividad AS "Actividad",
        modulo AS "Modulo",
        fecha AS "Fecha",
        estado AS "Estado"
      FROM public."Historial"
      ORDER BY fecha DESC
    `;

    const result = await pool.query(sql);
    return result.rows;
  }

  static async findByModulo(modulo) {
    const sql = `
      SELECT
        id_historial AS "ID",
        usuario AS "Usuario",
        actividad AS "Actividad",
        modulo AS "Modulo",
        fecha AS "Fecha",
        estado AS "Estado"
      FROM public."Historial"
      WHERE modulo = $1
      ORDER BY fecha DESC
    `;

    const result = await pool.query(sql, [modulo]);
    return result.rows;
  }
};
*/

