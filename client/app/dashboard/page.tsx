'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { transactionApi } from '@/lib/api';
import { Plus } from 'lucide-react';
import AddTransactionModal from '@/components/AddTransactionModal';

interface Transaction {
    _id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
}

interface Stats {
    income: number;
    expenses: number;
    balance: number;
    categoryData: Record<string, number>;
    monthlyData: Array<{ month: string; expense: number }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function DashboardPage() {
    const { isAuthenticated, isHydrated } = useAuthStore();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        if (!isHydrated) return; // Wait for store to hydrate

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchData();
    }, [isAuthenticated, isHydrated, router]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, transactionsRes] = await Promise.all([
                transactionApi.getStats(),
                transactionApi.getAll(),
            ]);

            setStats(statsRes.data);
            setRecentTransactions(transactionsRes.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isHydrated || !isAuthenticated) return null;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
            </div>
        );
    }

    const categoryData = stats
        ? Object.entries(stats.categoryData).map(([name, value]) => ({ name, value }))
        : [];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Transaction
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Balance</CardDescription>
                            <CardTitle className="text-3xl">₹{stats?.balance.toLocaleString() || 0}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Income</CardDescription>
                            <CardTitle className="text-3xl text-green-600">₹{stats?.income.toLocaleString() || 0}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Expenses</CardDescription>
                            <CardTitle className="text-3xl text-red-600">₹{stats?.expenses.toLocaleString() || 0}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Category Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Spending by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {categoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => entry.name}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center text-zinc-500 py-10">No expense data yet</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Monthly Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats?.monthlyData && stats.monthlyData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stats.monthlyData}>
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="expense" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center text-zinc-500 py-10">No monthly data yet</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Transactions */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentTransactions.length > 0 ? (
                            <div className="space-y-4">
                                {recentTransactions.map((tx) => (
                                    <div key={tx._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                        <div>
                                            <p className="font-medium text-zinc-900 dark:text-zinc-50">{tx.title}</p>
                                            <p className="text-sm text-zinc-500">
                                                {new Date(tx.date).toLocaleDateString()} • {tx.category}
                                            </p>
                                        </div>
                                        <p className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'income' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-zinc-500 py-10">No transactions yet. Add your first transaction!</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {showAddModal && (
                <AddTransactionModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
}