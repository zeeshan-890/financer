'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userApi } from '@/lib/api';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { isAuthenticated, isHydrated, user } = useAuthStore();
    const router = useRouter();

    // Profile
    const [name, setName] = useState('');
    const [currency, setCurrency] = useState('PKR');
    const [monthlyBudget, setMonthlyBudget] = useState('');
    const [income, setIncome] = useState('');
    const [hideBalanceByDefault, setHideBalanceByDefault] = useState(false);
    const [hasBalancePin, setHasBalancePin] = useState(false);

    // PIN Management
    const [showPinSection, setShowPinSection] = useState(false);
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [showCurrentPin, setShowCurrentPin] = useState(false);
    const [showNewPin, setShowNewPin] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isHydrated) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        fetchProfile();
    }, [isAuthenticated, isHydrated, router]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            if (!user?.id) return;
            const res = await userApi.getUser(user.id);
            const profile = res.data;
            setName(profile.name || '');
            setCurrency(profile.currency || 'PKR');
            setMonthlyBudget(profile.monthlyBudget?.toString() || '');
            setIncome(profile.income?.toString() || '');
            setHideBalanceByDefault(profile.hideBalanceByDefault || false);
            setHasBalancePin(profile.hasBalancePin || false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (user) {
                setName(user.name || '');
                setCurrency('PKR');
            }
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
                hideBalanceByDefault
            });
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleSetPin = async () => {
        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
            toast.error('PIN must be a 4-digit number');
            return;
        }

        if (newPin !== confirmPin) {
            toast.error('PINs do not match');
            return;
        }

        if (hasBalancePin && !currentPin) {
            toast.error('Please enter your current PIN');
            return;
        }

        try {
            await userApi.setBalancePin({
                pin: newPin,
                currentPin: hasBalancePin ? currentPin : undefined
            });
            toast.success('PIN set successfully!');
            setShowPinSection(false);
            setCurrentPin('');
            setNewPin('');
            setConfirmPin('');
            setHasBalancePin(true);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                : 'Failed to set PIN';
            toast.error(errorMessage || 'Failed to set PIN');
        }
    };

    const handleRemovePin = async () => {
        if (!confirm('Are you sure you want to remove your balance PIN?')) return;

        if (!currentPin) {
            toast.error('Please enter your current PIN');
            return;
        }

        try {
            await userApi.removeBalancePin({ currentPin });
            toast.success('PIN removed successfully!');
            setHasBalancePin(false);
            setCurrentPin('');
            setShowPinSection(false);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error && 'response' in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                : 'Failed to remove PIN';
            toast.error(errorMessage || 'Failed to remove PIN');
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
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-6">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-6 text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">Settings</h1>

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
                                <Label htmlFor="income">Monthly Income (PKR)</Label>
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
                                    <option value="PKR">PKR (Rs)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="INR">INR (₹)</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="budget">Monthly Budget Limit (PKR)</Label>
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

                    {/* Balance Privacy Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Balance Privacy
                            </CardTitle>
                            <CardDescription>Protect your balance information with a PIN</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="hideBalance"
                                    checked={hideBalanceByDefault}
                                    onChange={(e) => setHideBalanceByDefault(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="hideBalance" className="cursor-pointer">
                                    Hide balance by default (requires PIN to view)
                                </Label>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-medium">Balance PIN</p>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            {hasBalancePin ? 'PIN is set' : 'No PIN set'}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowPinSection(!showPinSection)}
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        {hasBalancePin ? 'Change PIN' : 'Set PIN'}
                                    </Button>
                                </div>

                                {showPinSection && (
                                    <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                                        {hasBalancePin && (
                                            <div>
                                                <Label htmlFor="currentPin">Current PIN</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="currentPin"
                                                        type={showCurrentPin ? 'text' : 'password'}
                                                        value={currentPin}
                                                        onChange={(e) => setCurrentPin(e.target.value)}
                                                        placeholder="Enter current PIN"
                                                        maxLength={4}
                                                        className="pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPin(!showCurrentPin)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                                    >
                                                        {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <Label htmlFor="newPin">New PIN (4 digits)</Label>
                                            <div className="relative">
                                                <Input
                                                    id="newPin"
                                                    type={showNewPin ? 'text' : 'password'}
                                                    value={newPin}
                                                    onChange={(e) => setNewPin(e.target.value)}
                                                    placeholder="Enter new PIN"
                                                    maxLength={4}
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPin(!showNewPin)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                                                >
                                                    {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="confirmPin">Confirm PIN</Label>
                                            <Input
                                                id="confirmPin"
                                                type="password"
                                                value={confirmPin}
                                                onChange={(e) => setConfirmPin(e.target.value)}
                                                placeholder="Confirm new PIN"
                                                maxLength={4}
                                            />
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button onClick={handleSetPin} className="flex-1">
                                                {hasBalancePin ? 'Update PIN' : 'Set PIN'}
                                            </Button>
                                            {hasBalancePin && (
                                                <Button
                                                    variant="outline"
                                                    onClick={handleRemovePin}
                                                    className="border-red-500 text-red-500 hover:bg-red-50"
                                                >
                                                    Remove PIN
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button onClick={handleSaveProfile} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Privacy Settings'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
