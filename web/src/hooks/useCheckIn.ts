"use client";

import { useCallback, useMemo } from "react";
import { useConnection, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import {
  CHECK_IN_FEE_WEI,
  checkInAbi,
  getBuilderDataSuffix,
  getCheckInAddress,
} from "@/lib/checkInContract";

export function useCheckIn() {
  const { address, isConnected } = useConnection();
  const contract = getCheckInAddress();
  const suffix = getBuilderDataSuffix();

  const { data: lastCheckDay, refetch: refetchDay } = useReadContract({
    address: contract,
    abi: checkInAbi,
    functionName: "lastCheckDay",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(contract && address) },
  });

  const { data: streak, refetch: refetchStreak } = useReadContract({
    address: contract,
    abi: checkInAbi,
    functionName: "streak",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(contract && address) },
  });

  const { writeContractAsync, isPending, error, reset } = useWriteContract();
  const publicClient = usePublicClient();

  const canCheckInToday = useMemo(() => {
    if (lastCheckDay === undefined) return undefined;
    const day = BigInt(Math.floor(Date.now() / 1000 / 86400));
    return lastCheckDay < day;
  }, [lastCheckDay]);

  const checkIn = useCallback(async () => {
    if (!contract || !address) throw new Error("Wallet or contract not configured");
    const hash = await writeContractAsync({
      address: contract,
      abi: checkInAbi,
      functionName: "checkIn",
      value: CHECK_IN_FEE_WEI,
      ...(suffix ? { dataSuffix: suffix } : {}),
    });
    if (publicClient) {
      await publicClient.waitForTransactionReceipt({ hash });
    }
    await refetchDay();
    await refetchStreak();
    return hash;
  }, [address, contract, publicClient, refetchDay, refetchStreak, suffix, writeContractAsync]);

  return {
    contractConfigured: Boolean(contract),
    suffixConfigured: Boolean(suffix),
    isConnected,
    address,
    lastCheckDay,
    streak,
    canCheckInToday,
    checkIn,
    isPending,
    error,
    reset,
    feeWei: CHECK_IN_FEE_WEI,
  };
}
