import { DashboardSidebar } from '@/components/dashboard/DashboardSideBar';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import React from 'react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    noStore();
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/signin?callbackUrl=/dashboard');
    }

    const user = session.user as typeof session.user & { role?: string };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50/50" style={{ background: "var(--bg-secondary)" }}>
            <DashboardSidebar initialRole={user.role ?? 'user'} />
            <main className="flex-1 min-w-0 flex flex-col">
                <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
