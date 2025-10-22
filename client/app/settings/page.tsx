'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userApi } from '@/lib/api';
import { Trash2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Friend {
    _id: string;
    userId?: string;
    name: string;
    email: string;
    phone?: string;
    university?: string;
    batch?: string;
    hostel?: string;
    address?: string;
    notes?: string;
    addedAt?: string;
}

export default function SettingsPage() {
    const { isAuthenticated, isHydrated, user } = useAuthStore();
    const router = useRouter();

    // Profile
    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [monthlyBudget, setMonthlyBudget] = useState('');
    const [income, setIncome] = useState('');

    // Friends
    const [friends, setFriends] = useState<Friend[]>([]);
    const [showAddFriend, setShowAddFriend] = useState(false);

    // Add friend form
    const [friendName, setFriendName] = useState('');
    const [friendEmail, setFriendEmail] = useState('');
    const [friendPhone, setFriendPhone] = useState('');
    const [friendUniversity, setFriendUniversity] = useState('');
    const [friendBatch, setFriendBatch] = useState('');
    const [friendHostel, setFriendHostel] = useState('');
    const [friendAddress, setFriendAddress] = useState('');
    const [friendNotes, setFriendNotes] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isHydrated) return; // Wait for store to hydrate

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Fetch profile and friends
        const loadData = async () => {
            await fetchProfile();
            await fetchFriends();
        };
        loadData();
    }, [isAuthenticated, isHydrated, router]);

    const fetchProfile = async () => {
        try {
            if (!user?.id) return;
            const res = await userApi.getUser(user.id);
            const profile = res.data;
            setName(profile.name || '');
            setCurrency(profile.currency || 'INR');
            setMonthlyBudget(profile.monthlyBudget?.toString() || '');
            setIncome(profile.income?.toString() || '');
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Fallback to authStore user data if fetch fails
            if (user) {
                setName(user.name || '');
                setCurrency(user.currency || 'INR');
                setMonthlyBudget(user.monthlyBudget?.toString() || '');
                setIncome(user.income?.toString() || '');
            }
        }
    };

    const fetchFriends = async () => {
        try {
            setLoading(true);
            const res = await userApi.getFriends();
            setFriends(res.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            await userApi.updateProfile({
                name,
                currency,
                monthlyBudget: monthlyBudget ? parseFloat(monthlyBudget) : undefined,
                income: income ? parseFloat(income) : undefined,
            });
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleAddFriend = async () => {
        try {
            const friendData: {
                email: string;
                name: string;
                phone?: string;
                university?: string;
                batch?: string;
                hostel?: string;
                address?: string;
                notes?: string;
            } = {
                email: friendEmail,
                name: friendName,
            };

            // Add optional fields if provided
            if (friendPhone) friendData.phone = friendPhone;
            if (friendUniversity) friendData.university = friendUniversity;
            if (friendBatch) friendData.batch = friendBatch;
            if (friendHostel) friendData.hostel = friendHostel;
            if (friendAddress) friendData.address = friendAddress;
            if (friendNotes) friendData.notes = friendNotes;

            await userApi.addFriend(friendData);
            toast.success('Friend added successfully!');

            // Reset form
            setShowAddFriend(false);
            setFriendName('');
            setFriendEmail('');
            setFriendPhone('');
            setFriendUniversity('');
            setFriendBatch('');
            setFriendHostel('');
            setFriendAddress('');
            setFriendNotes('');

            fetchFriends();
        } catch (error: unknown) {
            console.error('Error adding friend:', error);
            toast.error('Failed to add friend. They may already be in your friends list.');
        }
    }; const handleRemoveFriend = async (friendId: string) => {
        if (!confirm('Are you sure you want to remove this friend?')) return;

        try {
            await userApi.removeFriend(friendId);
            toast.success('Friend removed successfully!');
            fetchFriends();
        } catch (error) {
            console.error('Error removing friend:', error);
            toast.error('Failed to remove friend');
        }
    };

    if (!isHydrated || !isAuthenticated) return null;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Settings</h1>

                <div className="space-y-6">
                    {/* Profile Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your account details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={user?.email} disabled />
                            </div>
                            <div>
                                <Label htmlFor="income">Monthly Income (₹)</Label>
                                <Input
                                    id="income"
                                    type="number"
                                    value={income}
                                    onChange={(e) => setIncome(e.target.value)}
                                    placeholder="Optional"
                                />
                            </div>
                            <Button onClick={handleSaveProfile} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Currency & Budget */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Currency & Budget</CardTitle>
                            <CardDescription>Manage your financial preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="currency">Preferred Currency</Label>
                                <select
                                    id="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                                >
                                    <option value="INR">INR (₹)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="budget">Monthly Budget Limit (₹)</Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    value={monthlyBudget}
                                    onChange={(e) => setMonthlyBudget(e.target.value)}
                                    placeholder="Optional"
                                />
                            </div>
                            <Button onClick={handleSaveProfile} disabled={saving}>
                                {saving ? 'Saving...' : 'Update Settings'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Friends Management */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Friends</CardTitle>
                                    <CardDescription>Manage your friends for easy bill splitting</CardDescription>
                                </div>
                                <Button onClick={() => setShowAddFriend(!showAddFriend)} variant="outline" size="sm">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add Friend
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Add Friend Section */}
                            {showAddFriend && (
                                <div className="mb-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                                    <div className="space-y-3">
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">Add friend details</p>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label htmlFor="friendName">Name *</Label>
                                                <Input
                                                    id="friendName"
                                                    placeholder="John Doe"
                                                    value={friendName}
                                                    onChange={(e) => setFriendName(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="friendEmail">Email *</Label>
                                                <Input
                                                    id="friendEmail"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={friendEmail}
                                                    onChange={(e) => setFriendEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label htmlFor="friendPhone">Phone</Label>
                                                <Input
                                                    id="friendPhone"
                                                    placeholder="+91 9876543210"
                                                    value={friendPhone}
                                                    onChange={(e) => setFriendPhone(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="friendUniversity">University</Label>
                                                <Input
                                                    id="friendUniversity"
                                                    placeholder="e.g., IIT Delhi"
                                                    value={friendUniversity}
                                                    onChange={(e) => setFriendUniversity(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label htmlFor="friendBatch">Batch/Year</Label>
                                                <Input
                                                    id="friendBatch"
                                                    placeholder="e.g., 2023"
                                                    value={friendBatch}
                                                    onChange={(e) => setFriendBatch(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="friendHostel">Hostel/Room</Label>
                                                <Input
                                                    id="friendHostel"
                                                    placeholder="e.g., Hostel 5, Room 201"
                                                    value={friendHostel}
                                                    onChange={(e) => setFriendHostel(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="friendAddress">Address</Label>
                                            <Input
                                                id="friendAddress"
                                                placeholder="Full address"
                                                value={friendAddress}
                                                onChange={(e) => setFriendAddress(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="friendNotes">Notes</Label>
                                            <textarea
                                                id="friendNotes"
                                                placeholder="Any additional notes..."
                                                value={friendNotes}
                                                onChange={(e) => setFriendNotes(e.target.value)}
                                                className="flex min-h-[60px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                                            />
                                        </div>

                                        <Button
                                            onClick={() => handleAddFriend()}
                                            className="w-full"
                                            disabled={!friendName || !friendEmail}
                                        >
                                            Add Friend
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Friends List */}
                            <div className="space-y-3">
                                {friends.length > 0 ? (
                                    friends.map((friend) => (
                                        <Card key={friend._id} className="border border-zinc-200 dark:border-zinc-800">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                                {friend.name}
                                                            </h3>
                                                            {friend.userId && (
                                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                                                    Registered User
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1 text-sm">
                                                            <p className="text-zinc-600 dark:text-zinc-400">
                                                                📧 {friend.email}
                                                            </p>
                                                            {friend.phone && (
                                                                <p className="text-zinc-600 dark:text-zinc-400">
                                                                    📱 {friend.phone}
                                                                </p>
                                                            )}
                                                            {friend.university && (
                                                                <p className="text-zinc-600 dark:text-zinc-400">
                                                                    🎓 {friend.university}
                                                                    {friend.batch && ` - ${friend.batch}`}
                                                                </p>
                                                            )}
                                                            {friend.hostel && (
                                                                <p className="text-zinc-600 dark:text-zinc-400">
                                                                    🏠 {friend.hostel}
                                                                </p>
                                                            )}
                                                            {friend.address && (
                                                                <p className="text-zinc-600 dark:text-zinc-400">
                                                                    📍 {friend.address}
                                                                </p>
                                                            )}
                                                            {friend.notes && (
                                                                <p className="text-zinc-500 dark:text-zinc-500 italic mt-2">
                                                                    Note: {friend.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleRemoveFriend(friend._id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 ml-4"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="py-8 text-center text-zinc-500">
                                        No friends added yet. Click &ldquo;Add Friend&rdquo; to get started!
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
