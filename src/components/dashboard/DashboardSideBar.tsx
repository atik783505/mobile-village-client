'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar } from "@heroui/react";
import { useSession, authClient } from "@/lib/auth-client";
import {
  LuLayoutDashboard, LuUsers, LuClipboardList,
  LuFolderTree, LuTag, LuMessageSquare, LuWarehouse,
  LuSettings, LuHistory, LuUser, LuShoppingBag,
  LuHeart, LuCircleX, LuMenu, LuLogOut, LuX
} from "react-icons/lu";
import toast from 'react-hot-toast';

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <Link href='/' onClick={onClick} className="flex items-center gap-2.5 group">
    <div className="p-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
      <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    <span className="font-bold text-lg" style={{ color: "var(--text-heading)" }}>
      Mobile<span className="text-emerald-500">Village</span>
    </span>
  </Link>
);

// User (Customer) এবং Admin-এর রুটম্যাপ
const navLinkMap = {
  user: [
    { name: "Overview / Account", href: "/account", icon: LuUser },
    { name: "Order History", href: "/account/orders", icon: LuShoppingBag },
    { name: "Wishlist & Reviews", href: "/account/wishlist", icon: LuHeart },
    { name: "Cancellation Requests", href: "/account/cancellations", icon: LuCircleX },
  ],
  admin: [
    { name: "Dashboard Overview", href: "/admin", icon: LuLayoutDashboard },
    { name: "Manage Products", href: "/dashboard/admin/manage-product", icon: LuClipboardList },
    { name: "Categories", href: "/admin/categories", icon: LuFolderTree },
    { name: "Orders & Fulfillment", href: "/admin/orders", icon: LuShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: LuUsers },
    { name: "Coupons", href: "/admin/coupons", icon: LuTag },
    { name: "Review Moderation", href: "/admin/reviews", icon: LuMessageSquare },
    { name: "Inventory & Stock", href: "/admin/inventory", icon: LuWarehouse },
    { name: "Transactions", href: "/admin/transactions", icon: LuHistory },
    { name: "Store Settings", href: "/admin/settings", icon: LuSettings },
  ]
};

function getFallbackText(name?: string | null) {
  if (!name) return "US";
  const words = name.trim().split(" ");
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function NavLinks({ items, pathname, onItemClick }: { items: any[]; pathname: string; onItemClick?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 w-full px-3">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer"
            style={
              isActive
                ? {
                    background: "rgba(16,185,129,0.12)",
                    color: "#10b981",
                    border: "1px solid rgba(16,185,129,0.2)",
                  }
                : {
                    color: "var(--text-secondary)",
                    border: "1px solid transparent",
                  }
            }
          >
            <Icon
              className="text-base shrink-0"
              style={{ color: isActive ? "#10b981" : "var(--text-muted)" }}
            />
            <span>{item.name}</span>
            {isActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function UserFooter({ user, onSignOut }: { user: any; onSignOut: () => void }) {
  return (
    <div className="px-3 pb-3 pt-4 mt-auto border-t" style={{ borderColor: "var(--border-color)" }}>
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-9 h-9 rounded-xl shrink-0" style={{ border: "2px solid rgba(16,185,129,0.4)" }}>
          {user?.image ? (
            <Avatar.Image src={user.image} className="object-cover" />
          ) : (
            <Avatar.Fallback className="text-xs font-bold text-emerald-500">
              {getFallbackText(user?.name)}
            </Avatar.Fallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-heading)" }}>
            {user?.name || "User"}
          </p>
          <p className="text-[11px] capitalize" style={{ color: "var(--text-muted)" }}>
            {user?.role || "user"}
          </p>
        </div>
        <button
          onClick={onSignOut}
          title="Sign out"
          className="p-1.5 rounded-lg transition-colors text-rose-400 hover:bg-rose-500/10 cursor-pointer"
        >
          <LuLogOut className="text-base" />
        </button>
      </div>
    </div>
  );
}

export function DashboardSidebar({ initialRole }: { initialRole: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const user = session?.user as { name?: string; image?: string; role?: string } | undefined;

  // URL পরিবর্তন হলেই মোবাইল সাইডবার বন্ধ হবে
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("Signed out successfully");
    window.location.href = "/";
  };

  // রোল অনুযায়ী মেনু নির্ধারণ (ডিফল্ট user)
  // Server থেকে আসা initialRole ব্যবহার করো — client session লোড হওয়ার আগেই সঠিক menu দেখাবে
  const roleKey = (user?.role ?? initialRole) === 'admin' ? 'admin' : 'user';
  const menuItems = navLinkMap[roleKey];

  return (
    <>
      {/* Mobile Topbar */}
      <div
        className="md:hidden fixed top-0 left-0 w-full h-14 px-4 flex items-center justify-between z-40 backdrop-blur-md"
        style={{
          background: "var(--navbar-bg)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <Logo />
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl transition-colors cursor-pointer"
          style={{ color: "var(--text-secondary)", background: "var(--bg-secondary)" }}
          aria-label="Open menu"
        >
          <LuMenu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          />

          <div 
            className="relative w-[270px] max-w-[80vw] h-full flex flex-col py-5 z-10 shadow-2xl transition-transform"
            style={{ background: "var(--bg-primary)", borderRight: "1px solid var(--border-color)" }}
          >
            <div className="flex items-center justify-between px-5 mb-6">
              <Logo onClick={() => setIsOpen(false)} />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg transition-colors cursor-pointer"
                style={{ color: "var(--text-muted)", background: "var(--bg-secondary)" }}
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>

            {user?.role && (
              <div className="px-5 mb-4">
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", color: "#10b981" }}
                >
                  {user.role} Panel
                </span>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              <NavLinks 
                items={menuItems} 
                pathname={pathname} 
                onItemClick={() => setIsOpen(false)} 
              />
            </div>

            {user && <UserFooter user={user} onSignOut={handleSignOut} />}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex w-64 flex-col h-screen sticky top-0 shrink-0"
        style={{
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
        }}
      >
        <div className="flex flex-col h-full py-5">
          <div className="px-4 mb-7">
            <Logo />
          </div>

          {user?.role && (
            <div className="px-4 mb-5">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.15)",
                  color: "#10b981",
                }}
              >
                {user.role} Panel
              </span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <NavLinks items={menuItems} pathname={pathname} />
          </div>

          {user && <UserFooter user={user} onSignOut={handleSignOut} />}
        </div>
      </aside>

      <div className="md:hidden h-14 w-full" />
    </>
  );
}
