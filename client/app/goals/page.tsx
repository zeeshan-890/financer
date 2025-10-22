'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target, Plus } from 'lucide-react';
import { goalApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Goal {
    _id: string;
    title: string;
    targetAmount: number;
    savedAmount: number;
    deadline?: string;
    status: string;
    history?: Array<{
        amount: number;
        date: string;
        note?: string;
    }>;
}

export default function GoalsPage() {
    const { isAuthenticated, isHydrated } = useAuthStore();
    const router = useRouter();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddFundsModal, setShowAddFundsModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

    // Create goal form
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');

    // Add funds form
    const [fundsAmount, setFundsAmount] = useState('');
    const [fundsNote, setFundsNote] = useState('');

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isHydrated) return; // Wait for store to hydrate

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchGoals();
    }, [isAuthenticated, isHydrated, router]);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const res = await goalApi.getAll();
            setGoals(res.data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGoal = async () => {
        if (!title || !targetAmount) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setSaving(true);
            await goalApi.create({
                title,
                targetAmount: parseFloat(targetAmount),
                deadline: deadline ? new Date(deadline) : undefined,
            });

            toast.success('Goal created successfully!');
            setShowCreateModal(false);
            setTitle('');
            setTargetAmount('');
            setDeadline('');
            fetchGoals();
        } catch (error) {
            console.error('Error creating goal:', error);
            toast.error('Failed to create goal');
        } finally {
            setSaving(false);
        }
    };

    const handleAddFunds = async () => {
        if (!selectedGoal || !fundsAmount) {
            toast.error('Please enter an amount');
            return;
        }

        const amount = parseFloat(fundsAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            setSaving(true);
            await goalApi.addFunds(selectedGoal._id, {
                amount,
                note: fundsNote || undefined,
            });

            toast.success('Funds added successfully! Amount deducted from your account.');
            setShowAddFundsModal(false);
            setSelectedGoal(null);
            setFundsAmount('');
            setFundsNote('');
            fetchGoals();
        } catch (error) {
            console.error('Error adding funds:', error);
            toast.error('Failed to add funds');
        } finally {
            setSaving(false);
        }
    };

    const openAddFundsModal = (goal: Goal) => {
        setSelectedGoal(goal);
        setShowAddFundsModal(true);
    };

    const handleDeleteGoal = async (goalId: string) => {
        if (!confirm('Delete this goal? This cannot be undone.')) return;
        try {
            setSaving(true);
            await goalApi.deleteGoal(goalId);
            toast.success('Goal deleted');
            fetchGoals();
        } catch (err) {
            console.error('Failed to delete goal', err);
            toast.error('Failed to delete goal');
        } finally {
            setSaving(false);
        }
    };

    if (!isHydrated || !isAuthenticated) return null;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">Loading goals...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Savings Goals</h1>
                        <p className="text-zinc-600 dark:text-zinc-400">Track your financial goals and progress</p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Goal
                    </Button>
                </div>

                {goals.length > 0 ? (
                    <div className="space-y-4">
                        {goals.map((goal) => {
                            const progress = (goal.savedAmount / goal.targetAmount) * 100;
                            const isCompleted = goal.status === 'completed' || progress >= 100;

                            return (
                                <Card key={goal._id} className={isCompleted ? 'border-green-500' : ''}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Target className={`h-5 w-5 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                                                <CardTitle>{goal.title}</CardTitle>
                                                {isCompleted && (
                                                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                                                        Completed
                                                    </span>
                                                )}
                                            </div>
                                            {goal.deadline && (
                                                <CardDescription>
                                                    Due: {new Date(goal.deadline).toLocaleDateString('en-IN')}
                                                </CardDescription>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-zinc-600 dark:text-zinc-400">
                                                    ₹{goal.savedAmount.toLocaleString()} of ₹{goal.targetAmount.toLocaleString()}
                                                </span>
                                                <span className="font-medium">{Math.min(progress, 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                                                <div
                                                    className={`h-full rounded-full transition-all ${isCompleted ? 'bg-green-600' : 'bg-blue-600'
                                                        }`}
                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                />
                                            </div>

                                            {/* History Section */}
                                            {goal.history && goal.history.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">History:</p>
                                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                                        {goal.history.slice().reverse().map((entry, idx) => (
                                                            <div key={idx} className="text-xs flex justify-between items-start bg-zinc-100 dark:bg-zinc-800 p-2 rounded">
                                                                <div>
                                                                    <p className="font-medium text-zinc-900 dark:text-zinc-50">₹{entry.amount.toLocaleString()}</p>
                                                                    {entry.note && <p className="text-zinc-500 dark:text-zinc-400 italic">{entry.note}</p>}
                                                                </div>
                                                                <p className="text-zinc-500 dark:text-zinc-400">
                                                                    {new Date(entry.date).toLocaleDateString('en-IN')}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => openAddFundsModal(goal)}
                                                    disabled={isCompleted}
                                                >
                                                    Add Funds
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteGoal(goal._id)}
                                                    disabled={saving}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <Target className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
                            <p className="text-zinc-500 dark:text-zinc-400 mb-4">No goals yet</p>
                            <Button onClick={() => setShowCreateModal(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Your First Goal
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Create Goal Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>Create New Goal</CardTitle>
                                <CardDescription>Set a savings target and deadline</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="goalTitle">Goal Title *</Label>
                                        <Input
                                            id="goalTitle"
                                            placeholder="e.g., New Laptop"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="targetAmount">Target Amount (₹) *</Label>
                                        <Input
                                            id="targetAmount"
                                            type="number"
                                            placeholder="50000"
                                            value={targetAmount}
                                            onChange={(e) => setTargetAmount(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="deadline">Deadline (Optional)</Label>
                                        <Input
                                            id="deadline"
                                            type="date"
                                            value={deadline}
                                            onChange={(e) => setDeadline(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => {
                                                setShowCreateModal(false);
                                                setTitle('');
                                                setTargetAmount('');
                                                setDeadline('');
                                            }}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleCreateGoal}
                                            className="flex-1"
                                            disabled={saving}
                                        >
                                            {saving ? 'Creating...' : 'Create Goal'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Add Funds Modal */}
                {showAddFundsModal && selectedGoal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>Add Funds to {selectedGoal.title}</CardTitle>
                                <CardDescription>
                                    Current: ₹{selectedGoal.savedAmount.toLocaleString()} / ₹{selectedGoal.targetAmount.toLocaleString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="fundsAmount">Amount to Add (₹) *</Label>
                                        <Input
                                            id="fundsAmount"
                                            type="number"
                                            placeholder="1000"
                                            value={fundsAmount}
                                            onChange={(e) => setFundsAmount(e.target.value)}
                                        />
                                        {fundsAmount && (
                                            <p className="text-sm text-zinc-500 mt-2">
                                                New total: ₹{(selectedGoal.savedAmount + parseFloat(fundsAmount)).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="fundsNote">Note (Optional)</Label>
                                        <Input
                                            id="fundsNote"
                                            placeholder="e.g., Monthly savings"
                                            value={fundsNote}
                                            onChange={(e) => setFundsNote(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-sm text-orange-600 dark:text-orange-400">
                                        ⚠️ This amount will be deducted from your account as an expense.
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => {
                                                setShowAddFundsModal(false);
                                                setSelectedGoal(null);
                                                setFundsAmount('');
                                                setFundsNote('');
                                            }}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddFunds}
                                            className="flex-1"
                                            disabled={saving}
                                        >
                                            {saving ? 'Adding...' : 'Add Funds'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
