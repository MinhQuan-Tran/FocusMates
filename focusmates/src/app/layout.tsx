import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./header/page"; // import your header
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "FocusMates",
  description: "Find your perfect study buddy."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* This wrapper ensures layout stretches full screen */}
        <div className="bg-focusmate h-screen w-full flex flex-col">
          <AuthProvider>
            <Header />
            <main className="bg-focusmate h-full overflow-hidden bg-cover bg-center bg-fixed flex-1">{children}</main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
