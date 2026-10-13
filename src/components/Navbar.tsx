'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ChevronDown, LayoutDashboard, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useSession, authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Avatar, Dropdown, Label } from "@heroui/react";
import { ArrowRightFromSquare, Gear } from "@gravity-ui/icons";

function getFallbackText(name?: string | null) {
  if (!name) return "US";
  const words = name.trim().split(" ");
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  
  // নিরাপদে টাইপ ডিক্লেয়ারেশন করা যাতে role চিনে
  const user = session?.user as (NonNullable<typeof session>["user"] & { role?: string }) | undefined;
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/signin');
        },
      },
    });
  };

  // রোল অনুযায়ী সঠিক ড্যাশবোর্ড রুট নির্ধারণ
  const dashboardHref = user?.role === 'admin' ? '/admin' : '/account';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* লোগো */}
        <Link href="/" className="flex items-center gap-2">
          <Image src='/assets/mobile_village.jfif' alt="Logo" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
          <span className="font-bold text-xl tracking-tight text-gray-900">Mobile Village</span>
        </Link>

        {/* ডেস্কটপ নেভিগেশন লিংক */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/shop" className="hover:text-black py-2">Shop</Link>
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-black py-2">
            <span>Categories</span>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
          </div>
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-black py-2">
            <span>Quick Links</span>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
          </div>
        </nav>

        {/* সার্চ বার, কার্ট ও ড্রপডাউন সেকশন (ডেস্কটপ) */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
            />
          </div>

          <Link href="/cart" className="relative p-2 text-gray-700 hover:text-black transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full"></span>
          </Link>

          {/* HeroUI Profile Dropdown */}
          {user ? (
            <Dropdown>
              <Dropdown.Trigger className="rounded-full cursor-pointer focus:outline-none">
                <Avatar className="w-9 h-9">
                  {user.image ? (
                    <Avatar.Image alt={user.name || "User"} src={user.image} className="object-cover" />
                  ) : (
                    <Avatar.Fallback className="text-xs font-bold bg-emerald-100 text-emerald-600">
                      {getFallbackText(user.name)}
                    </Avatar.Fallback>
                  )}
                </Avatar>
              </Dropdown.Trigger>
              <Dropdown.Popover className="min-w-[200px]">
                <div className="px-3 pt-3 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm" className="w-8 h-8 shrink-0">
                      {user.image ? (
                        <Avatar.Image alt={user.name || "User"} src={user.image} className="object-cover" />
                      ) : (
                        <Avatar.Fallback className="text-xs font-bold bg-emerald-100 text-emerald-600">
                          {getFallbackText(user.name)}
                        </Avatar.Fallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm leading-5 font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs leading-none text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                <Dropdown.Menu>
                  {/* Dashboard link (User role অনুযায়ী /admin বা /account) */}
                  <Dropdown.Item 
                    id="dashboard" 
                    textValue="Dashboard"
                    onClick={() => router.push(dashboardHref)}
                    className="cursor-pointer"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <Label className="cursor-pointer">Dashboard ({user.role || 'User'})</Label>
                      <LayoutDashboard className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item 
                    id="profile" 
                    textValue="Profile"
                    onClick={() => router.push('/account')}
                    className="cursor-pointer"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <Label className="cursor-pointer">My Account</Label>
                      <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item 
                    id="settings" 
                    textValue="Settings"
                    onClick={() => router.push('/account/settings')}
                    className="cursor-pointer"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <Label className="cursor-pointer">Settings</Label>
                      <Gear className="size-3.5 text-gray-400" />
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item 
                    id="logout" 
                    textValue="Logout" 
                    variant="danger"
                    onClick={handleLogout}
                    className="cursor-pointer text-rose-600 hover:bg-rose-50"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <Label className="cursor-pointer">Log Out</Label>
                      <ArrowRightFromSquare className="size-3.5 text-rose-500" />
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <Link
              href="/signin"
              className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* মোবাইল মেনু বাটন */}
        <div className="flex items-center gap-4 lg:hidden">
          <Link href="/cart" className="relative p-2 text-gray-700">
            <ShoppingBag className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-black"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* মোবাইল ড্রপডাউন ও মেনু */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="flex flex-col space-y-3 font-medium text-gray-700">
            <Link href="/shop" className="hover:text-black">Shop</Link>
            <Link href="/categories" className="hover:text-black">Categories</Link>
            <Link href="/quick-links" className="hover:text-black">Quick Links</Link>
            
            {/* মোবাইল ইউজার অপশন */}
            {user ? (
              <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
                <Link 
                  href={dashboardHref}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2 px-3 bg-emerald-50 text-emerald-700 rounded-lg font-medium flex items-center justify-between"
                >
                  <span>Dashboard ({user.role || 'User'})</span>
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-center font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/signin" className="pt-2 text-center w-full py-2 bg-black text-white rounded-lg">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}