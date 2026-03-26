# Bloxorz × Base

- **Production:** [neon-bloxorz.vercel.app](https://neon-bloxorz.vercel.app) — root [`vercel.json`](vercel.json) runs `npm ci` / `npm run build` inside `web/`. If the dashboard still shows 404, open **Vercel → Project → Settings → General → Root Directory** and set it to **`web`**, then redeploy (both approaches should not be conflicting; prefer **Root Directory = `web`** and you can delete root `vercel.json` if Vercel duplicates steps).
- **`web/`** — Next.js app (wagmi + viem, SIWE, mobile-first UI, game, check-in).
- **`contracts/`** — Foundry `DailyCheckIn` (0.0000005 ETH fee). Run `forge install` per `contracts/README.md`.
- **`BASEDEV.md`** — Base.dev metadata checklist.
- **`.env.example`** — copy to `web/.env.local`.

```bash
cd web && npm install && npm run dev
```

```bash
cd web && npm run checkin:script   # needs PRIVATE_KEY + contract address
```
