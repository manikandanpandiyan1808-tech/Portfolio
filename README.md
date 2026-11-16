# Manikandan Portfolio

A dynamic, responsive full stack portfolio built with React, Vite, Framer Motion, Lucide React, and a small Node/Express content API. All content is editable from a password-protected admin dashboard.

## Features

- Dark aurora-inspired design with a fine grid and film-grain texture
- Animated hero, scroll reveals, and pointer-following spotlight cards
- Sticky navbar with active-section tracking and scroll progress
- Responsive mobile navigation with Escape-to-close
- Project cards with CSS dashboard previews
- Copy-email button and a mailto contact form
- Accessible focus states, skip link, and reduced-motion support
- SEO meta tags, Open Graph tags, and an inline SVG favicon
- **Admin dashboard at `/admin`** for editing every section
- **Persistent JSON storage** in `data/portfolio.json`
- **Live updates** — saving in the admin pushes changes to open portfolio tabs over Server-Sent Events

## Setup

1. Install Node.js (LTS) from https://nodejs.org
2. Open the project folder in a terminal and run:

```bash
npm install
npm run dev
```

This starts both the API (`http://localhost:4000`) and Vite (`http://localhost:5173`).

- Portfolio: http://localhost:5173
- Admin: http://localhost:5173/admin

### Admin password

The local development password is:

```text
admin123
```

Set a real password before deploying. Copy `.env.example` to `.env` and change:

```env
ADMIN_PASSWORD=your-strong-password
ADMIN_SECRET=a-long-random-string
PORT=4000
```

`ADMIN_SECRET` signs the admin session token. Changing it signs everyone out.

## Using the admin dashboard

Sign in at `/admin`, pick a section from the sidebar, edit the fields, then press **Save changes** (or `Ctrl/Cmd + S`).

You can add, remove, and reorder:

- Hero stats
- Technology-strip items
- Skill cards and their technologies
- Projects (including links, highlights, and preview accent)
- Experience entries

Every save:

1. Validates and normalises the content on the server
2. Backs up the previous file to `data/portfolio.backup.json`
3. Writes `data/portfolio.json` atomically
4. Broadcasts an update so open portfolio tabs refresh their data instantly

If a save fails, the dashboard shows an error toast and keeps your edits so you can retry.

## Build and run for production

```bash
npm run build
npm start
```

The Express server serves the built site from `dist/` and the API on `PORT` (default `4000`). Open `http://localhost:4000` and `http://localhost:4000/admin`.

> **Important:** The admin dashboard and live updates need the Node server. A static-only deploy of `dist/` will display the last built snapshot, but editing will not work.

Deploy the whole project to a Node host such as Render, Railway, Fly.io, or a VPS. Set `ADMIN_PASSWORD` and `ADMIN_SECRET` in the host's environment variables. For static hosts (Netlify, Vercel, GitHub Pages), you would need to replace the API with a hosted database or serverless functions.

## Content storage

All content lives in [`data/portfolio.json`](data/portfolio.json). The admin writes to this file, and the site falls back to the bundled copy if the API is unavailable.

```json
{
  "profile": {},
  "stats": [],
  "marqueeItems": [],
  "about": {},
  "skills": [],
  "projects": [],
  "experience": []
}
```

You can still edit the JSON by hand while the server is stopped. Keep a valid JSON shape and the API will validate it on the next save.

> The JSON store lives on the server's filesystem. On hosts with ephemeral disks, edits reset on redeploy. Use a persistent volume, or swap the storage layer for a database for a production deployment.

## Project structure

```
data/
  portfolio.json      Live portfolio content
server/
  index.js            Express API, auth, validation, SSE, static serving
src/
  admin/              Admin dashboard, login, editors, and styles
  components/         Shared UI (navbar, footer, section heading, cards, marquee)
  data/               Default data loader, icon map, and live-data provider
  hooks/              Scroll spy and clipboard helpers
  sections/           Page sections (hero, about, skills, projects, experience, contact)
  App.jsx             Page composition
  main.jsx            React entry point and admin/portfolio routing
  styles.css          Design system and responsive styles
```

## API

| Method | Route                 | Auth   | Purpose                          |
| ------ | --------------------- | ------ | -------------------------------- |
| GET    | `/api/portfolio`      | Public | Read current content             |
| PUT    | `/api/portfolio`      | Bearer | Validate and save content        |
| POST   | `/api/admin/login`    | Public | Exchange password for a token    |
| GET    | `/api/admin/session`  | Bearer | Check whether a token is valid   |
| GET    | `/api/events`         | Public | SSE stream of content updates    |
| GET    | `/api/health`         | Public | Health check                     |
