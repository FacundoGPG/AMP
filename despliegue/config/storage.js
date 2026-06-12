const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const BUCKET = "documentos";

/**
 * Sube un archivo a Supabase Storage
 * @param {Buffer} buffer - contenido del archivo
 * @param {string} nombreArchivo - nombre con extensión
 * @param {string} mimeType - tipo MIME del archivo
 * @returns {string} URL pública del archivo
 */
async function subirArchivo(buffer, nombreArchivo, mimeType) {
  // Generar nombre único para evitar colisiones
  const timestamp = Date.now();
  const ruta = `documentos/${timestamp}_${nombreArchivo}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(ruta, buffer, {
      contentType: mimeType,
      upsert: false
    });

  if (error) throw new Error(`Error subiendo archivo: ${error.message}`);

  // Generar URL firmada con 1 año de vigencia
  const { data, error: urlError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(ruta, 60 * 60 * 24 * 365);

  if (urlError) throw new Error(`Error generando URL: ${urlError.message}`);

  return { url: data.signedUrl, ruta };
}

module.exports = { subirArchivo };