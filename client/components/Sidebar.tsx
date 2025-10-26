'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from './ui/button';
import {
    LogOut,
    User,
    Menu,
    X,
    LayoutDashboard,
    Receipt,
    Users,
    FileText,
    Target,
    UserPlus,
    CreditCard,
    Lock,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Hide sidebar on admin pages and if not authenticated
    if (!isAuthenticated || pathname?.startsWith('/admin')) return null;

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/transactions', label: 'Transactions', icon: Receipt },
        { href: '/groups', label: 'Groups', icon: Users },
        { href: '/payment-requests', label: 'Requests', icon: FileText },
        { href: '/goals', label: 'Goals', icon: Target },
        { href: '/friends', label: 'Friends', icon: UserPlus },
        { href: '/accounts', label: 'Accounts', icon: CreditCard },
        { href: '/reserved', label: 'Reserved', icon: Lock },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-lg"
            >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static
                    left-0 top-0 
                    h-screen 
                    z-40 lg:z-auto
                    transition-all duration-300 
                    bg-white dark:bg-zinc-950 
                    border-r border-zinc-200 dark:border-zinc-800
                    ${collapsed ? 'w-16' : 'w-64'}
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo & Toggle */}
                    <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                        {!collapsed && (
                            <Link href="/dashboard" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Financer
                            </Link>
                        )}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 ml-auto"
                        >
                            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                        ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                                        } ${collapsed ? 'justify-center' : ''}`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
                        {!collapsed ? (
                            <>
                                <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                                    <User className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={logout}
                                    variant="ghost"
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <button
                                onClick={logout}
                                className="w-full flex justify-center p-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Note: spacer removed - layout now uses flex container in RootLayout; sidebar is static on large screens and overlays only on mobile */}
        </>
    );
}
