const pool= require('../db');
module.exports.get_reportes = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT * FROM reportes
            ORDER BY fecha DESC
        `);
        res.render('reportes', {
            reportes: resultado.rows,
            usuarioSesion: req.session.usuario,
            csrfToken: res.locals.csrfToken  // ← agregar esta línea
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener reportes');
    }
};
module.exports.post_crear=async(req,res)=>{
    try{
        const {titulo, descripcion, tipo, prioridad}=req.body;
        await pool.query(`
            INSERT INTO reportes (titulo, descripcion, tipo, prioridad)
            VALUES ($1,$2,$3,$4)
        `, [titulo, descripcion, tipo, prioridad]);
        res.redirect('/reportes');
    } catch (err){
        console.error(err);
        res.status(500).send('Error al crear reporte');
    }
};
module.exports.delete_reporte = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM reportes WHERE id = $1`, [id]);
        res.redirect('/reportes');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar reporte');
    }
};