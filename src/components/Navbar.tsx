'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/signin'); // লগআউট হওয়ার পর সাইন-ইন পেজে রিডাইরেক্ট করবে
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* লোগো */}
        <Link href="/" className="flex items-center gap-2">
          <Image src='/assets/mobile_village.jfif' alt="Logo" width={40} height={40} className="w-10 h-10 rounded-full" />
          <span className="font-bold text-xl tracking-tight text-gray-900">Mobile Village</span>
        </Link>

        {/* ডেস্কটপ নেভিগেশন লিংক */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-black py-2">
            <span>Shop</span>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
          </div>
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-black py-2">
            <span>Categories</span>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
          </div>
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-black py-2">
            <span>Quick Links</span>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" />
          </div>
        </nav>

        {/* সার্চ বার, কার্ট ও ইউজার সেকশন (ডেস্কটপ) */}
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
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-600 rounded-full"></span>
          </Link>

          {/* ইউজার লগইন থাকলে প্রোফাইল এবং লগআউট বাটন, না থাকলে Sign In */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-black">
                {user.image ? (
                  <Image src={user.image} alt={user.name || "User"} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <span>{user.name}</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
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
        <div className="flex items-center gap-4 md:hidden">
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

      {/* মোবাইল ড্রপডাউন */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4">
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
            
            {/* মোবাইল মেনুর জন্য ইউজার অপশন */}
            {user ? (
              <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
                <div className="text-sm font-semibold text-gray-900 py-1">
                  Logged in as: {user.name}
                </div>
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