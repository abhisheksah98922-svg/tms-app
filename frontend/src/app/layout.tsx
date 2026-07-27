import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "Enterprise Transport Management System (TMS)",
  description: "End-to-end Fleet, Logistics, Trip P&L, and GST Billing Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-50">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
