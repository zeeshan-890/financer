'use client';

import { useState, useEffect } from 'react';
import { friendApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserPlus, UserCheck, UserX, Search, Mail, Check, X, Clock, Plus } from 'lucide-react';

interface Friend {
    _id: string;
    friend: {
        _id: string;
        name: string;
        email: string;
        profileImage?: string;
    };
    status: 'pending' | 'accepted' | 'blocked';
    isSentByMe: boolean;
    requestedAt: string;
    acceptedAt?: string;
}

export default function FriendsPage() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [email, setEmail] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showManualAdd, setShowManualAdd] = useState(false);
    const [manualFriend, setManualFriend] = useState({ name: '', email: '' });

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await friendApi.getAll();
            setFriends(response.data);
        } catch (error: any) {
            console.error('Error fetching friends:', error);
        }
    };

    const handleSendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await friendApi.sendRequest({ email: email.trim() });
            setSuccess('Friend request sent successfully!');
            setEmail('');
            fetchFriends();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to send friend request');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (id: string) => {
        try {
            await friendApi.acceptRequest(id);
            setSuccess('Friend request accepted!');
            fetchFriends();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to accept request');
        }
    };

    const handleRemoveFriend = async (id: string) => {
        if (!confirm('Are you sure you want to remove this friend?')) return;

        try {
            await friendApi.remove(id);
            setSuccess('Friend removed successfully');
            fetchFriends();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to remove friend');
        }
    };

    const handleManualAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualFriend.name.trim() || !manualFriend.email.trim()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await friendApi.addManual(manualFriend);
            setSuccess('Friend added successfully!');
            setManualFriend({ name: '', email: '' });
            setShowManualAdd(false);
            fetchFriends();
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to add friend');
        } finally {
            setLoading(false);
        }
    };

    const filteredFriends = friends.filter(f =>
        f.friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.friend.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pendingRequests = filteredFriends.filter(f => f.status === 'pending');
    const acceptedFriends = filteredFriends.filter(f => f.status === 'accepted');

    const sentRequests = pendingRequests.filter(f => f.isSentByMe);
    const receivedRequests = pendingRequests.filter(f => !f.isSentByMe);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
                        <p className="text-gray-600 mt-1">Manage your friends and friend requests</p>
                    </div>
                </div>

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

                {/* Add Friend */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Add Friend
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowManualAdd(!showManualAdd)}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            {showManualAdd ? 'Send Request' : 'Add Manually'}
                        </Button>
                    </h2>

                    {!showManualAdd ? (
                        <form onSubmit={handleSendRequest} className="flex gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="email"
                                    placeholder="Enter friend's email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Request'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleManualAdd} className="space-y-4">
                            <div>
                                <Label>Friend's Name</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter name"
                                    value={manualFriend.name}
                                    onChange={(e) => setManualFriend({ ...manualFriend, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Friend's Email</Label>
                                <Input
                                    type="email"
                                    placeholder="Enter email"
                                    value={manualFriend.email}
                                    onChange={(e) => setManualFriend({ ...manualFriend, email: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Adding...' : 'Add Friend'}
                            </Button>
                        </form>
                    )}
                </Card>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search friends..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Received Friend Requests */}
                {receivedRequests.length > 0 && (
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Friend Requests ({receivedRequests.length})
                        </h2>
                        <div className="space-y-3">
                            {receivedRequests.map((request) => (
                                <div
                                    key={request._id}
                                    className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {request.friend.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{request.friend.name}</p>
                                            <p className="text-sm text-gray-600">{request.friend.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleAcceptRequest(request._id)}
                                            className="bg-green-500 hover:bg-green-600"
                                        >
                                            <Check className="w-4 h-4 mr-1" />
                                            Accept
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleRemoveFriend(request._id)}
                                            className="border-red-500 text-red-500 hover:bg-red-50"
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Decline
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Sent Friend Requests */}
                {sentRequests.length > 0 && (
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Sent Requests ({sentRequests.length})
                        </h2>
                        <div className="space-y-3">
                            {sentRequests.map((request) => (
                                <div
                                    key={request._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                                            {request.friend.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{request.friend.name}</p>
                                            <p className="text-sm text-gray-600">{request.friend.email}</p>
                                            <p className="text-xs text-gray-500">Pending</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleRemoveFriend(request._id)}
                                        className="border-red-500 text-red-500 hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Cancel
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Accepted Friends */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        My Friends ({acceptedFriends.length})
                    </h2>
                    {acceptedFriends.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No friends yet. Add some friends to get started!</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {acceptedFriends.map((friend) => (
                                <div
                                    key={friend._id}
                                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                            {friend.friend.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{friend.friend.name}</p>
                                            <p className="text-sm text-gray-600">{friend.friend.email}</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleRemoveFriend(friend._id)}
                                        className="border-red-500 text-red-500 hover:bg-red-50"
                                    >
                                        <UserX className="w-4 h-4 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
