'use client';

import { useState, useEffect } from 'react';
import { reservedMoneyApi, friendApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Wallet, Plus, Trash2, Check, X, Clock, User, Package } from 'lucide-react';

interface ReservedMoney {
    _id: string;
    reservationType: 'friend' | 'custom';
    amount: number;
    reason: string;
    recipientName: string;
    recipientEmail?: string;
    dueDate?: string;
    notes?: string;
    status: 'reserved' | 'paid' | 'cancelled';
    createdAt: string;
    paidAt?: string;
}

interface Friend {
    _id: string;
    friend: {
        _id: string;
        name: string;
        email: string;
    };
    status: string;
}

export default function ReservedMoneyPage() {
    const [reservedItems, setReservedItems] = useState<ReservedMoney[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [totalReserved, setTotalReserved] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        reservationType: 'custom',
        friendId: '',
        amount: '',
        reason: '',
        recipientName: '',
        recipientEmail: '',
        dueDate: '',
        notes: ''
    });

    useEffect(() => {
        fetchReservedMoney();
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await friendApi.getAll();
            setFriends(response.data.filter((f: Friend) => f.status === 'accepted'));
        } catch (err) {
            console.error('Error fetching friends:', err);
        }
    };

    const fetchReservedMoney = async () => {
        try {
            const response = await reservedMoneyApi.getAll();
            setReservedItems(response.data.reserved || []);
            setTotalReserved(response.data.totalReserved || 0);
        } catch (err) {
            console.error('Error fetching reserved money:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const payload: {
                reservationType: string;
                friendId?: string;
                amount: number;
                reason: string;
                recipientName: string;
                recipientEmail?: string;
                dueDate?: Date;
                notes?: string;
            } = {
                reservationType: formData.reservationType,
                amount: parseFloat(formData.amount),
                reason: formData.reason,
                recipientName: formData.recipientName,
                dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
                notes: formData.notes
            };

            if (formData.reservationType === 'friend' && formData.friendId) {
                payload.friendId = formData.friendId;
            }

            if (formData.recipientEmail) {
                payload.recipientEmail = formData.recipientEmail;
            }

            await reservedMoneyApi.create(payload);
            setSuccess('Reserved money added successfully!');
            fetchReservedMoney();
            handleCloseModal();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error && 'response' in err
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                : 'Failed to add reserved money';
            setError(errorMessage || 'Failed to add reserved money');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = async (id: string) => {
        if (!confirm('Mark this as paid?')) return;

        try {
            await reservedMoneyApi.markAsPaid(id);
            setSuccess('Marked as paid!');
            fetchReservedMoney();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error && 'response' in err
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                : 'Failed to mark as paid';
            setError(errorMessage || 'Failed to mark as paid');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;

        try {
            await reservedMoneyApi.delete(id);
            setSuccess('Entry deleted successfully');
            fetchReservedMoney();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error && 'response' in err
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                : 'Failed to delete entry';
            setError(errorMessage || 'Failed to delete entry');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            reservationType: 'custom',
            friendId: '',
            amount: '',
            reason: '',
            recipientName: '',
            recipientEmail: '',
            dueDate: '',
            notes: ''
        });
    };

    const handleFriendSelect = (friendId: string) => {
        const selectedFriend = friends.find(f => f._id === friendId);
        if (selectedFriend) {
            setFormData({
                ...formData,
                friendId: friendId,
                recipientName: selectedFriend.friend.name,
                recipientEmail: selectedFriend.friend.email
            });
        }
    };

    const activeReserved = reservedItems.filter(item => item.status === 'reserved');
    const paidReserved = reservedItems.filter(item => item.status === 'paid');

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Reserved Money</h1>
                        <p className="text-gray-100 mt-1">Track money you need to pay to others</p>
                    </div>
                    <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Reserve Money
                    </Button>
                </div>

                {/* Total Reserved */}
                <Card className="p-6 bg-gradient-to-r from-purple-700 to-pink-700 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">Total Reserved</p>
                            <h2 className="text-4xl font-bold mt-1">PKR {totalReserved.toLocaleString()}</h2>
                        </div>
                        <Wallet className="w-16 h-16 opacity-50" />
                    </div>
                </Card>

                {/* Error/Success Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Active Reserved Money */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Active ({activeReserved.length})
                    </h2>
                    {activeReserved.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No active reserved money</p>
                    ) : (
                        <div className="space-y-3">
                            {activeReserved.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow gap-3"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {item.reservationType === 'friend' ? (
                                                        <User className="w-4 h-4 text-blue-500" />
                                                    ) : (
                                                        <Package className="w-4 h-4 text-purple-500" />
                                                    )}
                                                    <h3 className="font-semibold text-gray-900">{item.reason}</h3>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {item.reservationType === 'friend' ? 'Friend: ' : 'For: '}
                                                    {item.recipientName}
                                                </p>
                                                {item.recipientEmail && (
                                                    <p className="text-xs text-gray-500">{item.recipientEmail}</p>
                                                )}
                                            </div>
                                            <p className="text-lg font-bold text-purple-600">PKR {item.amount.toLocaleString()}</p>
                                        </div>
                                        {item.dueDate && (
                                            <p className="text-xs text-gray-500">
                                                Due: {new Date(item.dueDate).toLocaleDateString()}
                                            </p>
                                        )}
                                        {item.notes && (
                                            <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleMarkAsPaid(item._id)}
                                            className="bg-green-500 hover:bg-green-600"
                                        >
                                            <Check className="w-4 h-4 mr-1" />
                                            Mark Paid
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(item._id)}
                                            className="border-red-500 text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Paid Reserved Money */}
                {paidReserved.length > 0 && (
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            Paid ({paidReserved.length})
                        </h2>
                        <div className="space-y-3">
                            {paidReserved.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg opacity-75"
                                >
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.reason}</h3>
                                        <p className="text-sm text-gray-600">To: {item.recipientName}</p>
                                        {item.paidAt && (
                                            <p className="text-xs text-gray-500">
                                                Paid on: {new Date(item.paidAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-lg font-bold text-green-600">PKR {item.amount.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Add Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Reserve Money</h2>
                                <Button size="sm" variant="outline" onClick={handleCloseModal}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label>Reservation Type</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, reservationType: 'friend', recipientName: '', recipientEmail: '', friendId: '' })}
                                            className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${formData.reservationType === 'friend'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <User className="w-5 h-5" />
                                            <span className="font-medium">Friend</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, reservationType: 'custom', recipientName: '', recipientEmail: '', friendId: '' })}
                                            className={`p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${formData.reservationType === 'custom'
                                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Package className="w-5 h-5" />
                                            <span className="font-medium">Custom</span>
                                        </button>
                                    </div>
                                </div>

                                {formData.reservationType === 'friend' && (
                                    <div>
                                        <Label>Select Friend</Label>
                                        <select
                                            value={formData.friendId}
                                            onChange={(e) => handleFriendSelect(e.target.value)}
                                            className="w-full p-2 border rounded-md"
                                            required
                                        >
                                            <option value="">Choose a friend...</option>
                                            {friends.map((friend) => (
                                                <option key={friend._id} value={friend._id}>
                                                    {friend.friend.name} ({friend.friend.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <Label>Amount (PKR)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="Enter amount"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Reason</Label>
                                    <Input
                                        type="text"
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        placeholder={formData.reservationType === 'friend' ? 'e.g., Borrowed money, Group expense' : 'e.g., Buying book, Course fee'}
                                        required
                                    />
                                </div>

                                {formData.reservationType === 'custom' && (
                                    <div>
                                        <Label>Item/Thing Name</Label>
                                        <Input
                                            type="text"
                                            value={formData.recipientName}
                                            onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                                            placeholder="e.g., University Book, Online Course, Equipment"
                                            required
                                        />
                                    </div>
                                )}

                                {formData.reservationType === 'friend' && (
                                    <div>
                                        <Label>Friend Name (Auto-filled)</Label>
                                        <Input
                                            type="text"
                                            value={formData.recipientName}
                                            readOnly
                                            className="bg-gray-50"
                                        />
                                    </div>
                                )}

                                <div>
                                    <Label>Due Date (Optional)</Label>
                                    <Input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label>Notes (Optional)</Label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Additional notes..."
                                        className="w-full p-2 border rounded-md"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading} className="flex-1">
                                        {loading ? 'Saving...' : 'Reserve'}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
