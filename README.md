# Bloxorz × Base

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
