import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoLoans.ca — Get Pre-Approved for a Car Loan in Canada",
  description:
    "Get approved for a car loan today. Bad credit, no credit, or bankruptcy — we work with 30+ lenders to get you behind the wheel. Fast approvals across all Canadian provinces.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${playfair.variable} h-full`}>
      <body className="h-full overflow-hidden bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
