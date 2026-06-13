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
}

