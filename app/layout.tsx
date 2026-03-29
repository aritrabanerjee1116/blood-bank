import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BloodLink — Blood Bank Management System",
  description:
    "A comprehensive blood bank management platform for donors, hospitals, and administrators. Track blood inventory, manage donations, and respond to emergency needs.",
  keywords: [
    "blood bank",
    "blood donation",
    "hospital",
    "donor",
    "blood inventory",
    "emergency blood",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
