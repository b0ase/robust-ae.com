import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Mono } from "next/font/google";
import "./globals.css";
// import Providers from "./providers"; // Ensure this import is removed or commented out

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "Robust AE - Automation & Embedded Systems",
  description: "Robust AE Ltd offers expert embedded systems development, industrial automation solutions, and prototyping services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Ensure no Provider wrapper here */}
      <body className={`${geistSans.variable} ${geistMono.variable} ${robotoMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
