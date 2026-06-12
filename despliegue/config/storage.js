const BUCKET = "documentos";

let supabase = null;

function getSupabaseClient() {
  if (!supabase) {
    const { createClient } = require("@supabase/supabase-js");
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }

  return supabase;
}

async function subirArchivo(buffer, nombreArchivo, mimeType) {
  const client = getSupabaseClient();
  const timestamp = Date.now();
  const ruta = `documentos/${timestamp}_${nombreArchivo}`;

  const { error } = await client.storage
    .from(BUCKET)
    .upload(ruta, buffer, {
      contentType: mimeType,
      upsert: false
    });

  if (error) throw new Error(`Error subiendo archivo: ${error.message}`);

  const { data, error: urlError } = await client.storage
    .from(BUCKET)
    .createSignedUrl(ruta, 60 * 60 * 24 * 365);

  if (urlError) throw new Error(`Error generando URL: ${urlError.message}`);

  return { url: data.signedUrl, ruta };
}

module.exports = { subirArchivo };
