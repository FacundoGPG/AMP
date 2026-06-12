const { createClient } = require("@supabase/supabase-js");

const BUCKET = "documentos";

function getSupabase() {
  console.log("ENV CHECK - SUPABASE_URL:", process.env.SUPABASE_URL ? "OK" : "MISSING");
  console.log("ENV CHECK - SERVICE_KEY:", process.env.SUPABASE_SERVICE_KEY ? "OK" : "MISSING");
  console.log("Todas las env vars:", Object.keys(process.env).filter(k => k.includes("SUPA")));
  
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

async function subirArchivo(buffer, nombreArchivo, mimeType) {
  const supabase = getSupabase();
  const timestamp = Date.now();
  const ruta = `documentos/${timestamp}_${nombreArchivo}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(ruta, buffer, { contentType: mimeType, upsert: false });

  if (error) throw new Error(`Error subiendo archivo: ${error.message}`);

  const { data, error: urlError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(ruta, 60 * 60 * 24 * 365);

  if (urlError) throw new Error(`Error generando URL: ${urlError.message}`);

  return { url: data.signedUrl, ruta };
}



module.exports = { subirArchivo };

