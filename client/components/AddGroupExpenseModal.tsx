'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { groupApi, transactionApi } from '@/lib/api';

interface Contact {
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

    // Contact selection for custom split
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [splitMode, setSplitMode] = useState<'equal' | 'custom'>('equal');
    const [customAmounts, setCustomAmounts] = useState<{ [key: string]: string }>({});

    // Reminder settings
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderInterval, setReminderInterval] = useState(24); // default 24 hours

    const [loading, setLoading] = useState(false);
    const [fetchingContacts, setFetchingContacts] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setFetchingContacts(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                setError('Authentication required. Please log in again.');
                setFetchingContacts(false);
                return;
            }
            
            console.log('Fetching contacts with token:', token.substring(0, 20) + '...');
            
            const [groupsRes, contactsRes] = await Promise.all([
                groupApi.getAllGroups(),
                fetch('/api/contacts', {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            ]);
            
            setGroups(groupsRes.data);
            
            if (contactsRes.ok) {
                const contactsData = await contactsRes.json();
                console.log('Contacts fetched successfully:', contactsData.length, 'contacts');
                console.log('Contacts:', contactsData);
                setContacts(contactsData);
            } else {
                const errorText = await contactsRes.text();
                console.error('Failed to fetch contacts:', contactsRes.status, errorText);
                setError(`Failed to load contacts: ${contactsRes.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setFetchingContacts(false);
        }
    };    const handleGroupChange = (groupId: string) => {
        setSelectedGroup(groupId);
        // Just clear selection when group changes - user will select contacts manually
        setSelectedFriends([]);
        setCustomAmounts({});
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
                setError(`Custom amounts (PKR ${total.toFixed(2)}) must equal total amount (PKR ${totalAmount})`);
                return;
            }
        } setLoading(true);

        try {
            // Prepare split data from contacts only
            const splitBetween = selectedFriends.map((friendId) => {
                const contact = contacts.find((c) => c._id === friendId);

                return {
                    userId: friendId,
                    name: contact?.name || 'Unknown',
                    email: contact?.email || '',
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
                reminderEnabled,
                reminderInterval: reminderEnabled ? reminderInterval : undefined,
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
                                <Label htmlFor="amount">Total Amount (PKR) *</Label>
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

                        {/* Contact Selection */}
                        <div>
                            <Label>Split With (Select from Contacts) *</Label>
                            <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
                                {fetchingContacts ? (
                                    <p className="text-sm text-zinc-500">Loading contacts...</p>
                                ) : contacts.length === 0 ? (
                                    <div className="space-y-2">
                                        <p className="text-sm text-zinc-500">No contacts added yet.</p>
                                        <p className="text-xs text-zinc-400">Add contacts in the Friends page first, then they will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {contacts.map((contact) => (
                                            <label key={contact._id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFriends.includes(contact._id)}
                                                    onChange={() => toggleFriend(contact._id)}
                                                    className="h-4 w-4 rounded border-zinc-300"
                                                />
                                                <span className="text-sm">{contact.name}</span>
                                                <span className="text-xs text-zinc-500">({contact.email})</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {selectedFriends.length > 0 && (
                                <p className="mt-2 text-sm text-zinc-600">
                                    {selectedFriends.length} contact{selectedFriends.length > 1 ? 's' : ''} selected
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
                                            Equal Split (PKR {calculateEqualSplit()} each)
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
                                                const contact = contacts.find((c) => c._id === friendId);

                                                return (
                                                    <div key={friendId} className="flex items-center gap-2">
                                                        <span className="flex-1 text-sm">{contact?.name || 'Unknown'}</span>
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

                        {/* Reminder Settings */}
                        {selectedFriends.length > 0 && (
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <input
                                        type="checkbox"
                                        id="reminderEnabled"
                                        checked={reminderEnabled}
                                        onChange={(e) => setReminderEnabled(e.target.checked)}
                                        className="h-4 w-4 rounded border-zinc-300"
                                    />
                                    <Label htmlFor="reminderEnabled" className="cursor-pointer">
                                        Enable Automatic Reminders
                                    </Label>
                                </div>

                                {reminderEnabled && (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <Label htmlFor="reminderInterval" className="text-sm font-medium">
                                            Reminder Interval (in hours)
                                        </Label>
                                        <div className="mt-2 flex items-center gap-3">
                                            <Input
                                                id="reminderInterval"
                                                type="number"
                                                min="1"
                                                value={reminderInterval}
                                                onChange={(e) => setReminderInterval(parseInt(e.target.value) || 24)}
                                                className="w-32"
                                            />
                                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                hours ({(reminderInterval / 24).toFixed(1)} days)
                                            </span>
                                        </div>
                                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                                            Reminders will be sent to all participants every {reminderInterval} hours
                                        </p>
                                        <div className="mt-3 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                                            <p>💡 Quick select:</p>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setReminderInterval(12)}
                                                    className="px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                >
                                                    12h
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setReminderInterval(24)}
                                                    className="px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                >
                                                    24h (1 day)
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setReminderInterval(48)}
                                                    className="px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                >
                                                    48h (2 days)
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setReminderInterval(72)}
                                                    className="px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                >
                                                    72h (3 days)
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setReminderInterval(168)}
                                                    className="px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                >
                                                    168h (1 week)
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

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
