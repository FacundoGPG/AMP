const pool = require('../config/database');

exports.Operacion = class {

    static async findAll() {
        const sql = `
            SELECT
                o.id_operacion AS "ID_Operacion",
                c.nombre AS "Cliente",
                p.nombre AS "Producto",
                o.tipo_operacion AS "Tipo_Operacion",
                o.monto AS "Monto",
                o.fecha AS "Fecha",
                o.estado AS "Estado",
                o.canal AS "Canal",
                CASE
                    WHEN MAX(
                        CASE
                            WHEN a.prioridad = 'Alta' THEN 3
                            WHEN a.prioridad = 'Media' THEN 2
                            WHEN a.prioridad = 'Baja' THEN 1
                            ELSE 0
                        END
                    ) = 3 THEN 'Alto'
                    WHEN MAX(
                        CASE
                            WHEN a.prioridad = 'Alta' THEN 3
                            WHEN a.prioridad = 'Media' THEN 2
                            WHEN a.prioridad = 'Baja' THEN 1
                            ELSE 0
                        END
                    ) = 2 THEN 'Medio'
                    ELSE 'Bajo'
                END AS "Riesgo"
            FROM public."Operacion" o
            JOIN public."Contrato" ct ON ct.id_contrato = o.id_contrato
            JOIN public."Cliente" c ON c.id_cliente = ct.id_cliente
            JOIN public."Producto" p ON p.id_producto = ct.id_producto
            LEFT JOIN public."Alerta_Automatica" aa ON aa.id_operacion = o.id_operacion
            LEFT JOIN public."Alerta" a ON a.id_alerta = aa.id_alerta
            GROUP BY
                o.id_operacion, c.nombre, p.nombre,
                o.tipo_operacion, o.monto, o.fecha, o.estado, o.canal
        `;

        const result = await pool.query(sql);
        return result.rows;
    }
    //las o, c y p son abreviaturas
    static async getOperacionesByCliente(id_cliente) {
    const sql = `
        SELECT
            o.id_operacion AS "ID_Operacion",
            o.tipo_operacion AS "Tipo_Operacion",
            o.monto AS "Monto",
            o.fecha AS "Fecha",
            o.estado AS "Estado",
            o.canal AS "Canal",
            p.nombre AS "Producto"

        FROM public."Operacion" o
        JOIN public."Contrato" ct
        ON ct.id_contrato = o.id_contrato
        JOIN public."Producto" p
        ON p.id_producto = ct.id_producto
        WHERE ct.id_cliente = $1
        ORDER BY o.fecha DESC
    `;
        const resultado = await pool.query(sql, [id_cliente]);
        return resultado.rows;
    }

    static async getPerfilTransaccional() {
        const sql = `
            SELECT
                tipo_operacion AS "Tipo_Operacion",
                COUNT(*) AS "Total",
                COALESCE(SUM(monto), 0) AS "Monto_Total",
                COALESCE(AVG(monto), 0) AS "Monto_Promedio"
            FROM public."Operacion"
            GROUP BY tipo_operacion
            ORDER BY "Total" DESC
        `;
        const result = await pool.query(sql);
        return result.rows;
    }

    static async createOperacion({ id_contrato, tipo_operacion, monto, canal, fecha }) {
        const sql = `
            INSERT INTO public."Operacion"(
                id_contrato,
                tipo_operacion,
                monto,
                canal,
                fecha,
                estado)
            VALUES ($1, $2, $3, $4, $5, 'Completada')
            RETURNING *
        `;
        const result = await pool.query(sql, [id_contrato, tipo_operacion, monto, canal, fecha]);
        return result.rows[0];
    }

    static async verificarUmbralesYGenerarAlertas(id_operacion, id_contrato, monto) {
        const contratoRes = await pool.query(
            `SELECT id_cliente FROM public."Contrato" WHERE id_contrato = $1`,
            [id_contrato]
        );

        if (!contratoRes.rows.length) {
            return [];
        }

        const id_cliente = contratoRes.rows[0].id_cliente;
        const umbralesRes = await pool.query(`
            SELECT
                u.id_umbral,
                u.tipo_alerta,
                u.valor_limite,
                u.nivel,
                u.descripcion
            FROM public."Umbral" u
            JOIN public."Cliente_Umbral" cu ON cu.id_umbral = u.id_umbral
            WHERE cu.id_cliente = $1 AND cu.activo = true
        `, [id_cliente]);

        const alertasGeneradas = [];

        for (const umbral of umbralesRes.rows) {
            const disparar =
                ["Operacion alta", "Operacion critica", "Transferencia", "Operacion inusual", "Operación alta", "Operación crítica", "Operación inusual"].includes(umbral.tipo_alerta) &&
                Number(monto) >= Number(umbral.valor_limite);

            if (!disparar) {
                continue;
            }

            const alertaRes = await pool.query(`
                INSERT INTO public."Alerta"
                    (tipo_alerta, fecha_generacion, motivo, estatus, prioridad)
                VALUES ($1, NOW(), $2, 'Nueva', $3)
                RETURNING id_alerta
            `, [
                umbral.tipo_alerta,
                `${umbral.descripcion} - Monto: $${Number(monto).toLocaleString("es-MX")}`,
                umbral.nivel
            ]);

            const id_alerta = alertaRes.rows[0].id_alerta;

            await pool.query(`
                INSERT INTO public."Alerta_Automatica" (id_alerta, id_operacion)
                VALUES ($1, $2)
            `, [id_alerta, id_operacion]);

            alertasGeneradas.push({ id_alerta, tipo: umbral.tipo_alerta, nivel: umbral.nivel });
        }

        return alertasGeneradas;
    }
}
