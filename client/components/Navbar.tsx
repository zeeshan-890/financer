'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from './ui/button';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (!isAuthenticated) return null;

    return (
        <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/dashboard" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                        Financer
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
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

                    {/* Desktop User Info & Logout */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <User className="h-4 w-4" />
                            <span className="max-w-32 truncate">{user?.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <div className="px-4 py-3 space-y-1">
                        <MobileNavLink
                            href="/dashboard"
                            active={pathname === '/dashboard'}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Dashboard
                        </MobileNavLink>
                        <MobileNavLink
                            href="/groups"
                            active={pathname === '/groups'}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Groups
                        </MobileNavLink>
                        <MobileNavLink
                            href="/transactions"
                            active={pathname === '/transactions'}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Transactions
                        </MobileNavLink>
                        <MobileNavLink
                            href="/goals"
                            active={pathname === '/goals'}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Goals
                        </MobileNavLink>
                        <MobileNavLink
                            href="/settings"
                            active={pathname === '/settings'}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Settings
                        </MobileNavLink>

                        <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <User className="h-4 w-4" />
                                <span>{user?.name}</span>
                            </div>
                            <button
                                onClick={() => {
                                    logout();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${active
                ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({
    href,
    active,
    onClick,
    children
}: {
    href: string;
    active: boolean;
    onClick: () => void;
    children: React.ReactNode
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${active
                ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`}
        >
            {children}
        </Link>
    );
}
