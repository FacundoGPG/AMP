const session = require("express-session");
const pool = require("./database");

class sesion extends session.Store {
  constructor() {
    super();
    this.ready = this.autoMigracion()
      ? this.init()
      : Promise.resolve();
  }

  autoMigracion() {
    if (process.env.SESSION_AUTO_MIGRATE) {
      return process.env.SESSION_AUTO_MIGRATE === "true";
    }

    return process.env.NODE_ENV !== "production";
  }

  reinicioSesion() {
    if (process.env.SESSION_TOUCH_ENABLED) {
      return process.env.SESSION_TOUCH_ENABLED === "true";
    }

    return process.env.NODE_ENV !== "production";
  }

  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.sesiones (
        sid VARCHAR(255) PRIMARY KEY,
        ses JSONB NOT NULL,
        createdon TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires TIMESTAMPTZ NOT NULL
      )
    `);

    await pool.query(`
      ALTER TABLE public.sesiones
      ADD COLUMN IF NOT EXISTS createdon TIMESTAMPTZ NOT NULL DEFAULT NOW()
    `);

    await pool.query(`
      ALTER TABLE public.sesiones
      ALTER COLUMN createdon SET DEFAULT NOW()
    `);
  }

  getExpires(ses) {
    if (ses.cookie && ses.cookie.expires) {
      return new Date(ses.cookie.expires);
    }

    const maxAge = ses.cookie && ses.cookie.originalMaxAge;
    return new Date(Date.now() + (maxAge || 24 * 60 * 60 * 1000));
  }

  async get(sid, callback) {
    try {
      await this.ready;

      const result = await pool.query(
        "SELECT ses FROM public.sesiones WHERE sid = $1 AND expires > NOW()",
        [sid]
      );

      callback(null, result.rows[0] ? result.rows[0].ses : null);
    } catch (error) {
      callback(error);
    }
  }

  async set(sid, ses, callback) {
    try {
      await this.ready;

      await pool.query(
        `
          INSERT INTO public.sesiones (sid, ses, expires)
          VALUES ($1, $2, $3)
          ON CONFLICT (sid)
          DO UPDATE SET
            ses = EXCLUDED.ses,
            expires = EXCLUDED.expires
        `,
        [sid, JSON.stringify(ses), this.getExpires(ses)]
      );

      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  async destroy(sid, callback) {
    try {
      await this.ready;
      await pool.query("DELETE FROM public.sesiones WHERE sid = $1", [sid]);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  async touch(sid, ses, callback) {
    try {
      await this.ready;

      if (!this.reinicioSesion()) {
        callback(null);
        return;
      }

      await pool.query(
        "UPDATE public.sesiones  SET expires = $2 WHERE sid = $1",
        [sid, this.getExpires(ses)]
      );

      callback(null);
    } catch (error) {
      callback(error);
    }
  }
}

module.exports = sesion;
