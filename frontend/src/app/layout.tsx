import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";
import { AUTH_COOKIE_NAME } from "@/constants/auth.constant";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RSA Digital Signature",
  description: "Ứng dụng chữ ký số RSA với SHA256",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get(AUTH_COOKIE_NAME)?.value !== undefined;
  console.log("isAuthenticated", isAuthenticated);
  console.log("cookieStore", cookieStore.get(AUTH_COOKIE_NAME));

  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Navigation isAuth={isAuthenticated} />
          {children}
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
