"use client";

import { useState } from "react";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import { useConnection, usePublicClient, useSignMessage } from "wagmi";

export function SignInWithEthereum() {
  const { address, chainId, isConnected } = useConnection();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [verified, setVerified] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { signMessageAsync } = useSignMessage();
  const publicClient = usePublicClient();

  async function handleSignIn() {
    if (!isConnected || !address || !chainId || !publicClient) {
      setErr("Connect your wallet first");
      return;
    }
    setIsSigningIn(true);
    setErr(null);
    const nonce = generateSiweNonce();
    try {
      const message = createSiweMessage({
        address,
        chainId,
        domain: typeof window !== "undefined" ? window.location.host : "",
        nonce,
        uri: typeof window !== "undefined" ? window.location.origin : "",
        version: "1",
      });
      const signature = await signMessageAsync({ message });
      const valid = await publicClient.verifySiweMessage({ message, signature });
      if (!valid) throw new Error("SIWE verification failed");
      setVerified(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-in failed");
      setVerified(false);
    } finally {
      setIsSigningIn(false);
    }
  }

  if (!isConnected) return null;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleSignIn}
        disabled={isSigningIn || verified}
        className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-100/90 shadow-[0_0_20px_rgba(34,211,238,0.15)] disabled:opacity-50"
      >
        {verified
          ? "Signed in (SIWE)"
          : isSigningIn
            ? "Signing…"
            : "Sign in with Ethereum"}
      </button>
      {err ? <p className="text-xs text-rose-400/90">{err}</p> : null}
    </div>
  );
}
