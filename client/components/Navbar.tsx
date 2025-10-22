'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();

    if (!isAuthenticated) return null;

    return (
        <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                            Financer
                        </Link>
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink href="/dashboard" active={pathname === '/dashboard'}>
                                Dashboard
                            </NavLink>
                            <NavLink href="/groups" active={pathname === '/groups'}>
                                Groups
                            </NavLink>
                            <NavLink href="/transactions" active={pathname === '/transactions'}>
                                Transactions
                            </NavLink>
                            <NavLink href="/goals" active={pathname === '/goals'}>
                                Goals
                            </NavLink>
                            <NavLink href="/settings" active={pathname === '/settings'}>
                                Settings
                            </NavLink>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <User className="h-4 w-4" />
                            <span>{user?.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`rounded-md px-3 py-2 text-sm font-medium ${active
                    ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                    : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
        >
            {children}
        </Link>
    );
}
