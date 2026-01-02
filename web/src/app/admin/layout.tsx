"use client";
import "./admin.css";
import { SessionProvider } from "next-auth/react";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminHeader from "@/src/components/admin/AdminHeader";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Force dark mode for admin section and prevent style conflicts
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return (
    <SessionProvider>
      <Toaster position="top-right" />
      <div className="admin-layout min-h-screen bg-black">
        <div className="flex h-screen overflow-hidden bg-black">
          <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            
            <main className="flex-1">
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
