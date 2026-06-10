import type { Metadata } from "next";
import { Inter, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const headlineFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const labelFont = Inter({
  subsets: ["latin"],
  variable: "--font-label",
});

export const metadata: Metadata = {
  title: "Pearl Labs 3D Print — Instant Quotes & Precision Printing",
  description:
    "Upload your STL file, get an instant quotation, and confirm your print with a 50% deposit. Professional 3D printing in Kampala.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${headlineFont.variable} ${bodyFont.variable} ${labelFont.variable}`}>{children}</body>
    </html>
  );
}
