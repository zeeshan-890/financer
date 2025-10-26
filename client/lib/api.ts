import axios from 'axios';

// Use relative path for API when hosted on same server, or full URL in development
const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/api` : 'http://localhost:5000/api');

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface Member {
    userId: string;
    name: string;
    email: string;
}

interface SplitBetween {
    userId: string;
    name: string;
    email: string;
    amount: number;
}

interface TransactionData {
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date?: Date;
    notes?: string;
    isGroupExpense?: boolean;
    groupId?: string;
    splitBetween?: SplitBetween[];
}

// Auth API
export const authApi = {
    register: (data: { name: string; email: string; password: string }) =>
        api.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    verifyOTP: (data: { email: string; otp: string }) =>
        api.post('/auth/verify-otp', data),
    resendOTP: (data: { email: string }) =>
        api.post('/auth/resend-otp', data),
};

// User API
export const userApi = {
    getUser: (id: string) => api.get(`/users/${id}`),
    updateProfile: (data: { name?: string; currency?: string; monthlyBudget?: number; income?: number; hideBalanceByDefault?: boolean }) =>
        api.put('/users/profile', data),
    searchUsers: (query: string) => api.get(`/users/search?query=${query}`),
    // Balance PIN
    setBalancePin: (data: { pin: string; currentPin?: string }) =>
        api.post('/users/balance-pin', data),
    verifyBalancePin: (data: { pin: string }) =>
        api.post('/users/balance-pin/verify', data),
    removeBalancePin: (data: { currentPin: string }) =>
        api.delete('/users/balance-pin', { data }),
};

// Friend API
export const friendApi = {
    getAll: () => api.get('/friends'),
    sendRequest: (data: { email: string }) => api.post('/friends', data),
    addManual: (data: { name: string; email: string }) => api.post('/friends/manual', data),
    acceptRequest: (id: string) => api.put(`/friends/${id}/accept`),
    remove: (id: string) => api.delete(`/friends/${id}`),
    searchUsers: (email: string) => api.get(`/friends/search?email=${email}`),
};

// Bank Account API
export const bankAccountApi = {
    getAll: () => api.get('/bank-accounts'),
    create: (data: { accountType: string; accountName: string; accountNumber: string; bankName?: string; isDefault?: boolean }) =>
        api.post('/bank-accounts', data),
    update: (id: string, data: { accountType?: string; accountName?: string; accountNumber?: string; bankName?: string; isDefault?: boolean }) =>
        api.put(`/bank-accounts/${id}`, data),
    delete: (id: string) => api.delete(`/bank-accounts/${id}`),
    setDefault: (id: string) => api.put(`/bank-accounts/${id}/default`),
};

// Reserved Money API
export const reservedMoneyApi = {
    getAll: () => api.get('/reserved-money'),
    create: (data: { amount: number; reason: string; recipientName: string; dueDate?: Date; notes?: string }) =>
        api.post('/reserved-money', data),
    update: (id: string, data: { amount?: number; reason?: string; recipientName?: string; dueDate?: Date; notes?: string; status?: string }) =>
        api.put(`/reserved-money/${id}`, data),
    markAsPaid: (id: string) => api.put(`/reserved-money/${id}/paid`),
    delete: (id: string) => api.delete(`/reserved-money/${id}`),
    getTotal: () => api.get('/reserved-money/total'),
};

// Group API
export const groupApi = {
    createGroup: (data: { name: string; members: Member[] }) =>
        api.post('/groups', data),
    getGroup: (id: string) => api.get(`/groups/${id}`),
    getAll: () => api.get('/groups'),
    getAllGroups: () => api.get('/groups'),
    addMember: (groupId: string, member: Member) =>
        api.post(`/groups/${groupId}/members`, member),
    removeMember: (groupId: string, memberId: string) =>
        api.delete(`/groups/${groupId}/members/${memberId}`),
};

// Transaction API
export const transactionApi = {
    addTransaction: (data: TransactionData | Record<string, unknown>) => api.post('/transactions', data),
    create: (data: TransactionData) => api.post('/transactions', data),
    getAllTransactions: (filters?: { type?: string; category?: string; startDate?: string; endDate?: string }) => {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        if (filters?.category) params.append('category', filters.category);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        return api.get(`/transactions?${params.toString()}`);
    },
    getAll: (filters?: { type?: string; category?: string; startDate?: string; endDate?: string }) => {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        if (filters?.category) params.append('category', filters.category);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        return api.get(`/transactions?${params.toString()}`);
    },
    getStats: () => api.get('/transactions/stats'),
    updatePaymentStatus: (id: string, data: { userId: string; status: string }) =>
        api.patch(`/transactions/${id}/payment-status`, data),
    updatePayment: (id: string, data: { userId: string; status: string }) =>
        api.patch(`/transactions/${id}/pay`, data),
    delete: (id: string) => api.delete(`/transactions/${id}`),
};

// Goal API
export const goalApi = {
    create: (data: { title: string; targetAmount: number; deadline?: Date }) =>
        api.post('/goals', data),
    getAll: () => api.get('/goals'),
    getGoals: (userId: string) => api.get(`/goals/${userId}`),
    updateGoal: (id: string, data: { savedAmount?: number; status?: string }) =>
        api.patch(`/goals/${id}`, data),
    addFunds: (id: string, data: { amount: number; note?: string }) =>
        api.patch(`/goals/${id}/add-funds`, data),
    deleteGoal: (id: string) => api.delete(`/goals/${id}`),
};

// Reminder API
export const reminderApi = {
    send: (data?: { reminderId?: string }) => api.post('/reminders/send', data),
};