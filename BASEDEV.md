# Base.dev checklist (standard web app)

Complete these on [Base.dev](https://www.base.dev/) for your project (notifications are **not** required for this app):

1. **Primary URL** — production URL where the Next.js app is hosted.
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
