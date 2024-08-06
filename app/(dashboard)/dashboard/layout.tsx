"use client";
import React, { useState } from "react";
import Header from "@/components/layout/header";
import Providers from "@/components/layout/providers";
import Sidebar from "@/components/layout/sidebar";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const session = {};

  return (
    <Providers session={session}>
      <div className="flex flex-col h-screen">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} />
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
