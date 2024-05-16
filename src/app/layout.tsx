"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProductsProvider } from "./context/GetProducts";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Real Food Store",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <link rel="shortcut icon" href="https://i.postimg.cc/RFdx6dmV/favicon-logo.png" type="image/x-icon" />
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} h-full bg-slate-100 dark:bg-slate-950`}
      >
        <ProductsProvider>{children}</ProductsProvider>
      </body>
    </html>
  );
}
