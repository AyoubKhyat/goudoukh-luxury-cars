"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Calendar,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cars", label: "Cars", icon: Car },
  { href: "/admin/reservations", label: "Reservations", icon: Calendar },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="font-bebas text-xl tracking-widest text-white">
            GOUDOUKH
          </span>
          <span className="rounded bg-[#ff5c00] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-white/5 text-[#ff5c00] border-l-2 border-[#ff5c00]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"
        >
          <LogOut className="h-4.5 w-4.5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-[#0a0a0a] p-2.5 text-white shadow-lg lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0a0a0a] transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] bg-[#0a0a0a] lg:block">
        {sidebarContent}
      </aside>
    </>
  );
}
