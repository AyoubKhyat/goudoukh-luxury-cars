"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />
      <main className="flex-1 ml-0 lg:ml-[260px] min-h-screen">
        <div className="p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
