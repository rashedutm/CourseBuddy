# Deploying CourseBuddy to Railway

This repo is already set up to deploy as a **single Railway service**: Railway
builds the React frontend and runs the Express backend, which serves the built
frontend *and* the `/api` routes from the same URL. Nobody needs to run two
separate services or fight CORS.

Anyone on the team can do this — you just need a Railway account and access to
push/admin this GitHub repo. Steps only a human can do (Railway has no CLI/API
access set up in this environment):

## 1. Create the project
1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. **New Project → Deploy from GitHub repo → `rashedutm/CourseBuddy`**.
3. Under the service's **Settings → Source**, set the deploy branch to `main`
   (so the live site always reflects everyone's merged work, not one person's
   branch).

Railway auto-detects Node via Nixpacks using the root `package.json`:
- `build` → installs both `backend/` and `frontend/`, builds the React app
- `start` → runs `backend/server.js`, which serves the build + API together

## 2. Add MySQL
1. In the same Railway project: **+ New → Database → Add MySQL**.
2. Railway generates its own connection variables (`MYSQLHOST`, `MYSQLUSER`,
   `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`). The backend code expects
   `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` / `DB_PORT` instead — map
   them in the **web service's** Variables tab using Railway's reference syntax:

   | Variable    | Value                        |
   |-------------|-------------------------------|
   | `DB_HOST`     | `${{MySQL.MYSQLHOST}}`      |
   | `DB_USER`     | `${{MySQL.MYSQLUSER}}`      |
   | `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}`  |
   | `DB_NAME`     | `${{MySQL.MYSQLDATABASE}}`  |
   | `DB_PORT`     | `${{MySQL.MYSQLPORT}}`      |
   | `NODE_ENV`    | `production`                 |
   | `JWT_SECRET`  | (any long random string)     |

   `PORT` is injected by Railway automatically — don't set it yourself.

3. Import the schema/seed data into the new MySQL instance (Railway's MySQL
   plugin has a **Connect** tab with a `mysql` CLI command, or use a GUI like
   TablePlus/MySQL Workbench with the credentials Railway shows you):
   ```
   mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQLDATABASE> < database/schema.sql
   ```
   (add any seed `.sql` files the same way — check `database/` for what's there).

## 3. Deploy
Railway deploys automatically once the service and variables are set, and
again on every push to `main`. Check the **Deployments** tab for build logs if
something doesn't come up.

## Why Railway over other hosts
The project's own proposal/SDD already names Railway as the hosting choice —
this keeps the deployed app consistent with what's documented and submitted,
rather than introducing a second, undocumented hosting decision.

## What to tell the team
Once live, share the Railway-provided URL (Settings → Networking → Generate
Domain) in the group chat. That URL is now the answer to "what has everyone
else built" — no need to pull branches just to look.
