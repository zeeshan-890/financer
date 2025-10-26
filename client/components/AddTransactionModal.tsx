'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { transactionApi } from '@/lib/api';

interface AddTransactionModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const CATEGORIES = {
    expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Others'],
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Others'],
};

export default function AddTransactionModal({ onClose, onSuccess }: AddTransactionModalProps) {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title || !amount || !category) {
            setError('Please fill all required fields');
            return;
        }

        setLoading(true);

        try {
            await transactionApi.create({
                title,
                amount: parseFloat(amount),
                type,
                category,
                date: new Date(date),
                notes,
            });

            onSuccess();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to add transaction');
            } else {
                setError('Failed to add transaction');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Add Transaction</CardTitle>
                    <CardDescription>Record your income or expense</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Type Selector */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setType('expense');
                                    setCategory('');
                                }}
                                className={`flex-1 rounded-md border-2 px-4 py-2 font-medium ${type === 'expense'
                                        ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20'
                                        : 'border-zinc-200 text-zinc-600'
                                    }`}
                            >
                                Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setType('income');
                                    setCategory('');
                                }}
                                className={`flex-1 rounded-md border-2 px-4 py-2 font-medium ${type === 'income'
                                        ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20'
                                        : 'border-zinc-200 text-zinc-600'
                                    }`}
                            >
                                Income
                            </button>
                        </div>

                        <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Grocery Shopping"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="amount">Amount (Pkr) *</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Category *</Label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                                required
                            >
                                <option value="">Select category</option>
                                {CATEGORIES[type].map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="date">Date *</Label>
                            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        </div>

                        <div>
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                                placeholder="Add any additional details..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? 'Adding...' : 'Add Transaction'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
