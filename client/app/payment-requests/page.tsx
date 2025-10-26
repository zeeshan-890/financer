'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Receipt, Plus, Clock, DollarSign, User, Calendar, Mail, CreditCard, FileText, Send, X, Check } from 'lucide-react';
import { bankAccountApi, paymentRequestApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    type: string;
}

interface BankAccount {
    _id: string;
    accountName: string;
    accountNumber: string;
    bankName?: string;
    accountType: string;
    isDefault?: boolean;
}

interface PaymentRequest {
    _id: string;
    friendId: string;
    friendName: string;
    friendEmail: string;
    amount: number;
    reason: string;
    dueDate?: string;
    bankAccountId?: string;
    bankAccountName?: string;
    bankAccountNumber?: string;
    reminderTiming: 'immediate' | 'custom' | 'manual';
    reminderInterval?: number; // in hours
    message: string;
    status: 'pending' | 'paid' | 'cancelled';
    createdAt: string;
    paidAt?: string;
}

export default function PaymentRequestsPage() {
    const { isAuthenticated, isHydrated, user } = useAuthStore();
    const router = useRouter();
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [loading, setLoading] = useState(true);

    // Add request modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        friendId: '',
        amount: '',
        reason: '',
        dueDate: '',
        bankAccountId: '',
        reminderTiming: 'immediate' as 'immediate' | 'custom' | 'manual',
        reminderInterval: 24, // default 24 hours (1 day)
        customMessage: '',
    });
    const [saving, setSaving] = useState(false);

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
            const [contactsRes, bankAccountsRes, requestsRes] = await Promise.all([
                fetch('/api/contacts', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                bankAccountApi.getAll(),
                paymentRequestApi.getAll(),
            ]);

            if (contactsRes.ok) {
                const contactsData = await contactsRes.json();
                setContacts(contactsData);
            }
            setBankAccounts(bankAccountsRes.data);
            setRequests(requestsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const getSelectedContact = () => {
        return contacts.find(c => c._id === formData.friendId) || null;
    };

    const getSelectedBankAccount = () => {
        return bankAccounts.find(acc => acc._id === formData.bankAccountId) || null;
    };

    const generateInvoiceMessage = () => {
        const contact = getSelectedContact();
        const bankAccount = getSelectedBankAccount();

        if (!contact || !formData.amount || !formData.reason) {
            return '';
        }

        const amount = parseFloat(formData.amount);
        const dueText = formData.dueDate
            ? `\nDue Date: ${new Date(formData.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
            : '';

        const bankText = bankAccount
            ? `\n\n💳 Payment Details:\nAccount Name: ${bankAccount.accountName}\nAccount Number: ${bankAccount.accountNumber}${bankAccount.bankName ? `\nBank: ${bankAccount.bankName}` : ''}\nAccount Type: ${bankAccount.accountType}`
            : '';

        const customText = formData.customMessage ? `\n\n📝 Note:\n${formData.customMessage}` : '';

        return `🧾 PAYMENT REQUEST INVOICE

Hi ${contact.name},

I hope this message finds you well. This is a friendly reminder about the payment due for:

📌 Reason: ${formData.reason}
💰 Amount: PKR ${amount.toLocaleString()}${dueText}${bankText}${customText}

Please make the payment at your earliest convenience. Once done, I'll mark it as paid in my records.

Thank you!
${user?.name || 'Financer User'}

---
Generated via Financer App
${new Date().toLocaleDateString('en-IN')}`;
    };

    const handleSendRequest = async () => {
        if (!formData.friendId || !formData.amount || !formData.reason) {
            toast.error('Please fill all required fields');
            return;
        }

        const amount = parseFloat(formData.amount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        const contact = getSelectedContact();
        if (!contact) {
            toast.error('Please select a contact');
            return;
        }

        try {
            setSaving(true);

            const invoice = generateInvoiceMessage();

            const requestData = {
                friendId: contact._id,
                friendName: contact.name,
                friendEmail: contact.email,
                amount,
                reason: formData.reason,
                dueDate: formData.dueDate || undefined,
                bankAccountId: formData.bankAccountId || undefined,
                reminderTiming: formData.reminderTiming,
                reminderInterval: formData.reminderTiming === 'custom' ? formData.reminderInterval : undefined,
                message: invoice,
            };

            await paymentRequestApi.create(requestData);

            if (formData.reminderTiming === 'immediate') {
                toast.success('Payment request created and sent to your friend!');
            } else {
                toast.success('Payment request created! Invoice copied to clipboard.');
                await navigator.clipboard.writeText(invoice);
            }

            // Reset form
            setShowAddModal(false);
            setFormData({
                friendId: '',
                amount: '',
                reason: '',
                dueDate: '',
                bankAccountId: '',
                reminderTiming: 'immediate',
                reminderInterval: 24,
                customMessage: '',
            });

            fetchData();
        } catch (error) {
            console.error('Error sending payment request:', error);
            toast.error('Failed to create payment request');
        } finally {
            setSaving(false);
        }
    };

    const handleMarkAsPaid = async (requestId: string) => {
        try {
            await paymentRequestApi.markAsPaid(requestId);
            toast.success('Marked as paid!');
            fetchData();
        } catch (error) {
            console.error('Error marking as paid:', error);
            toast.error('Failed to update status');
        }
    };

    const handleSendReminder = async (requestId: string) => {
        try {
            await paymentRequestApi.sendReminder(requestId);
            toast.success('Reminder sent successfully!');
            fetchData();
        } catch (error) {
            console.error('Error sending reminder:', error);
            toast.error('Failed to send reminder');
        }
    };

    const handleDeleteRequest = async (requestId: string) => {
        if (!confirm('Delete this payment request?')) return;
        try {
            await paymentRequestApi.delete(requestId);
            toast.success('Request deleted');
            fetchData();
        } catch (error) {
            console.error('Error deleting request:', error);
            toast.error('Failed to delete request');
        }
    };

    if (!isHydrated || !isAuthenticated) return null;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">Loading payment requests...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">Payment Requests</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Send payment requests with invoices to friends</p>
                    </div>
                    <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Button>
                </div>

                {requests.length > 0 ? (
                    <div className="grid gap-4">
                        {requests.map((request) => (
                            <Card key={request._id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="flex items-center gap-2">
                                                <Receipt className="h-4 w-4 text-zinc-500" />
                                                {request.reason}
                                            </CardTitle>
                                            <CardDescription className="mt-1 flex items-center gap-2">
                                                <User className="h-3 w-3" />
                                                {request.friendName} ({request.friendEmail})
                                                <span className="text-zinc-400">•</span>
                                                {new Date(request.createdAt).toLocaleDateString('en-IN')}
                                            </CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                                PKR {request.amount.toLocaleString()}
                                            </p>
                                            <span className={`inline-block px-2 py-1 mt-2 text-xs font-medium rounded-full ${request.status === 'paid'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {request.dueDate && (
                                        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                            <Calendar className="h-4 w-4" />
                                            <span>Due: {new Date(request.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                    )}

                                    {request.bankAccountName && (
                                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Payment Account</p>
                                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                {request.bankAccountName} - {request.bankAccountNumber}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2 flex-wrap">
                                        {request.status === 'pending' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleMarkAsPaid(request._id)}
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                                                >
                                                    <Check className="mr-1 h-3 w-3" />
                                                    Mark as Paid
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleSendReminder(request._id)}
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                                                >
                                                    <Send className="mr-1 h-3 w-3" />
                                                    Send Reminder
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDeleteRequest(request._id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                        >
                                            <X className="mr-1 h-3 w-3" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <Receipt className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
                            <p className="text-zinc-500 dark:text-zinc-400 mb-4">No payment requests yet</p>
                            <Button onClick={() => setShowAddModal(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Your First Request
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Add Payment Request Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                        <Card className="w-full max-w-3xl my-8 max-h-[90vh] overflow-y-auto">
                            <CardHeader>
                                <CardTitle>Create Payment Request</CardTitle>
                                <CardDescription>Send a professional invoice to request payment from a friend</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-5">
                                    {/* Select Contact */}
                                    <div>
                                        <Label htmlFor="contact">Select Contact *</Label>
                                        {contacts.length === 0 ? (
                                            <p className="text-sm text-zinc-500 mt-2">
                                                No contacts added yet. Add contacts first in Friends page.
                                            </p>
                                        ) : (
                                            <select
                                                id="contact"
                                                value={formData.friendId}
                                                onChange={(e) => setFormData({ ...formData, friendId: e.target.value })}
                                                className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Choose a contact...</option>
                                                {contacts.map((contact) => (
                                                    <option key={contact._id} value={contact._id}>
                                                        {contact.name} ({contact.email})
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <Label htmlFor="amount">Amount (PKR) *</Label>
                                        <div className="relative mt-1">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input
                                                id="amount"
                                                type="number"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                placeholder="0.00"
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div>
                                        <Label htmlFor="reason">Reason for Payment *</Label>
                                        <Input
                                            id="reason"
                                            value={formData.reason}
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                            placeholder="e.g., Borrowed money, Shared lunch bill, Event tickets"
                                        />
                                    </div>

                                    {/* Due Date */}
                                    <div>
                                        <Label htmlFor="dueDate">Due Date (Optional)</Label>
                                        <div className="relative mt-1">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input
                                                id="dueDate"
                                                type="date"
                                                value={formData.dueDate}
                                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {/* Bank Account */}
                                    <div>
                                        <Label htmlFor="bankAccount">Payment Account (Optional)</Label>
                                        {bankAccounts.length === 0 ? (
                                            <p className="text-sm text-zinc-500 mt-2">
                                                No bank accounts added. Add one in Accounts page for easier payments.
                                            </p>
                                        ) : (
                                            <select
                                                id="bankAccount"
                                                value={formData.bankAccountId}
                                                onChange={(e) => setFormData({ ...formData, bankAccountId: e.target.value })}
                                                className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Choose account (optional)...</option>
                                                {bankAccounts.map((account) => (
                                                    <option key={account._id} value={account._id}>
                                                        {account.accountName} - {account.accountNumber.slice(-4).padStart(account.accountNumber.length, '*')}
                                                        {account.isDefault ? ' (Default)' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    {/* Reminder Timing */}
                                    <div>
                                        <Label>Reminder Timing</Label>
                                        <div className="mt-2 grid grid-cols-3 gap-3">
                                            <Button
                                                type="button"
                                                variant={formData.reminderTiming === 'immediate' ? 'default' : 'outline'}
                                                onClick={() => setFormData({ ...formData, reminderTiming: 'immediate' })}
                                                className="h-auto py-3"
                                            >
                                                <div className="text-left w-full">
                                                    <div className="font-medium">Send Now</div>
                                                    <div className="text-xs opacity-80">Immediate</div>
                                                </div>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={formData.reminderTiming === 'custom' ? 'default' : 'outline'}
                                                onClick={() => setFormData({ ...formData, reminderTiming: 'custom' })}
                                                className="h-auto py-3"
                                            >
                                                <div className="text-left w-full">
                                                    <div className="font-medium">Custom Interval</div>
                                                    <div className="text-xs opacity-80">Set hours</div>
                                                </div>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={formData.reminderTiming === 'manual' ? 'default' : 'outline'}
                                                onClick={() => setFormData({ ...formData, reminderTiming: 'manual' })}
                                                className="h-auto py-3"
                                            >
                                                <div className="text-left w-full">
                                                    <div className="font-medium">Manual Only</div>
                                                    <div className="text-xs opacity-80">No auto-send</div>
                                                </div>
                                            </Button>
                                        </div>

                                        {/* Custom Interval Input */}
                                        {formData.reminderTiming === 'custom' && (
                                            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <Label htmlFor="reminderInterval" className="text-sm font-medium">
                                                    Reminder Interval (in hours)
                                                </Label>
                                                <div className="mt-2 flex items-center gap-3">
                                                    <Input
                                                        id="reminderInterval"
                                                        type="number"
                                                        min="1"
                                                        value={formData.reminderInterval}
                                                        onChange={(e) => setFormData({ ...formData, reminderInterval: parseInt(e.target.value) || 24 })}
                                                        className="w-32"
                                                    />
                                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                        hours ({(formData.reminderInterval / 24).toFixed(1)} days)
                                                    </span>
                                                </div>
                                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                                                    Reminder will be sent every {formData.reminderInterval} hours until marked as paid
                                                </p>
                                                <div className="mt-3 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                                                    <p>💡 Common intervals:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, reminderInterval: 12 })}
                                                            className="px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                        >
                                                            12h
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, reminderInterval: 24 })}
                                                            className="px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                        >
                                                            24h (1 day)
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, reminderInterval: 48 })}
                                                            className="px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                        >
                                                            48h (2 days)
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, reminderInterval: 72 })}
                                                            className="px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                        >
                                                            72h (3 days)
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, reminderInterval: 168 })}
                                                            className="px-2 py-1 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                                        >
                                                            168h (1 week)
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Custom Message */}
                                    <div>
                                        <Label htmlFor="customMessage">Additional Note (Optional)</Label>
                                        <textarea
                                            id="customMessage"
                                            value={formData.customMessage}
                                            onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                                            placeholder="Add any additional context or message..."
                                            rows={3}
                                            className="mt-1 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Invoice Preview */}
                                    {formData.friendId && formData.amount && formData.reason && (
                                        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-5">
                                            <Label className="flex items-center gap-2 mb-2">
                                                <FileText className="h-4 w-4" />
                                                Invoice Preview
                                            </Label>
                                            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800">
                                                <pre className="text-xs whitespace-pre-wrap font-mono text-zinc-700 dark:text-zinc-300">
                                                    {generateInvoiceMessage()}
                                                </pre>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setShowAddModal(false);
                                                setFormData({
                                                    friendId: '',
                                                    amount: '',
                                                    reason: '',
                                                    dueDate: '',
                                                    bankAccountId: '',
                                                    reminderTiming: 'immediate',
                                                    reminderInterval: 24,
                                                    customMessage: '',
                                                });
                                            }}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSendRequest}
                                            disabled={saving || !formData.friendId || !formData.amount || !formData.reason}
                                            className="flex-1"
                                        >
                                            <Send className="mr-2 h-4 w-4" />
                                            {saving ? 'Creating...' : 'Create & Send'}
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
