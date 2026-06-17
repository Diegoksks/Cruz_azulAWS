const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_COOKIE_NAME = "cruz_azul_token";

const requiredEnv = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "MFA_SECRET",
  "JWT_SECRET"
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Faltan variables de entorno: ${missingEnv.join(", ")}`);
  process.exit(1);
}

const useSsl = String(process.env.DB_SSL).toLowerCase() === "true";
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function page(title, body) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    :root {
      color-scheme: light;
      --blue: #005aaa;
      --blue-dark: #003f78;
      --green: #00a651;
      --line: #d7dde5;
      --text: #15202b;
      --muted: #5b6876;
      --bg: #f5f7fa;
      --white: #ffffff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: Arial, Helvetica, sans-serif;
      background: linear-gradient(135deg, #f7fbff 0%, #edf5f0 100%);
      color: var(--text);
    }
    .shell {
      width: min(960px, calc(100% - 32px));
      margin: 0 auto;
      padding: 48px 0;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 28px;
    }
    .mark {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      border-radius: 8px;
      background: var(--blue);
      color: var(--white);
      font-size: 30px;
      font-weight: 700;
      line-height: 1;
    }
    h1 { margin: 0; font-size: 30px; }
    p { line-height: 1.5; }
    .panel {
      background: var(--white);
      border: 1px solid var(--line);
      border-radius: 8px;
      box-shadow: 0 18px 45px rgba(21, 32, 43, 0.08);
      padding: 28px;
    }
    .form {
      max-width: 440px;
    }
    label {
      display: block;
      margin: 16px 0 6px;
      font-weight: 700;
    }
    input {
      width: 100%;
      min-height: 44px;
      border: 1px solid #bac4d0;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 16px;
    }
    button, .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      margin-top: 20px;
      padding: 0 18px;
      border: 0;
      border-radius: 6px;
      background: var(--blue);
      color: var(--white);
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
    }
    button:hover, .button:hover { background: var(--blue-dark); }
    .alert {
      border-left: 4px solid #c62828;
      background: #fff1f1;
      padding: 12px;
      margin-bottom: 16px;
      color: #7f1d1d;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin: 24px 0;
    }
    .metric {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 16px;
      background: #fbfcfe;
      min-width: 0;
    }
    .metric strong {
      display: block;
      margin-bottom: 8px;
      color: var(--muted);
      font-size: 13px;
      text-transform: uppercase;
    }
    code {
      display: block;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      background: #eef3f8;
      padding: 12px;
      border-radius: 6px;
      font-size: 13px;
    }
    .ok { color: var(--green); font-weight: 700; }
    .actions { display: flex; gap: 12px; flex-wrap: wrap; }
  </style>
</head>
<body>
  <main class="shell">
    <div class="brand">
      <div class="mark">+</div>
      <div>
        <h1>Farmacias Cruz Azul ERP</h1>
        <p>Portal seguro con JWT, MFA TOTP y RDS PostgreSQL.</p>
      </div>
    </div>
    ${body}
  </main>
</body>
</html>`;
}

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      email VARCHAR(120) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      mfa_secret TEXT NOT NULL,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const adminResult = await pool.query("SELECT id FROM usuarios WHERE email = $1", [
    process.env.ADMIN_EMAIL
  ]);

  if (adminResult.rowCount === 0) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await pool.query(
      "INSERT INTO usuarios (email, password_hash, mfa_secret) VALUES ($1, $2, $3)",
      [process.env.ADMIN_EMAIL, passwordHash, process.env.MFA_SECRET]
    );
    console.log(`Usuario administrador inicial creado: ${process.env.ADMIN_EMAIL}`);
  } else {
    console.log(`Usuario administrador ya existe: ${process.env.ADMIN_EMAIL}`);
  }
}

function requireAuth(req, res, next) {
  const token = req.cookies[JWT_COOKIE_NAME];
  if (!token) {
    return res.redirect("/login");
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    req.token = token;
    return next();
  } catch (error) {
    res.clearCookie(JWT_COOKIE_NAME);
    return res.redirect("/login");
  }
}

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  const error = req.query.error
    ? '<div class="alert">Credenciales o codigo MFA invalidos.</div>'
    : "";

  res.send(page("Login | Cruz Azul ERP", `
    <section class="panel form">
      ${error}
      <form method="post" action="/login">
        <label for="email">Correo</label>
        <input id="email" name="email" type="email" autocomplete="username" required>

        <label for="password">Contrasena</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required>

        <label for="mfa">Codigo MFA TOTP</label>
        <input id="mfa" name="mfa" type="text" inputmode="numeric" pattern="[0-9]{6}" autocomplete="one-time-code" required>

        <button type="submit">Ingresar</button>
      </form>
    </section>
  `));
});

app.post("/login", async (req, res) => {
  const { email, password, mfa } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.redirect("/login?error=1");
    }

    const passwordOk = await bcrypt.compare(password, user.password_hash);
    const mfaOk = speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: "base32",
      token: mfa,
      window: 1
    });

    if (!passwordOk || !mfaOk) {
      return res.redirect("/login?error=1");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000
    });

    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Error en login:", error);
    return res.redirect("/login?error=1");
  }
});

app.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const nowResult = await pool.query("SELECT NOW() AS now");
    const dbNow = nowResult.rows[0].now;

    res.send(page("Dashboard | Cruz Azul ERP", `
      <section class="panel">
        <h2>Dashboard protegido</h2>
        <div class="grid">
          <div class="metric">
            <strong>Usuario autenticado</strong>
            <span>${req.user.email}</span>
          </div>
          <div class="metric">
            <strong>Conexion RDS PostgreSQL</strong>
            <span class="ok">OK</span>
          </div>
          <div class="metric">
            <strong>SELECT NOW()</strong>
            <span>${dbNow}</span>
          </div>
        </div>

        <h3>Token JWT activo</h3>
        <code>${req.token}</code>

        <div class="actions">
          <a class="button" href="/logout">Cerrar sesion</a>
        </div>
      </section>
    `));
  } catch (error) {
    console.error("Error cargando dashboard:", error);
    res.status(500).send(page("Error | Cruz Azul ERP", `
      <section class="panel">
        <h2>Error de conexion</h2>
        <p>No fue posible consultar RDS PostgreSQL.</p>
        <a class="button" href="/logout">Volver al login</a>
      </section>
    `));
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME);
  res.redirect("/login");
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Cruz Azul ERP escuchando en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("No fue posible inicializar la base de datos:", error);
    process.exit(1);
  });
