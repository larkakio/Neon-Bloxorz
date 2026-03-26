# Bloxorz × Base

- **Production:** [neon-bloxorz.vercel.app](https://neon-bloxorz.vercel.app)
- **`web/`** — Next.js app (wagmi + viem, SIWE, mobile-first UI, game, check-in).
- **`contracts/`** — Foundry `DailyCheckIn` (0.0000005 ETH fee). Run `forge install` per `contracts/README.md`.
- **`BASEDEV.md`** — Base.dev metadata checklist.
- **`.env.example`** — copy to `web/.env.local`.

## Vercel (fix “No Output Directory named public” / 404)

The repo is a **monorepo**: the Next.js app lives in **`web/`**. Do **not** put a root `vercel.json` that runs `cd web && …` — Vercel then treats the project like a static site and looks for a `public` output at the repo root.

1. Open **Vercel → your project → Settings → General**.
2. Set **Root Directory** to **`web`** (exactly this folder name).
3. **Framework Preset** should stay **Next.js** (auto-detected from `web/package.json`).
4. **Save**, then **Deployments → … → Redeploy** the latest `main` commit.

Add the same **`NEXT_PUBLIC_*`** env vars in **Vercel → Settings → Environment Variables** as in your local `web/.env.local`.

### Base.dev shows “Failed to fetch URL”

That almost always means the **production URL does not return your app** (often **HTTP 404**). Until `https://neon-bloxorz.vercel.app` opens the game in a browser, Base cannot read the `<meta name="base:app_id" …>` tag.

1. Confirm in the browser: the site should load **not** “404: NOT_FOUND”.
2. Fix **Root Directory = `web`** and redeploy (see above).
3. In Base.dev, use the full URL: **`https://neon-bloxorz.vercel.app`** (with `https://`).
4. Retry **Verify & Add** after a successful deploy.

```bash
cd web && npm install && npm run dev
```

```bash
cd web && npm run checkin:script   # needs PRIVATE_KEY + contract address
```
