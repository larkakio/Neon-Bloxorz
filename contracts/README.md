# DailyCheckIn (Foundry)

## Build & test

```bash
cd contracts
forge build
forge test
```

## Deploy to Base mainnet (you run locally)

**Never commit private keys.** If a key ever appeared in a file or chat, treat it as compromised.

Use a funded deployer wallet on Base (chain id `8453`).

1. Ensure `forge` is on your `PATH` (e.g. `export PATH="$HOME/.foundry/bin:$PATH"`).

2. Copy env template:

   ```bash
   cp .env.example .env
   ```

3. In `.env`, set `BASE_RPC_URL` (e.g. `https://mainnet.base.org`).

4. Export the deployer key **only in your terminal** (not in git):

   ```bash
   export BASE_RPC_URL=https://mainnet.base.org
   export PRIVATE_KEY=0xYOUR_KEY_HERE
   ```

5. Deploy — **`--private-key` is required** for real broadcast (otherwise Foundry uses the default sender and refuses to broadcast):

   ```bash
   forge script script/Deploy.s.sol:Deploy \
     --rpc-url "$BASE_RPC_URL" \
     --broadcast \
     --private-key "$PRIVATE_KEY" \
     -vvv
   ```

   Or: `--interactive` to paste the key in a prompt (still keep it out of shell history if possible).

6. From the output, copy the **DailyCheckIn** contract address into `web/.env.local`:

   ```bash
   NEXT_PUBLIC_CHAIN_ID=8453
   NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS=0x...
   ```

7. Restart `npm run dev` in `web/`.

## Troubleshooting

- **`forge: command not found`** — add Foundry to `PATH`: `export PATH="$HOME/.foundry/bin:$PATH"`.
- **`You seem to be using Foundry's default sender`** — add `--private-key "$PRIVATE_KEY"` (or `--interactive`) to the `forge script` command.

## Base Sepolia (testnet)

Use `--rpc-url https://sepolia.base.org` and fund the wallet with [Base Sepolia ETH](https://docs.base.org/base-chain/network-information/network-faucets).
