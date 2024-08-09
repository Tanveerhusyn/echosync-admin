import Providers from "@/components/layout/providers";
import AuthWrapper from "@/components/custom/AuthWrapper";
import { Toaster } from "react-hot-toast";

import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Echosync AI",
  description: "AI-powered business intelligence for the modern entrepreneur",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <AuthWrapper session={session}>
          <Providers session={session}>
            <Toaster />
            {children}
          </Providers>
        </AuthWrapper>
      </body>
    </html>
  );
}
