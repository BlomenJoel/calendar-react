import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from './context/next-auth-provider';
import "./globals.css";
import "./test.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amazing calendar",
  description: "Created by yours truly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
        <body className={inter.className}>
        <NextAuthProvider>
          {children}
          </NextAuthProvider>
        </body>
    </html>
  );
}
