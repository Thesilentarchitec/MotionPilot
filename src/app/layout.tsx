import type { Metadata } from "next";
import { DM_Mono, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "MotionPilot",
  description: "Automated AI Content Autopilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmMono.variable} ${dmSerifDisplay.variable} font-mono bg-black text-white antialiased flex`}
      >
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
