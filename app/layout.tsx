import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoLoans.ca — Get Pre-Approved for a Car Loan in Canada",
  description:
    "Get approved for a car loan today. Bad credit, no credit, or bankruptcy — we work with 30+ lenders to get you behind the wheel. Fast approvals across all Canadian provinces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-[#FEFCF8] text-slate-900">
        {children}
      </body>
    </html>
  );
}
