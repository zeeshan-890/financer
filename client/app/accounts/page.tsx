'use client';

import { useState, useEffect } from 'react';
import { bankAccountApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Building2, Plus, Trash2, Star, Edit2, X } from 'lucide-react';

interface BankAccount {
    _id: string;
    accountType: 'easypaisa' | 'jazzcash' | 'bank';
    accountName: string;
    accountNumber: string;
    bankName?: string;
    isDefault: boolean;
    createdAt: string;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        accountType: 'easypaisa',
        accountName: '',
        accountNumber: '',
        bankName: '',
        isDefault: false
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await bankAccountApi.getAll();
            setAccounts(response.data);
        } catch (err) {
            console.error('Error fetching accounts:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (editingAccount) {
                await bankAccountApi.update(editingAccount._id, formData);
                setSuccess('Account updated successfully!');
            } else {
                await bankAccountApi.create(formData);
                setSuccess('Account added successfully!');
            }
            fetchAccounts();
            handleCloseModal();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error && 'response' in err
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                : 'Failed to save account';
            setError(errorMessage || 'Failed to save account');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this account?')) return;

        try {
            await bankAccountApi.delete(id);
            setSuccess('Account deleted successfully');
            fetchAccounts();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error && 'response' in err
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                : 'Failed to delete account';
            setError(errorMessage || 'Failed to delete account');
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await bankAccountApi.setDefault(id);
            setSuccess('Default account updated');
            fetchAccounts();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error && 'response' in err
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                : 'Failed to set default account';
            setError(errorMessage || 'Failed to set default account');
        }
    };

    const handleEdit = (account: BankAccount) => {
        setEditingAccount(account);
        setFormData({
            accountType: account.accountType,
            accountName: account.accountName,
            accountNumber: account.accountNumber,
            bankName: account.bankName || '',
            isDefault: account.isDefault
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAccount(null);
        setFormData({
            accountType: 'easypaisa',
            accountName: '',
            accountNumber: '',
            bankName: '',
            isDefault: false
        });
    };

    const getAccountTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            easypaisa: '📱',
            jazzcash: '💳',
            bank: '🏦'
        };
        return icons[type] || '💰';
    };

    const getAccountTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            easypaisa: 'Easypaisa',
            jazzcash: 'JazzCash',
            bank: 'Bank Account'
        };
        return labels[type] || type;
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Bank Accounts</h1>
                        <p className="text-gray-600 mt-1">Manage your payment accounts for group expenses</p>
                    </div>
                    <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Account
                    </Button>
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

                {/* Accounts List */}
                {accounts.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No accounts yet</h3>
                        <p className="text-gray-600 mb-4">Add your first payment account to start managing group expenses</p>
                        <Button onClick={() => setShowModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Account
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {accounts.map((account) => (
                            <Card key={account._id} className="p-6 relative hover:shadow-lg transition-shadow">
                                {account.isDefault && (
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current" />
                                            Default
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3 mb-4">
                                    <div className="text-4xl">{getAccountTypeIcon(account.accountType)}</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{account.accountName}</h3>
                                        <p className="text-sm text-gray-600">{getAccountTypeLabel(account.accountType)}</p>
                                        {account.bankName && (
                                            <p className="text-xs text-gray-500 mt-1">{account.bankName}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <p className="text-xs text-gray-600 mb-1">Account Number</p>
                                    <p className="font-mono font-semibold text-gray-900">{account.accountNumber}</p>
                                </div>

                                <div className="flex gap-2">
                                    {!account.isDefault && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleSetDefault(account._id)}
                                            className="flex-1"
                                        >
                                            <Star className="w-3 h-3 mr-1" />
                                            Set Default
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(account)}
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDelete(account._id)}
                                        className="border-red-500 text-red-500 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">
                                    {editingAccount ? 'Edit Account' : 'Add New Account'}
                                </h2>
                                <Button size="sm" variant="outline" onClick={handleCloseModal}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label>Account Type</Label>
                                    <select
                                        value={formData.accountType}
                                        onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    >
                                        <option value="easypaisa">Easypaisa</option>
                                        <option value="jazzcash">JazzCash</option>
                                        <option value="bank">Bank Account</option>
                                    </select>
                                </div>

                                <div>
                                    <Label>Account Name</Label>
                                    <Input
                                        type="text"
                                        value={formData.accountName}
                                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                                        placeholder="e.g., My Easypaisa Account"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>Account Number</Label>
                                    <Input
                                        type="text"
                                        value={formData.accountNumber}
                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                        placeholder="Enter account number"
                                        required
                                    />
                                </div>

                                {formData.accountType === 'bank' && (
                                    <div>
                                        <Label>Bank Name</Label>
                                        <Input
                                            type="text"
                                            value={formData.bankName}
                                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                            placeholder="e.g., HBL, Meezan Bank"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        checked={formData.isDefault}
                                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <Label htmlFor="isDefault" className="cursor-pointer">
                                        Set as default account
                                    </Label>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading} className="flex-1">
                                        {loading ? 'Saving...' : editingAccount ? 'Update' : 'Add Account'}
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
