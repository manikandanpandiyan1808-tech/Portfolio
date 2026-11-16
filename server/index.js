import "dotenv/config";
import express from "express";
import { createHmac, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataFile = path.join(root, "data", "portfolio.json");
const backupFile = path.join(root, "data", "portfolio.backup.json");
const distDir = path.join(root, "dist");

const PORT = Number(process.env.PORT) || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_SECRET =
  process.env.ADMIN_SECRET || "dev-only-secret-change-before-deploying";
const TOKEN_TTL = 1000 * 60 * 60 * 12;

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use((request, response, next) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "same-origin");
  next();
});

/* ---------------------------------------------------------------- auth */

function sign(payload) {
  return createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
}

function createToken() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + TOKEN_TTL })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token) {
  if (!token || !token.includes(".")) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length) return false;
  if (!timingSafeEqual(expected, actual)) return false;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof parsed.exp === "number" && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAuth(request, response, next) {
  const header = request.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!verifyToken(token)) {
    return response.status(401).json({ error: "Your session has expired. Please sign in again." });
  }
  return next();
}

const loginAttempts = new Map();
const MAX_ATTEMPTS = 8;
const ATTEMPT_WINDOW = 1000 * 60 * 10;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) return false;
  if (now - entry.first > ATTEMPT_WINDOW) {
    loginAttempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now - entry.first > ATTEMPT_WINDOW) {
    loginAttempts.set(ip, { first: now, count: 1 });
  } else {
    entry.count += 1;
  }
}

/* ------------------------------------------------------------- storage */

async function readPortfolio() {
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw);
}

