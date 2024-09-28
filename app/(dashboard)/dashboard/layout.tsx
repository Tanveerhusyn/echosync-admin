"use client";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import React, { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const session = {};

  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
