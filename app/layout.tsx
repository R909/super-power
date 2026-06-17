import type { Metadata } from "next";
import { Nunito, Plus_Jakarta_Sans } from "next/font/google";
import ScrollReveal from "@/app/components/ScrollReveal";
import "./globals.css";
import { QueryProvider } from "./components/providers/query-provider";
import Sidebar from "./components/sidebar";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Super-Power — AI Email & Calendar OS",
  description:
    "Connect Gmail and Google Calendar. Let Super-Power schedule meetings, triage your inbox, and draft replies.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryProvider>
    <html lang="en" className={`${nunito.variable} ${jakarta.variable}`}>
      <body>
        <div className="flex">
          <Sidebar />
          {children}
        </div>
        <ScrollReveal />
      </body>
    </html>
    </QueryProvider>
  );
}

