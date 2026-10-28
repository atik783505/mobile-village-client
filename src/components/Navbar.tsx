'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ChevronDown, LayoutDashboard, User as UserIcon, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useSession, authClient } from '@/lib/auth-client';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, Dropdown } from "@heroui/react";

function getFallbackText(name?: string | null) {
  if (!name) return "US";
  const words = name.trim().split(" ");
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  
  const user = session?.user as (NonNullable<typeof session>["user"] & { role?: string }) | undefined;
  const router = useRouter();
  const pathname = usePathname();

  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (isDashboardRoute) {
    return null;
  }

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/signin');
        },
      },
    });
  };

  const dashboardHref = '/dashboard';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 group">
          <Image src='/assets/mobile_village.jfif' alt="Logo" width={40} height={40} className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/50 transition-all" />
          <span className="font-bold text-xl tracking-tight text-gray-900">
            Mobile<span className="text-emerald-600">Village</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/shop" className="hover:text-black transition-colors py-2">Shop</Link>
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-black py-2 transition-colors">
            <span>Categories</span>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
          </div>
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-black py-2 transition-colors">
            <span>Quick Links</span>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <Link href="/cart" className="relative p-2.5 text-gray-700 hover:text-emerald-600 bg-gray-50 hover:bg-emerald-50/50 rounded-xl transition-all">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </Link>

          {user ? (
            <Dropdown>
              {/* Added explicit w-9 h-9 and overflow-hidden to constrain the trigger wrapper */}
              <Dropdown.Trigger className="rounded-full cursor-pointer focus:outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-emerald-500">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-full p-0.5 border border-emerald-500/30 hover:border-emerald-500 transition-colors shrink-0 overflow-hidden">
                  <Avatar className="w-full h-full text-xs">
                    {user.image ? (
                      <Avatar.Image alt={user.name || "User"} src={user.image} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <Avatar.Fallback className="w-full h-full flex items-center justify-center font-bold bg-emerald-500/10 text-emerald-600 rounded-full">
                        {getFallbackText(user.name)}
                      </Avatar.Fallback>
                    )}
                  </Avatar>
                </div>
              </Dropdown.Trigger>

              <Dropdown.Popover className="w-64 p-1.5 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50">
                <div className="px-3.5 py-3 mb-1 bg-gray-50/80 rounded-xl border border-gray-100/80">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 shrink-0 rounded-full overflow-hidden ring-2 ring-emerald-500/20">
                      <Avatar className="w-full h-full">
                        {user.image ? (
                          <Avatar.Image alt={user.name || "User"} src={user.image} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <Avatar.Fallback className="w-full h-full flex items-center justify-center text-xs font-bold bg-emerald-500/10 text-emerald-600 rounded-full">
                            {getFallbackText(user.name)}
                          </Avatar.Fallback>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{user.name}</p>
                      <p className="text-[11px] font-medium text-gray-400 truncate mt-0.5">{user.email}</p>
                      <span className="mt-1.5 inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                        {user.role || 'User'}
                      </span>
                    </div>
                  </div>
                </div>

                <Dropdown.Menu className="p-1 space-y-1">
                  <Dropdown.Item 
                    id="dashboard" 
                    textValue="Dashboard"
                    onClick={() => router.push(dashboardHref)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50/60 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      <span>Dashboard</span>
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-md capitalize">
                      {user.role || 'user'}
                    </span>
                  </Dropdown.Item>

                  <Dropdown.Item 
                    id="profile" 
                    textValue="Profile"
                    onClick={() => router.push('/account')}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      <span>My Account</span>
                    </span>
                  </Dropdown.Item>

                  <Dropdown.Item 
                    id="settings" 
                    textValue="Settings"
                    onClick={() => router.push('/account/settings')}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span>Settings</span>
                    </span>
                  </Dropdown.Item>

                  <div className="my-1 border-t border-gray-100" />

                  <Dropdown.Item 
                    id="logout" 
                    textValue="Logout" 
                    onClick={handleLogout}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50/80 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Log Out</span>
                    </span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <Link
              href="/signin"
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all shadow-sm shadow-gray-200"
            >
              Sign In
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link href="/cart" className="relative p-2 text-gray-700">
            <ShoppingBag className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div className="flex flex-col space-y-3 font-medium text-gray-700">
            <Link href="/shop" className="hover:text-emerald-600 transition-colors">Shop</Link>
            <Link href="/categories" className="hover:text-emerald-600 transition-colors">Categories</Link>
            <Link href="/quick-links" className="hover:text-emerald-600 transition-colors">Quick Links</Link>
            
            {user ? (
              <div className="pt-3 border-t border-gray-100 flex flex-col space-y-2">
                <Link 
                  href={dashboardHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3.5 bg-emerald-50 text-emerald-800 rounded-xl font-medium flex items-center justify-between border border-emerald-200/50"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                    <span>Dashboard</span>
                  </span>
                  <span className="text-xs bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-md uppercase font-bold text-[10px]">
                    {user.role || 'User'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3.5 bg-rose-50 text-rose-600 rounded-xl text-left font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link href="/signin" className="pt-2 text-center w-full py-2.5 bg-gray-900 text-white font-medium rounded-xl">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}