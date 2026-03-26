import type { Metadata, Viewport } from "next";
import { Orbitron, DM_Sans } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";

import { Providers } from "@/components/providers";
import { config } from "@/lib/wagmi";

import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://neon-bloxorz.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Bloxorz — Base",
  description: "Mobile Bloxorz-style puzzle on Base with daily onchain check-in.",
  icons: {
    icon: "/bloxorz-app-icon.png",
    apple: "/bloxorz-app-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#030712",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const initialState = cookieToInitialState(config, h.get("cookie") ?? undefined);

  return (
    <html lang="en" className={`${orbitron.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full bg-[#030712] font-sans text-zinc-100 antialiased">
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