async function writePortfolio(data) {
  try {
    const current = await fs.readFile(dataFile, "utf8");
    await fs.writeFile(backupFile, current, "utf8");
  } catch {
    // No previous file to back up.
  }

  const temporary = `${dataFile}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await fs.rename(temporary, dataFile);
}

/* ---------------------------------------------------------- validation */

const MAX_ITEMS = 60;
const ACCENTS = new Set(["violet", "cyan", "amber"]);
const ICONS = new Set([
  "layout",
  "server",
  "database",
  "wrench",
  "code",
  "cloud",
  "shield",
  "palette",
  "rocket",
  "sparkles",
]);

function text(value, max = 600) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function textArray(value, { maxItems = 30, maxLength = 160 } = {}) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function url(value, max = 400) {
  const cleaned = text(value, max);
  if (!cleaned) return "";
  if (/^(https?:\/\/|mailto:|\/)/i.test(cleaned)) return cleaned;
  return "";
}

function list(value) {
  return Array.isArray(value) ? value.slice(0, MAX_ITEMS) : [];
}

function normalizePortfolio(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Invalid portfolio payload");
  }

  const profile = input.profile ?? {};
  const about = input.about ?? {};
  const currently = about.currently ?? {};
  const learning = about.learning ?? {};

  return {
    profile: {
      name: text(profile.name, 80) || "Your Name",
      role: text(profile.role, 80) || "Full Stack Developer",
      email: text(profile.email, 160),
      github: url(profile.github),
      linkedin: url(profile.linkedin),
      location: text(profile.location, 100),
      availability: text(profile.availability, 120),
      resume: url(profile.resume),
      heroLead: text(profile.heroLead, 600),
    },
    stats: list(input.stats)
      .map((stat) => ({
        value: text(stat?.value, 24),
        label: text(stat?.label, 60),
      }))
      .filter((stat) => stat.value || stat.label),
    marqueeItems: textArray(input.marqueeItems, {
      maxItems: 40,
      maxLength: 60,
    }),
    about: {
      lead: text(about.lead, 600),
      body: text(about.body, 900),
      highlights: textArray(about.highlights, {
        maxItems: 12,
        maxLength: 160,
      }),
      currently: {
        title: text(currently.title, 120),
        description: text(currently.description, 400),
        pills: textArray(currently.pills, { maxItems: 12, maxLength: 40 }),
      },
      learning: {
        title: text(learning.title, 120),
        description: text(learning.description, 400),
      },
    },
    skills: list(input.skills)
      .map((skill) => ({
        title: text(skill?.title, 80),
        icon: ICONS.has(skill?.icon) ? skill.icon : "layout",
        description: text(skill?.description, 300),
        items: textArray(skill?.items, { maxItems: 30, maxLength: 60 }),
      }))
      .filter((skill) => skill.title),
    projects: list(input.projects)
      .map((project) => ({
        number: text(project?.number, 12),
        title: text(project?.title, 120),
        type: text(project?.type, 100),
        description: text(project?.description, 700),
        highlights: textArray(project?.highlights, {
          maxItems: 10,
          maxLength: 100,
        }),
        tech: textArray(project?.tech, { maxItems: 16, maxLength: 50 }),
        github: url(project?.github),
        demo: url(project?.demo),
        accent: ACCENTS.has(project?.accent) ? project.accent : "violet",
        domain: text(project?.domain, 120),
      }))
      .filter((project) => project.title),
    experience: list(input.experience)
      .map((entry) => ({
        date: text(entry?.date, 60),
        meta: text(entry?.meta, 80),
        title: text(entry?.title, 120),
        org: text(entry?.org, 120),
        description: text(entry?.description, 700),
        tags: textArray(entry?.tags, { maxItems: 12, maxLength: 50 }),
      }))
      .filter((entry) => entry.title),
  };
}

/* -------------------------------------------------------------- events */

const clients = new Set();

function broadcastUpdate() {
  for (const client of clients) {
    client.write("data: updated\n\n");
  }
}

app.get("/api/events", (request, response) => {
  response.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  response.write("retry: 3000\n\n");
  response.write(": connected\n\n");
  clients.add(response);

  const heartbeat = setInterval(() => {
    response.write(": ping\n\n");
  }, 25000);

  request.on("close", () => {
    clearInterval(heartbeat);
    clients.delete(response);
  });
});

/* ---------------------------------------------------------------- api */

app.get("/api/health", (request, response) => {
  response.json({ ok: true });
});

app.get("/api/portfolio", async (request, response) => {
  try {
    response.setHeader("Cache-Control", "no-store");
    response.json(await readPortfolio());
  } catch (error) {
    console.error("[api] Could not read portfolio data:", error);
    response.status(500).json({ error: "Could not read portfolio data." });
  }
});

app.post("/api/admin/login", (request, response) => {
  const ip = request.ip || "unknown";

  if (isRateLimited(ip)) {
    return response.status(429).json({
      error: "Too many attempts. Try again in a few minutes.",
    });
  }

  const password = text(request.body?.password, 200);
  if (!password || password !== ADMIN_PASSWORD) {
    recordFailure(ip);
    return response.status(401).json({ error: "Incorrect password." });
  }

  loginAttempts.delete(ip);
  return response.json({ token: createToken(), expiresIn: TOKEN_TTL });
});

app.get("/api/admin/session", requireAuth, (request, response) => {
  response.json({ ok: true });
});

app.put("/api/portfolio", requireAuth, async (request, response) => {
  try {
    const normalized = normalizePortfolio(request.body);
    await writePortfolio(normalized);
    broadcastUpdate();
    response.json(normalized);
  } catch (error) {
    console.error("[api] Could not save portfolio data:", error);
    response.status(400).json({
      error: error instanceof Error ? error.message : "Could not save changes.",
    });
  }
});

app.use("/api", (request, response) => {
  response.status(404).json({ error: "Not found" });
});

/* ------------------------------------------------------------- frontend */

if (existsSync(path.join(distDir, "index.html"))) {
  app.use(express.static(distDir, { index: false }));
  app.get("*", (request, response) => {
    response.sendFile(path.join(distDir, "index.html"));
  });
}

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error);
  console.error("[server]", error);
  response.status(500).json({ error: "Unexpected server error." });
});

const server = app.listen(PORT, () => {
  console.log(`[api] Portfolio API running at http://localhost:${PORT}`);

  if (ADMIN_PASSWORD === "admin123") {
    console.warn(
      "[api] Using the default admin password. Set ADMIN_PASSWORD before deploying."
    );
  }
  if (ADMIN_SECRET.startsWith("dev-only")) {
    console.warn(
      "[api] Using the default token secret. Set ADMIN_SECRET before deploying."
    );
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `[api] Port ${PORT} is already in use. Stop the other server (for example, "npm run dev") or set a different PORT.`
    );
    process.exit(1);
  }

  console.error("[api] Server error:", error);
  process.exit(1);
});
