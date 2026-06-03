const session = require("express-session");
const pool = require("./database");

class sesion extends session.Store {
  constructor() {
    super();
    this.ready = this.init();
  }

  async init() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.sesiones (
        sid VARCHAR(255) PRIMARY KEY,
        ses JSONB NOT NULL,
        expires TIMESTAMPTZ NOT NULL
      )
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
