import type React from "react";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          menuOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
