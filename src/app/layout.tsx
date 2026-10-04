import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "IND Productie Portaal",
  description: "Dagelijkse productieregistratie voor medewerkers en admin-analyse",
  icons: {
    icon: "/ind-logo.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body className={`${sourceSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
