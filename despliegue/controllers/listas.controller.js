const listasModel = require("../models/listas.model");
const clientesModel = require("../models/clientes.model");
const multer = require("multer");

const TIPOS_LISTA = ["PEP", "Lista_Negra", "Sancion", "Otro"];

const uploadCsv = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.toLowerCase().endsWith(".csv")) {
      return cb(null, true);
    }

    cb(new Error("Solo se permiten archivos CSV"));
  }
}).single("file");

exports.uploadCsv = uploadCsv;

function parseCsvLine(line, delimiter = ",") {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function extraerNombresCsv(buffer) {
  const contenido = buffer.toString("utf8").replace(/^\uFEFF/, "");
  const lineas = contenido
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean);

  if (!lineas.length) return [];

  const delimiter = (lineas[0].match(/;/g) || []).length > (lineas[0].match(/,/g) || []).length
    ? ";"
    : ",";
  const primeraFila = parseCsvLine(lineas[0], delimiter).map((valor) => valor.toLowerCase());
  const headersNombre = ["nombre", "name", "razon_social", "razon social", "rfc"];
  const tieneHeader = primeraFila.some((valor) => headersNombre.includes(valor));
  const indiceNombre = tieneHeader
    ? Math.max(primeraFila.findIndex((valor) => headersNombre.includes(valor)), 0)
    : 0;
  const filasDatos = tieneHeader ? lineas.slice(1) : lineas;

  return [...new Set(
    filasDatos
      .map((linea) => parseCsvLine(linea, delimiter)[indiceNombre]?.trim())
      .filter(Boolean)
  )];
}

exports.renderListas = async (req, res) => {
  try {
    const listas = await listasModel.getListas();
    res.render("listas", {
      pageTitle: "Listas de Riesgo",
      listas,
      tiposLista: TIPOS_LISTA
    });
  } catch (error) {
    console.error("Error cargando listas:", error);
    res.status(500).send("Error al cargar listas de riesgo");
  }
};

exports.getListas = async (req, res) => {
  try {
    const listas = await listasModel.getListas();
    res.json(listas);
  } catch (error) {
    console.error("Error obteniendo listas:", error);
    res.status(500).json({ error: "Error al obtener listas" });
  }
};

exports.addLista = async (req, res) => {
  const { tipo_lista, nombre, fuente } = req.body;

  if (!tipo_lista?.trim() || !nombre?.trim() || !fuente?.trim()) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (!TIPOS_LISTA.includes(tipo_lista)) {
    return res.status(400).json({ error: "Tipo de lista no valido" });
  }

  try {
    const lista = await listasModel.addLista({
      tipo_lista,
      nombre: nombre.trim(),
      fuente: fuente.trim()
    });

    await listasModel.registrarConfiguracion({
      id_usuario: req.session.usuario.id,
      id_lista: lista.id_lista,
      tipo_accion: "Creacion",
      descripcion_cambio: `Se creo la lista "${lista.nombre}" de tipo ${lista.tipo_lista}`
    });

    res.status(201).json(lista);
  } catch (error) {
    console.error("Error agregando lista:", error);

    if (error.code === "LISTA_DUPLICADA") {
      return res.status(409).json({ error: "Ya existe una lista con ese nombre y tipo" });
    }

    res.status(500).json({ error: "Error al agregar lista" });
  }
};

exports.updateLista = async (req, res) => {
  const id_lista = req.params.id;
  const { tipo_lista, nombre, fuente } = req.body;

  if (!tipo_lista?.trim() || !nombre?.trim() || !fuente?.trim()) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (!TIPOS_LISTA.includes(tipo_lista)) {
    return res.status(400).json({ error: "Tipo de lista no valido" });
  }

  try {
    const anterior = await listasModel.getListaById(id_lista);
    if (!anterior) return res.status(404).json({ error: "Lista no encontrada" });

    const actualizada = await listasModel.updateLista(id_lista, {
      tipo_lista,
      nombre: nombre.trim(),
      fuente: fuente.trim()
    });

    await listasModel.registrarConfiguracion({
      id_usuario: req.session.usuario.id,
      id_lista,
      tipo_accion: "Actualizacion",
      descripcion_cambio: `Se actualizo la lista "${anterior.nombre}" a "${actualizada.nombre}"`
    });

    res.json(actualizada);
  } catch (error) {
    console.error("Error actualizando lista:", error);
    res.status(500).json({ error: "Error al actualizar lista" });
  }
};

exports.deleteLista = async (req, res) => {
  const id_lista = req.params.id;

  try {
    const lista = await listasModel.getListaById(id_lista);
    if (!lista) return res.status(404).json({ error: "Lista no encontrada" });

    await listasModel.deleteLista(id_lista, req.session.usuario.id);
    res.json({ ok: true });
  } catch (error) {
    console.error("Error eliminando lista:", error);
    res.status(500).json({ error: "Error al eliminar lista" });
  }
};

exports.getHistorialLista = async (req, res) => {
  try {
    const historial = await listasModel.getConfiguracionByLista(req.params.id);
    res.json(historial);
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    res.status(500).json({ error: "Error al obtener historial" });
  }
};

exports.importarCsvYValidarClientes = async (req, res) => {
  uploadCsv(req, res, async (error) => {
    if (error) {
      return res.status(400).json({ error: error.message || "Error al subir CSV" });
    }

    const tipo_lista = req.body.tipo_lista;
    const fuente = req.body.fuente?.trim() || "CSV";

    if (!req.file) {
      return res.status(400).json({ error: "No se recibio archivo CSV" });
    }

    if (!TIPOS_LISTA.includes(tipo_lista)) {
      return res.status(400).json({ error: "Tipo de lista no valido" });
    }

    try {
      const nombres = extraerNombresCsv(req.file.buffer);

      if (!nombres.length) {
        return res.status(400).json({ error: "El CSV no contiene nombres validos" });
      }

      const importacion = await listasModel.importarListas({
        tipo_lista,
        fuente,
        nombres
      });

      const validacion = await clientesModel.validarTodosContraListas(req.session.usuario.id);

      for (const lista of importacion.importadas) {
        await listasModel.registrarConfiguracion({
          id_usuario: req.session.usuario.id,
          id_lista: lista.id_lista,
          tipo_accion: "Importacion_CSV",
          descripcion_cambio: `Se importo la lista "${lista.nombre}" desde CSV`
        });
      }

      res.json({
        ok: true,
        importadas: importacion.importadas.length,
        duplicadas: importacion.duplicadas.length,
        total_csv: nombres.length,
        ...validacion
      });
    } catch (err) {
      console.error("Error importando CSV de listas:", err);
      res.status(500).json({ error: "Error al importar CSV y validar clientes" });
    }
  });
};
