'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { transactionApi } from '@/lib/api';
import { Plus, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
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
    reservedAmount: number;
    usableBalance: number;
    categoryData: Record<string, number>;
    monthlyData: Array<{ month: string; income: number; expense: number }>;
    heatmapData: Array<{ date: string; amount: number }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function DashboardPage() {
    const { isAuthenticated, isHydrated } = useAuthStore();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [balanceVisible, setBalanceVisible] = useState(false);

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
            setRecentTransactions(transactionsRes.data.slice(0, 8));
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

    // Get max expense for heatmap coloring
    const maxExpense = stats ? Math.max(...stats.heatmapData.map(d => d.amount), 0) : 0;

    // Get current week heatmap (last 7 days)
    const currentWeekData = stats ? stats.heatmapData.slice(-7) : [];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
                        <p className="text-zinc-600 dark:text-zinc-400">Your financial overview</p>
                    </div>
                    <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Transaction
                    </Button>
                </div>

                {/* Balance Cards - Top Row */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardDescription className="text-blue-100">Total Balance</CardDescription>
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0 text-white hover:bg-blue-400"
                                    onClick={() => setBalanceVisible(!balanceVisible)}
                                >
                                    {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl">
                                {balanceVisible ? `PKR ${stats?.balance.toLocaleString() || 0}` : '••••••'}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-purple-100">Reserved Money</CardDescription>
                            <CardTitle className="text-2xl sm:text-3xl">
                                {balanceVisible ? `PKR ${stats?.reservedAmount.toLocaleString() || 0}` : '••••••'}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-green-100">Usable Balance</CardDescription>
                            <CardTitle className="text-2xl sm:text-3xl">
                                {balanceVisible ? `PKR ${stats?.usableBalance.toLocaleString() || 0}` : '••••••'}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <CardHeader className="pb-3">
                            <CardDescription className="text-orange-100">Total Expenses</CardDescription>
                            <CardTitle className="text-2xl sm:text-3xl">PKR {stats?.expenses.toLocaleString() || 0}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Income vs Expense Comparison */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    <Card className="border-2 border-green-200 dark:border-green-800">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                <div>
                                    <CardDescription>Total Income</CardDescription>
                                    <CardTitle className="text-2xl text-green-600">PKR {stats?.income.toLocaleString() || 0}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="border-2 border-red-200 dark:border-red-800">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="h-5 w-5 text-red-600" />
                                <div>
                                    <CardDescription>Total Expenses</CardDescription>
                                    <CardTitle className="text-2xl text-red-600">PKR {stats?.expenses.toLocaleString() || 0}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 lg:grid-cols-2 mb-6">
                    {/* Income vs Expense Line Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Income vs Expenses Trend</CardTitle>
                            <CardDescription>Last 6 months comparison</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats?.monthlyData && stats.monthlyData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={stats.monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                                        <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center text-zinc-500 py-10 text-sm">No data yet</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Category Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Spending by Category</CardTitle>
                            <CardDescription>Expense breakdown</CardDescription>
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
                                            label={(entry) => `${entry.name}: ${((entry.value / stats!.expenses) * 100).toFixed(0)}%`}
                                            outerRadius={90}
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
                                <p className="text-center text-zinc-500 py-10 text-sm">No expense data yet</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Monthly Bar Chart */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Monthly Overview</CardTitle>
                        <CardDescription>Income and expenses comparison</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats?.monthlyData && stats.monthlyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="income" fill="#10b981" name="Income" />
                                    <Bar dataKey="expense" fill="#ef4444" name="Expenses" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-zinc-500 py-10 text-sm">No monthly data yet</p>
                        )}
                    </CardContent>
                </Card>

                {/* Expense Heatmap Calendar */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg sm:text-xl">Expense Calendar (Last 7 Days)</CardTitle>
                        <CardDescription>Color intensity shows spending amount</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-2">
                            {currentWeekData.map((day, index) => {
                                const intensity = maxExpense > 0 ? (day.amount / maxExpense) : 0;
                                const bgColor = intensity === 0 
                                    ? 'bg-zinc-100 dark:bg-zinc-800' 
                                    : intensity < 0.25 
                                    ? 'bg-green-200 dark:bg-green-900'
                                    : intensity < 0.5
                                    ? 'bg-yellow-200 dark:bg-yellow-900'
                                    : intensity < 0.75
                                    ? 'bg-orange-300 dark:bg-orange-900'
                                    : 'bg-red-400 dark:bg-red-900';
                                
                                const date = new Date(day.date);
                                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                                const dayNum = date.getDate();

                                return (
                                    <div key={index} className="flex flex-col items-center">
                                        <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">{dayName}</div>
                                        <div 
                                            className={`w-full aspect-square rounded-lg ${bgColor} flex flex-col items-center justify-center border border-zinc-300 dark:border-zinc-700 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all`}
                                            title={`${day.date}: PKR ${day.amount.toLocaleString()}`}
                                        >
                                            <div className="text-sm font-semibold">{dayNum}</div>
                                            {day.amount > 0 && (
                                                <div className="text-xs mt-1">PKR {day.amount.toFixed(0)}</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded"></div>
                                <span>No expenses</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-green-200 dark:bg-green-900 border border-zinc-300 dark:border-zinc-700 rounded"></div>
                                <span>Low</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-900 border border-zinc-300 dark:border-zinc-700 rounded"></div>
                                <span>Medium</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-4 h-4 bg-red-400 dark:bg-red-900 border border-zinc-300 dark:border-zinc-700 rounded"></div>
                                <span>High</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Transactions</CardTitle>
                                <CardDescription>Your latest transactions</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => router.push('/transactions')}>
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentTransactions.length > 0 ? (
                            <div className="space-y-4">
                                {recentTransactions.map((tx) => (
                                    <div key={tx._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {tx.type === 'income' ? '↑' : '↓'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-zinc-900 dark:text-zinc-50">{tx.title}</p>
                                                <p className="text-sm text-zinc-500">
                                                    {new Date(tx.date).toLocaleDateString()} • {tx.category}
                                                </p>
                                            </div>
                                        </div>
                                        <p className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'income' ? '+' : '-'}PKR {Math.abs(tx.amount).toLocaleString()}
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