import { type Address, parseEther } from "viem";

/** Must match contracts/src/CheckIn.sol */
export const CHECK_IN_FEE_WEI = parseEther("0.0000005");

export const checkInAbi = [
  {
    type: "function",
    name: "checkIn",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "CHECK_IN_FEE",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lastCheckDay",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "streak",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CheckedIn",
    inputs: [
      { name: "user", type: "address", indexed: true, internalType: "address" },
      { name: "dayIndex", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "newStreak", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
] as const;

export function getCheckInAddress(): Address | undefined {
  const raw = process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS;
  if (!raw || raw === "0x") return undefined;
  return raw as Address;
}

/** Hex from Base.dev → Settings → Builder Code (ERC-8021 suffix). */
export function getBuilderDataSuffix(): `0x${string}` | undefined {
  const raw = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX;
  if (!raw || raw === "0x") return undefined;
  return raw as `0x${string}`;
}
