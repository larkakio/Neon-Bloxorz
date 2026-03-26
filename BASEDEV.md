# Base.dev checklist (standard web app)

Complete these on [Base.dev](https://www.base.dev/) for your project (notifications are **not** required for this app):

1. **Primary URL** — `https://neon-bloxorz.vercel.app` (or your custom domain after you add it in Vercel). The app emits `<meta name="base:app_id" content="…" />` from [`web/src/app/layout.tsx`](web/src/app/layout.tsx) (override with `NEXT_PUBLIC_BASE_APP_ID`); deploy, then click **Verify & Add** in Base.dev.
2. **Name, icon, tagline, description** — match your product.
3. **Screenshots & category** — for discovery.
4. **Builder code** — copy the ERC-8021 hex suffix into `NEXT_PUBLIC_BUILDER_CODE_SUFFIX` so `checkIn` transactions are attributed (see [Builder Codes](https://docs.base.org/base-chain/builder-codes/builder-codes)).

## Pre-flight (from Base docs)

- Wallet + contract calls use **wagmi + viem**.
- Authentication uses **SIWE** where needed (`SignInWithEthereum` component).
- No Farcaster manifest required for the post–Apr 2026 Base App model.

## Verify attribution

- [Builder Code Validation](https://builder-code-checker.vercel.app/)
- Base.dev dashboard → onchain transaction counts for your app
