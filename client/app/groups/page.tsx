'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Receipt, Plus, Check, X } from 'lucide-react';
import { transactionApi, bankAccountApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Contact {
    _id: string;
    name: string;
    email: string;
}

interface BankAccount {
    _id: string;
    accountName: string;
    accountNumber: string;
    bankName?: string;
    balance: number;
    isDefault?: boolean;
}

interface Split {
    userId?: string;
    _id?: string;
    name: string;
    email: string;
    amountOwed: number;
    status: 'paid' | 'pending';
    paidAt?: string;
}

interface GroupExpense {
    _id: string;
    title: string;
    amount: number;
    date: string;
    splitBetween: Split[];
    notes?: string;
    isGroupExpense?: boolean;
}

export default function GroupExpensesPage() {
    const { isAuthenticated, isHydrated } = useAuthStore();
    const router = useRouter();
    const [expenses, setExpenses] = useState<GroupExpense[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);

    // Add expense modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [title, setTitle] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [notes, setNotes] = useState('');
    const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [customSplits, setCustomSplits] = useState<{ [key: string]: string }>({});
    const [selectedBankAccount, setSelectedBankAccount] = useState('');
    const [saving, setSaving] = useState(false);

    // Reminder settings
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderInterval, setReminderInterval] = useState(24); // default 24 hours

    useEffect(() => {
        if (!isHydrated) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchData();
    }, [isAuthenticated, isHydrated, router]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const [transactionsRes, contactsRes, bankAccountsRes] = await Promise.all([
                transactionApi.getAllTransactions(),
                fetch('/api/contacts', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                bankAccountApi.getAll()
            ]);

            // Filter only group expenses
            const groupExpenses = transactionsRes.data.filter((t: GroupExpense | Record<string, unknown>) => {
                const expense = t as GroupExpense;
                return expense.isGroupExpense && expense.splitBetween && expense.splitBetween.length > 0;
            });
            setExpenses(groupExpenses as GroupExpense[]);

            // Get contacts
            if (contactsRes.ok) {
                const contactsData = await contactsRes.json();
                setContacts(contactsData);
            }

            // Get bank accounts
            setBankAccounts(bankAccountsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    const toggleFriend = (friendId: string) => {
        setSelectedFriends((prev) => {
            const newSelection = prev.includes(friendId)
                ? prev.filter((id) => id !== friendId)
                : [...prev, friendId];

            // Reset custom splits when selection changes
            if (splitType === 'custom') {
                const newCustomSplits: { [key: string]: string } = {};
                newSelection.forEach(id => {
                    newCustomSplits[id] = customSplits[id] || '';
                });
                setCustomSplits(newCustomSplits);
            }

            return newSelection;
        });
    };

    const handleCustomSplitChange = (friendId: string, value: string) => {
        setCustomSplits((prev) => ({
            ...prev,
            [friendId]: value,
        }));
    };

    const handleAddExpense = async () => {
        if (!title.trim() || !totalAmount || selectedFriends.length === 0) {
            toast.error('Please fill all required fields and select at least one friend');
            return;
        }

        const amount = parseFloat(totalAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            setSaving(true);

            let splitBetween: Split[] = [];
            let totalFriendsShare = 0;

            if (splitType === 'equal') {
                // Equal split among selected friends + user (divide by total number of people)
                const totalPeople = selectedFriends.length + 1; // +1 for the user
                const perPerson = amount / totalPeople;
                totalFriendsShare = perPerson * selectedFriends.length;
                splitBetween = selectedFriends.map((friendId) => {
                    const contact = contacts.find((c) => c._id === friendId);
                    return {
                        userId: friendId,
                        _id: friendId,
                        name: contact?.name || '',
                        email: contact?.email || '',
                        amountOwed: parseFloat(perPerson.toFixed(2)),
                        status: 'pending' as const,
                    };
                });
            } else {
                // Custom split - friends can pay any amount, user pays the rest
                totalFriendsShare = selectedFriends.reduce((sum, id) => {
                    const amt = parseFloat(customSplits[id] || '0');
                    return sum + amt;
                }, 0);

                if (totalFriendsShare > amount) {
                    toast.error(`Friends' share (PKR ${totalFriendsShare.toFixed(2)}) cannot exceed total amount (PKR ${amount})`);
                    return;
                }

                splitBetween = selectedFriends.map((friendId) => {
                    const contact = contacts.find((c) => c._id === friendId);
                    return {
                        userId: friendId,
                        _id: friendId,
                        name: contact?.name || '',
                        email: contact?.email || '',
                        amountOwed: parseFloat(customSplits[friendId] || '0'),
                        status: 'pending' as const,
                    };
                });
            }

            const expenseData = {
                title,
                amount,
                type: 'expense',
                category: 'Group Expense',
                isGroupExpense: true,
                splitBetween,
                notes,
                bankAccountId: selectedBankAccount || undefined,
                reminderEnabled,
                reminderInterval: reminderEnabled ? reminderInterval : undefined,
            };

            await transactionApi.addTransaction(expenseData);
            toast.success('Group expense added successfully!');

            // Reset form
            setShowAddModal(false);
            setTitle('');
            setTotalAmount('');
            setNotes('');
            setSplitType('equal');
            setSelectedFriends([]);
            setCustomSplits({});
            setSelectedBankAccount('');
            setReminderEnabled(false);
            setReminderInterval(24);

            fetchData();
        } catch (error) {
            console.error('Error adding expense:', error);
            toast.error('Failed to add expense');
        } finally {
            setSaving(false);
        }
    };

    const handleMarkAsPaid = async (expenseId: string, friendId: string) => {
        try {
            await transactionApi.updatePaymentStatus(expenseId, { userId: friendId, status: 'paid' });
            toast.success('Payment status updated to paid!');
            fetchData();
        } catch (error) {
            console.error('Error updating payment status:', error);
            toast.error('Failed to update payment status');
        }
    };

    const handleDeleteExpense = async (expenseId: string) => {
        if (!confirm('Delete this expense? This cannot be undone.')) return;
        try {
            await transactionApi.delete(expenseId);
            toast.success('Expense deleted');
            fetchData();
        } catch (err) {
            console.error('Failed to delete expense', err);
            toast.error('Failed to delete expense');
        }
    };

    if (!isHydrated || !isAuthenticated) return null;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">Loading expenses...</p>
            </div>
        );
    }

    const totalCustomAmount = selectedFriends.reduce((sum, id) => {
        return sum + (parseFloat(customSplits[id]) || 0);
    }, 0);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">Group Expenses</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Split expenses with friends and track payments</p>
                    </div>
                    <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Expense
                    </Button>
                </div>

                {expenses.length > 0 ? (
                    <div className="grid gap-4">
                        {expenses.map((expense) => {
                            if (!expense || !expense.splitBetween || expense.splitBetween.length === 0) {
                                return null;
                            }

                            return (
                                <Card key={expense._id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="flex items-center gap-2">
                                                    <Receipt className="h-4 w-4 text-zinc-500" />
                                                    {expense.title}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    {new Date(expense.date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                    {' • '}
                                                    {expense.splitBetween?.length || 0} {expense.splitBetween?.length === 1 ? 'person' : 'people'}
                                                </CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                                    ₹{(expense.amount || 0).toLocaleString()}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteExpense(expense._id)}
                                                    className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                                >
                                                    <X className="mr-1 h-3 w-3" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {expense.notes && (
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                                                {expense.notes}
                                            </p>
                                        )}

                                        {/* Summary */}
                                        <div className="mb-4 flex gap-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                                            <div>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">You paid</p>
                                                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                                    ₹{(expense.amount || 0).toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">To receive back</p>
                                                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                    ₹{expense.splitBetween?.reduce((sum, split) => sum + (split.status === 'pending' ? (split.amountOwed || 0) : 0), 0).toLocaleString() || 0}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {expense.splitBetween?.map((split, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div
                                                            className={`flex h-8 w-8 items-center justify-center rounded-full ${split.status === 'paid'
                                                                ? 'bg-green-100 dark:bg-green-900'
                                                                : 'bg-zinc-100 dark:bg-zinc-800'
                                                                }`}
                                                        >
                                                            {split.status === 'paid' ? (
                                                                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                            ) : (
                                                                <X className="h-4 w-4 text-zinc-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
                                                                {split.name}
                                                            </p>
                                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                {split.email}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                                                                ₹{(split.amountOwed || 0).toLocaleString()}
                                                            </p>
                                                            {split.status === 'paid' && split.paidAt ? (
                                                                <p className="text-xs text-green-600 dark:text-green-400">
                                                                    Paid {new Date(split.paidAt).toLocaleDateString('en-IN')}
                                                                </p>
                                                            ) : (
                                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                    Pending
                                                                </p>
                                                            )}
                                                        </div>

                                                        {split.status === 'pending' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleMarkAsPaid(expense._id, split._id || split.userId || '')}
                                                                className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                                                            >
                                                                <Check className="mr-1 h-3 w-3" />
                                                                Paid
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <Receipt className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
                            <p className="text-zinc-500 dark:text-zinc-400 mb-4">No group expenses yet</p>
                            <Button onClick={() => setShowAddModal(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Expense
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Add Expense Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                        <Card className="w-full max-w-2xl my-8">
                            <CardHeader>
                                <CardTitle>Add Group Expense</CardTitle>
                                <CardDescription>Split an expense with your friends</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-5">
                                    {/* Expense Title */}
                                    <div>
                                        <Label htmlFor="title">Expense Title *</Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g., Dinner at Restaurant, Movie Tickets"
                                        />
                                    </div>

                                    {/* Total Amount */}
                                    <div>
                                        <Label htmlFor="amount">Total Amount (₹) *</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            value={totalAmount}
                                            onChange={(e) => setTotalAmount(e.target.value)}
                                            placeholder="0.00"
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <Label htmlFor="notes">Notes (Optional)</Label>
                                        <Input
                                            id="notes"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Add any additional details..."
                                        />
                                    </div>

                                    {/* Bank Account Selection */}
                                    <div>
                                        <Label htmlFor="bankAccount">Pay From Bank Account (Optional)</Label>
                                        <select
                                            id="bankAccount"
                                            value={selectedBankAccount}
                                            onChange={(e) => setSelectedBankAccount(e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                                        >
                                            <option value="">Select account (optional)</option>
                                            {bankAccounts.map((account) => (
                                                <option key={account._id} value={account._id}>
                                                    {account.accountName} - {account.bankName} (Balance: PKR {(account.balance || 0).toLocaleString()})
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            Bank account reference for invoice display only
                                        </p>
                                    </div>

                                    {/* Split Type */}
                                    <div>
                                        <Label>Split Type *</Label>
                                        <div className="mt-2 flex gap-3">
                                            <Button
                                                type="button"
                                                variant={splitType === 'equal' ? 'default' : 'outline'}
                                                onClick={() => setSplitType('equal')}
                                                className="flex-1"
                                            >
                                                Equal Split
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={splitType === 'custom' ? 'default' : 'outline'}
                                                onClick={() => setSplitType('custom')}
                                                className="flex-1"
                                            >
                                                Custom Split
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Select Friends */}
                                    <div>
                                        <Label>Select Friends to Split With *</Label>
                                        {contacts.length === 0 ? (
                                            <p className="text-sm text-zinc-500 mt-2">
                                                No contacts added yet. Add contacts in Friends page first.
                                            </p>
                                        ) : (
                                            <div className="mt-2 max-h-60 overflow-y-auto rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
                                                <div className="space-y-3">
                                                    {contacts.map((contact) => {
                                                        const isSelected = selectedFriends.includes(contact._id);
                                                        const perPersonAmount = totalAmount && selectedFriends.length > 0
                                                            ? (parseFloat(totalAmount) / selectedFriends.length).toFixed(2)
                                                            : '0.00';

                                                        return (
                                                            <div key={contact._id} className="space-y-2">
                                                                <label className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSelected}
                                                                        onChange={() => toggleFriend(contact._id)}
                                                                        className="h-4 w-4 rounded border-zinc-300"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <span className="text-sm font-medium">{contact.name}</span>
                                                                        <span className="text-xs text-zinc-500 ml-2">({contact.email})</span>
                                                                    </div>
                                                                    {isSelected && splitType === 'equal' && (
                                                                        <span className="text-sm font-medium text-blue-600">
                                                                            PKR {perPersonAmount}
                                                                        </span>
                                                                    )}
                                                                </label>

                                                                {/* Custom amount input */}
                                                                {isSelected && splitType === 'custom' && (
                                                                    <div className="ml-6">
                                                                        <Input
                                                                            type="number"
                                                                            value={customSplits[contact._id] || ''}
                                                                            onChange={(e) => handleCustomSplitChange(contact._id, e.target.value)}
                                                                            placeholder="Amount for this person"
                                                                            className="text-sm"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Reminder Settings */}
                                        {selectedFriends.length > 0 && (
                                            <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <input
                                                        type="checkbox"
                                                        id="reminderEnabled"
                                                        checked={reminderEnabled}
                                                        onChange={(e) => setReminderEnabled(e.target.checked)}
                                                        className="h-4 w-4 rounded border-zinc-300"
                                                    />
                                                    <Label htmlFor="reminderEnabled" className="cursor-pointer">
                                                        Send payment reminders
                                                    </Label>
                                                </div>

                                                {reminderEnabled && (
                                                    <div>
                                                        <Label htmlFor="reminderInterval" className="text-sm mb-2 block">
                                                            Reminder Interval (hours)
                                                        </Label>
                                                        <Input
                                                            id="reminderInterval"
                                                            type="number"
                                                            min="1"
                                                            value={reminderInterval}
                                                            onChange={(e) => setReminderInterval(Number(e.target.value))}
                                                            placeholder="24"
                                                            className="w-full"
                                                        />
                                                        <p className="text-xs text-zinc-500 mt-1">
                                                            {reminderInterval} hours = {(reminderInterval / 24).toFixed(1)} days
                                                        </p>
                                                        <div className="flex gap-2 mt-2 flex-wrap">
                                                            {[12, 24, 48, 72, 168].map((hours) => (
                                                                <button
                                                                    key={hours}
                                                                    type="button"
                                                                    onClick={() => setReminderInterval(hours)}
                                                                    className="px-2 py-1 text-xs rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                                >
                                                                    {hours}h
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Split Summary */}
                                        {selectedFriends.length > 0 && totalAmount && (
                                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                                                {splitType === 'equal' ? (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-zinc-700 dark:text-zinc-300">
                                                                {selectedFriends.length + 1} people total (you + {selectedFriends.length} {selectedFriends.length === 1 ? 'friend' : 'friends'})
                                                            </span>
                                                            <span className="font-medium text-blue-700 dark:text-blue-300">
                                                                ₹{(parseFloat(totalAmount) / (selectedFriends.length + 1)).toFixed(2)} per person
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm pt-2 border-t border-blue-200 dark:border-blue-800">
                                                            <span className="text-zinc-700 dark:text-zinc-300 font-medium">Your share:</span>
                                                            <span className="font-bold text-orange-700 dark:text-orange-300">
                                                                ₹{(parseFloat(totalAmount) / (selectedFriends.length + 1)).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-zinc-700 dark:text-zinc-300">Friends&apos; total share:</span>
                                                            <span className={`font-medium ${totalCustomAmount <= parseFloat(totalAmount)
                                                                ? 'text-blue-700 dark:text-blue-300'
                                                                : 'text-red-700 dark:text-red-300'
                                                                }`}>
                                                                ₹{totalCustomAmount.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm pt-2 border-t border-blue-200 dark:border-blue-800">
                                                            <span className="text-zinc-700 dark:text-zinc-300 font-medium">Your share (paid upfront):</span>
                                                            <span className="font-bold text-orange-700 dark:text-orange-300">
                                                                ₹{(parseFloat(totalAmount) - totalCustomAmount).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setShowAddModal(false);
                                                setTitle('');
                                                setTotalAmount('');
                                                setNotes('');
                                                setSplitType('equal');
                                                setSelectedFriends([]);
                                                setCustomSplits({});
                                                setReminderEnabled(false);
                                                setReminderInterval(24);
                                            }}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleAddExpense}
                                            disabled={saving}
                                            className="flex-1"
                                        >
                                            {saving ? 'Adding...' : 'Add Expense'}
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
