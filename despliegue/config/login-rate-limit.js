const MAX_INTENTOS = 5;
const VENTANA_MS = 60 * 1000;
const COOLDOWN_MS = 60 * 1000;

const intentosLogin = new Map();

function limpiarIp(ip) {
  return String(ip || "ip-desconocida").replace(/^::ffff:/, "");
}

function obtenerIdentificador(req) {
  const correo = (req.body?.Correo || req.body?.username || "anonimo")
    .toString()
    .trim()
    .toLowerCase();
  const ip = limpiarIp(req.ip || req.connection?.remoteAddress);

  return `${ip}:${correo}`;
}

function obtenerRegistro(key, ahora = Date.now()) {
  const registro = intentosLogin.get(key);

  if (!registro || ahora - registro.inicioVentana > VENTANA_MS) {
    return {
      intentos: 0,
      inicioVentana: ahora,
      bloqueadoHasta: 0
    };
  }

  return registro;
}

function verificarCooldownLogin(req, res, next) {
  const ahora = Date.now();
  const key = obtenerIdentificador(req);
  const registro = obtenerRegistro(key, ahora);

  req.loginRateLimitKey = key;

  if (registro.bloqueadoHasta > ahora) {
    const segundosRestantes = Math.ceil((registro.bloqueadoHasta - ahora) / 1000);
    console.warn(`[login-rate-limit] Intento bloqueado para ${key}. Espera ${segundosRestantes}s.`);
    res.set("Retry-After", String(segundosRestantes));
    return res
      .status(429)
      .send(`Demasiados intentos fallidos. Espera ${segundosRestantes} segundos antes de intentar de nuevo.`);
  }

  registro.intentos += 1;

  if (registro.intentos > MAX_INTENTOS) {
    registro.bloqueadoHasta = ahora + COOLDOWN_MS;
    intentosLogin.set(key, registro);

    const segundosRestantes = Math.ceil(COOLDOWN_MS / 1000);
    console.warn(`[login-rate-limit] Cooldown activado para ${key}. Intentos: ${registro.intentos}.`);
    res.set("Retry-After", String(segundosRestantes));
    return res
      .status(429)
      .send(`Demasiados intentos. Espera ${segundosRestantes} segundos antes de intentar de nuevo.`);
  }

  console.log(`[login-rate-limit] Intento ${registro.intentos}/${MAX_INTENTOS} para ${key}.`);
  intentosLogin.set(key, registro);
  return next();
}

function registrarIntentoLoginFallido(req) {
  const ahora = Date.now();
  const key = req.loginRateLimitKey || obtenerIdentificador(req);
  const registro = obtenerRegistro(key, ahora);

  registro.intentos += 1;

  if (registro.intentos >= MAX_INTENTOS) {
    registro.bloqueadoHasta = ahora + COOLDOWN_MS;
  }

  intentosLogin.set(key, registro);
}

function limpiarIntentosLogin(req) {
  const key = req.loginRateLimitKey || obtenerIdentificador(req);
  intentosLogin.delete(key);
}

module.exports = {
  verificarCooldownLogin,
  registrarIntentoLoginFallido,
  limpiarIntentosLogin
};
