import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IND Productie Portaal",
  description: "Dagelijkse productieregistratie voor medewerkers en admin-analyse",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
