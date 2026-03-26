/**
 * Run daily check-in from a funded private key (local / CI).
 * Usage: PRIVATE_KEY=0x... NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS=0x... npx tsx scripts/checkin.ts
 */
import "dotenv/config";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, baseSepolia } from "viem/chains";

const CHECK_IN_FEE_WEI = parseEther("0.0000005");

const abi = [
  {
    type: "function",
    name: "checkIn",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
] as const;

async function main() {
  const pk = process.env.PRIVATE_KEY as `0x${string}` | undefined;
  const addr = process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS as `0x${string}` | undefined;
  const suffix = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX as `0x${string}` | undefined;
  const rpc = process.env.RPC_URL;
  const chainId = process.env.CHAIN_ID;

  if (!pk) throw new Error("PRIVATE_KEY required");
  if (!addr) throw new Error("NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS required");

  const chain =
    chainId === "8453" ? base : chainId === "84532" ? baseSepolia : baseSepolia;
  const transport = http(rpc ?? (chain.id === baseSepolia.id ? "https://sepolia.base.org" : "https://mainnet.base.org"));

  const account = privateKeyToAccount(pk);
  const client = createWalletClient({
    account,
    chain,
    transport,
  });

  const hash = await client.writeContract({
    address: addr,
    abi,
    functionName: "checkIn",
    value: CHECK_IN_FEE_WEI,
    ...(suffix ? { dataSuffix: suffix } : {}),
  });

  console.log("checkIn tx:", hash);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
