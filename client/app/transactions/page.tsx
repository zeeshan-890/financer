'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { transactionApi } from '@/lib/api';
import { Plus, Trash2, Filter } from 'lucide-react';
import AddTransactionModal from '@/components/AddTransactionModal';
import toast from 'react-hot-toast';

interface Transaction {
    _id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    notes?: string;
}

export default function TransactionsPage() {
    const { isAuthenticated, isHydrated } = useAuthStore();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (!isHydrated) return; // Wait for store to hydrate

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchTransactions();
    }, [isAuthenticated, isHydrated, router, typeFilter, categoryFilter, startDate, endDate]); const fetchTransactions = async () => {
        try {
            setLoading(true);
            const params: {
                type?: 'income' | 'expense';
                category?: string;
                startDate?: string;
                endDate?: string;
            } = {};

            if (typeFilter !== 'all') params.type = typeFilter;
            if (categoryFilter) params.category = categoryFilter;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await transactionApi.getAll(params);
            setTransactions(res.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;

        try {
            await transactionApi.delete(id);
            toast.success('Transaction deleted successfully!');
            fetchTransactions(); // Refresh list
        } catch (error) {
            console.error('Error deleting transaction:', error);
            toast.error('Failed to delete transaction');
        }
    };

    const clearFilters = () => {
        setTypeFilter('all');
        setCategoryFilter('');
        setStartDate('');
        setEndDate('');
    };

    if (!isHydrated || !isAuthenticated) return null;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">Loading transactions...</p>
            </div>
        );
    } return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Transactions</h1>
                        <p className="text-zinc-600 dark:text-zinc-400">Track all your income and expenses</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                        <Button onClick={() => setShowAddModal(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Transaction
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Filters</CardTitle>
                            <CardDescription>Filter transactions by type, category, and date</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <Label>Type</Label>
                                    <select
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value as 'all' | 'income' | 'expense')}
                                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                                    >
                                        <option value="all">All</option>
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </div>

                                <div>
                                    <Label>Category</Label>
                                    <Input
                                        placeholder="e.g., Food, Salary"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label>Start Date</Label>
                                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                </div>

                                <div>
                                    <Label>End Date</Label>
                                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                </div>
                            </div>

                            <Button onClick={clearFilters} variant="outline" className="mt-4 w-full sm:w-auto">
                                Clear Filters
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Transactions List */}
                <Card>
                    <CardContent className="p-0">
                        {transactions.length > 0 ? (
                            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {transactions.map((tx) => (
                                    <div key={tx._id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                        }`}
                                                >
                                                    {tx.type === 'income' ? '↑' : '↓'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{tx.title}</p>
                                                    <p className="text-sm text-zinc-500">
                                                        {new Date(tx.date).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}{' '}
                                                        • {tx.category}
                                                    </p>
                                                    {tx.notes && <p className="text-sm text-zinc-400 mt-1">{tx.notes}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <p className={`text-lg font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.type === 'income' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
                                            </p>
                                            <Button onClick={() => handleDelete(tx._id)} variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <p className="text-zinc-500 dark:text-zinc-400 mb-4">No transactions found</p>
                                <Button onClick={() => setShowAddModal(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your First Transaction
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {showAddModal && (
                <AddTransactionModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        setShowAddModal(false);
                        fetchTransactions();
                    }}
                />
            )}
        </div>
    );
}
