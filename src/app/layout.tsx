import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CookMark - Clean Recipes, Zero Bloat",
  description: "Convert recipe websites to clean Markdown instantly. No ads, no stories, just ingredients and instructions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
