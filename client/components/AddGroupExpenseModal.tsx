'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { groupApi, userApi, transactionApi } from '@/lib/api';

interface Friend {
    _id: string;
    name: string;
    email: string;
}

interface Group {
    _id: string;
    name: string;
    members: Array<{ userId: string; name: string; email: string }>;
}

interface AddGroupExpenseModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddGroupExpenseModal({ onClose, onSuccess }: AddGroupExpenseModalProps) {
    const [title, setTitle] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    // Group selection
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState('');

    // Friend selection for custom split
    const [friends, setFriends] = useState<Friend[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [splitMode, setSplitMode] = useState<'equal' | 'custom'>('equal');
    const [customAmounts, setCustomAmounts] = useState<{ [key: string]: string }>({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [groupsRes, friendsRes] = await Promise.all([groupApi.getAllGroups(), userApi.getFriends()]);
            setGroups(groupsRes.data);
            setFriends(friendsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const handleGroupChange = (groupId: string) => {
        setSelectedGroup(groupId);
        const group = groups.find((g) => g._id === groupId);
        if (group) {
            // Auto-select all group members
            setSelectedFriends(group.members.map((m) => m.userId));
            setCustomAmounts({});
        }
    };

    const toggleFriend = (friendId: string) => {
        setSelectedFriends((prev) =>
            prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
        );
    };

    const calculateEqualSplit = () => {
        if (!totalAmount || selectedFriends.length === 0) return '0';
        return (parseFloat(totalAmount) / selectedFriends.length).toFixed(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title || !totalAmount || !category || selectedFriends.length === 0) {
            setError('Please fill all required fields and select at least one friend');
            return;
        }

        // Validate custom amounts
        if (splitMode === 'custom') {
            const total = selectedFriends.reduce((sum, id) => sum + parseFloat(customAmounts[id] || '0'), 0);
            if (Math.abs(total - parseFloat(totalAmount)) > 0.01) {
                setError(`Custom amounts (₹${total.toFixed(2)}) must equal total amount (₹${totalAmount})`);
                return;
            }
        }

        setLoading(true);

        try {
            // Prepare split data
            const splitBetween = selectedFriends.map((friendId) => {
                const friend = friends.find((f) => f._id === friendId);
                const group = groups.find((g) => g._id === selectedGroup);
                const member = group?.members.find((m) => m.userId === friendId);

                return {
                    userId: friendId,
                    name: friend?.name || member?.name || 'Unknown',
                    email: friend?.email || member?.email || '',
                    amount: splitMode === 'equal' ? parseFloat(calculateEqualSplit()) : parseFloat(customAmounts[friendId] ?? '0'),
                };
            });

            await transactionApi.create({
                title,
                amount: parseFloat(totalAmount),
                type: 'expense',
                category,
                date: new Date(date),
                notes,
                isGroupExpense: true,
                groupId: selectedGroup || undefined,
                splitBetween,
            });

            onSuccess();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to add group expense');
            } else {
                setError('Failed to add group expense');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl my-8">
                <CardHeader>
                    <CardTitle>Add Group Expense</CardTitle>
                    <CardDescription>Split an expense with friends</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <div>
                            <Label htmlFor="title">Description *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Dinner at Restaurant"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="amount">Total Amount (₹) *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={totalAmount}
                                    onChange={(e) => setTotalAmount(e.target.value)}
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
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="date">Date *</Label>
                            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        </div>

                        {/* Group Selection */}
                        <div>
                            <Label htmlFor="group">Select Group (Optional)</Label>
                            <select
                                id="group"
                                value={selectedGroup}
                                onChange={(e) => handleGroupChange(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                            >
                                <option value="">No Group (Select Friends Manually)</option>
                                {groups.map((group) => (
                                    <option key={group._id} value={group._id}>
                                        {group.name} ({group.members.length} members)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Friend Selection */}
                        <div>
                            <Label>Split With *</Label>
                            <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
                                {friends.length === 0 ? (
                                    <p className="text-sm text-zinc-500">No friends added yet. Add friends in Settings.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {friends.map((friend) => (
                                            <label key={friend._id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFriends.includes(friend._id)}
                                                    onChange={() => toggleFriend(friend._id)}
                                                    className="h-4 w-4 rounded border-zinc-300"
                                                />
                                                <span className="text-sm">{friend.name}</span>
                                                <span className="text-xs text-zinc-500">({friend.email})</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {selectedFriends.length > 0 && (
                                <p className="mt-2 text-sm text-zinc-600">
                                    {selectedFriends.length} friend{selectedFriends.length > 1 ? 's' : ''} selected
                                </p>
                            )}
                        </div>

                        {/* Split Mode */}
                        {selectedFriends.length > 0 && (
                            <>
                                <div>
                                    <Label>Split Mode</Label>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setSplitMode('equal')}
                                            className={`flex-1 rounded-md border-2 px-4 py-2 text-sm font-medium ${splitMode === 'equal'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20'
                                                : 'border-zinc-200 text-zinc-600'
                                                }`}
                                        >
                                            Equal Split (₹{calculateEqualSplit()} each)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSplitMode('custom')}
                                            className={`flex-1 rounded-md border-2 px-4 py-2 text-sm font-medium ${splitMode === 'custom'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20'
                                                : 'border-zinc-200 text-zinc-600'
                                                }`}
                                        >
                                            Custom Amounts
                                        </button>
                                    </div>
                                </div>

                                {/* Custom Amounts */}
                                {splitMode === 'custom' && (
                                    <div>
                                        <Label>Assign Amounts</Label>
                                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                                            {selectedFriends.map((friendId) => {
                                                const friend = friends.find((f) => f._id === friendId);
                                                return (
                                                    <div key={friendId} className="flex items-center gap-2">
                                                        <span className="flex-1 text-sm">{friend?.name}</span>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={customAmounts[friendId] || ''}
                                                            onChange={(e) => setCustomAmounts({ ...customAmounts, [friendId]: e.target.value })}
                                                            placeholder="0.00"
                                                            className="w-24"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <div>
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="flex min-h-[60px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                                placeholder="Add any additional details..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="flex-1">
                                {loading ? 'Adding...' : 'Add Expense & Split'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
