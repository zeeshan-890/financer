'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserPlus, Trash2, Edit2, Phone, Mail, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    type: 'hostel' | 'class' | 'neighbour' | 'family' | 'work' | 'other';
    notes?: string;
    createdAt: string;
}

const contactTypes = [
    { value: 'hostel', label: 'Hostel', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    { value: 'class', label: 'Class', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
    { value: 'neighbour', label: 'Neighbour', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
    { value: 'family', label: 'Family', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300' },
    { value: 'work', label: 'Work', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
    { value: 'other', label: 'Other', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' }
];

export default function FriendsPage() {
    const { isAuthenticated, isHydrated } = useAuthStore();
    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'other' as Contact['type'],
        notes: ''
    });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!isHydrated) return;
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchContacts();
    }, [isAuthenticated, isHydrated, router]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/contacts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setContacts(data);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
            toast.error('Failed to load contacts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email) {
            toast.error('Name and email are required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = editingContact ? `/api/contacts/${editingContact._id}` : '/api/contacts';
            const method = editingContact ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success(editingContact ? 'Contact updated!' : 'Contact added!');
                setShowAddModal(false);
                setEditingContact(null);
                setFormData({ name: '', email: '', phone: '', type: 'other', notes: '' });
                fetchContacts();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to save contact');
            }
        } catch (error) {
            console.error('Error saving contact:', error);
            toast.error('Failed to save contact');
        }
    };

    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
        setFormData({
            name: contact.name,
            email: contact.email,
            phone: contact.phone || '',
            type: contact.type,
            notes: contact.notes || ''
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this contact?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/contacts/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Contact deleted');
                fetchContacts();
            } else {
                toast.error('Failed to delete contact');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            toast.error('Failed to delete contact');
        }
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedContacts = contactTypes.map(type => ({
        ...type,
        contacts: filteredContacts.filter(c => c.type === type.value)
    }));

    if (!isHydrated || !isAuthenticated) return null;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">Loading contacts...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">Friends & Contacts</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Manage your contacts - {contacts.length} total
                        </p>
                    </div>
                    <Button onClick={() => {
                        setEditingContact(null);
                        setFormData({ name: '', email: '', phone: '', type: 'other', notes: '' });
                        setShowAddModal(true);
                    }}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Contact
                    </Button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <Input
                        type="text"
                        placeholder="Search by name, email, or type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                {/* Contacts by Type */}
                {groupedContacts.map(group => (
                    group.contacts.length > 0 && (
                        <Card key={group.value} className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    {group.label}
                                    <span className="text-sm font-normal text-zinc-500">({group.contacts.length})</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {group.contacts.map(contact => (
                                        <div key={contact._id} className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{contact.name}</h3>
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${group.color}`}>
                                                        {group.label}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(contact)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(contact._id)}
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate">{contact.email}</span>
                                                </div>
                                                {contact.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-3 w-3" />
                                                        <span>{contact.phone}</span>
                                                    </div>
                                                )}
                                                {contact.notes && (
                                                    <p className="text-xs mt-2 text-zinc-500 dark:text-zinc-500 italic">
                                                        {contact.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )
                ))}

                {filteredContacts.length === 0 && (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <Users className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
                            <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                                {searchQuery ? 'No contacts found' : 'No contacts yet'}
                            </p>
                            {!searchQuery && (
                                <Button onClick={() => setShowAddModal(true)}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Add Your First Contact
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Add/Edit Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>{editingContact ? 'Edit Contact' : 'Add Contact'}</CardTitle>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingContact(null);
                                            setFormData({ name: '', email: '', phone: '', type: 'other', notes: '' });
                                        }}
                                        className="h-8 w-8 p-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardDescription>Fill in the contact details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Friend's name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+92 300 1234567"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="type">Type *</Label>
                                        <select
                                            id="type"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as Contact['type'] })}
                                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                                        >
                                            {contactTypes.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Notes</Label>
                                        <textarea
                                            id="notes"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="Any additional notes..."
                                            rows={3}
                                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setShowAddModal(false);
                                                setEditingContact(null);
                                                setFormData({ name: '', email: '', phone: '', type: 'other', notes: '' });
                                            }}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="flex-1">
                                            {editingContact ? 'Update' : 'Add'} Contact
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
