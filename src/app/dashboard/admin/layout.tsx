import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import React from 'react';

// Admin-only layout — role check করে, non-admin হলে redirect করে
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  noStore();

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/signin?callbackUrl=/dashboard');
  }

  const user = session.user as typeof session.user & { role?: string };

  if (user.role !== 'admin') {
    // Normal user কে তার নিজের dashboard এ পাঠাও
    redirect('/dashboard/user');
  }

  return <>{children}</>;
}
