import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import GlobalProviders from "@/components/GlobalProviders";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["italic", "normal"],
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Moms&Pops — Preserve the voices you love",
  description:
    "A digital heirloom. Preserve the voices, memories, and presence of those you love through emotionally intelligent AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-primary bg-header">
        <AuthProvider>
          <GlobalProviders>{children}</GlobalProviders>
        </AuthProvider>
      </body>
    </html>
  );
}