'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Activity,
    Globe,
    Monitor,
    Smartphone,
    Clock,
    AlertCircle,
    TrendingUp,
    Users,
    Filter,
    Download,
    RefreshCw
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 
    (typeof window !== 'undefined' && window.location.origin ? 
    `${window.location.origin}/api` : 'http://localhost:5000/api');

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [logsLoading, setLogsLoading] = useState(false);
    
    // Filters
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [methodFilter, setMethodFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [ipFilter, setIpFilter] = useState('');
    const [urlFilter, setUrlFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchStats();
        fetchLogs();
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [page, methodFilter, statusFilter, ipFilter, urlFilter]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/admin/stats`);
            setStats(res.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLogs = async () => {
        try {
            setLogsLoading(true);
            const params: any = { page, limit: 50 };
            if (methodFilter) params.method = methodFilter;
            if (statusFilter) params.status = statusFilter;
            if (ipFilter) params.ip = ipFilter;
            if (urlFilter) params.url = urlFilter;

            const res = await axios.get(`${API_URL}/admin/logs`, { params });
            setLogs(res.data.logs);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLogsLoading(false);
        }
    };

    const clearFilters = () => {
        setMethodFilter('');
        setStatusFilter('');
        setIpFilter('');
        setUrlFilter('');
        setPage(1);
    };

    const getStatusColor = (status: number) => {
        if (status < 300) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
        if (status < 400) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
        if (status < 500) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    };

    const getMethodColor = (method: string) => {
        const colors: any = {
            GET: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
            POST: 'text-green-600 bg-green-50 dark:bg-green-900/20',
            PUT: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
            DELETE: 'text-red-600 bg-red-50 dark:bg-red-900/20',
            PATCH: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
        };
        return colors[method] || 'text-zinc-600 bg-zinc-50 dark:bg-zinc-900/20';
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-zinc-600 dark:text-zinc-400">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">Admin Dashboard</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Monitor all requests and system analytics</p>
                    </div>
                    <Button onClick={fetchStats} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription className="flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Total Requests
                            </CardDescription>
                            <CardTitle className="text-2xl">{stats?.overview?.totalRequests?.toLocaleString() || 0}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-zinc-500">
                                Last 24h: {stats?.overview?.requests24h?.toLocaleString() || 0}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Error Rate
                            </CardDescription>
                            <CardTitle className="text-2xl text-red-600">{stats?.overview?.errorRate || 0}%</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-zinc-500">
                                4xx & 5xx errors
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Avg Response Time
                            </CardDescription>
                            <CardTitle className="text-2xl">{stats?.overview?.avgResponseTime || 0}ms</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-zinc-500">
                                All endpoints
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Unique Users
                            </CardDescription>
                            <CardTitle className="text-2xl">{stats?.overview?.uniqueUsers || 0}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-zinc-500">
                                Authenticated requests
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Browser Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Browser Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {stats?.browserStats?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{item._id}</span>
                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                            {item.count.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* OS Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Monitor className="h-5 w-5" />
                                Operating System
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {stats?.osStats?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{item._id}</span>
                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                            {item.count.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Device Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5" />
                                Device Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {stats?.deviceStats?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{item._id}</span>
                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                            {item.count.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Endpoints */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Top Endpoints
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {stats?.topEndpoints?.slice(0, 10).map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between gap-2">
                                        <span className="text-xs text-zinc-700 dark:text-zinc-300 truncate flex-1">
                                            {item._id}
                                        </span>
                                        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                                            {item.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Request Logs Section */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle>Request Logs</CardTitle>
                                <CardDescription>Detailed logs of all requests</CardDescription>
                            </div>
                            <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Filters
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        {showFilters && (
                            <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div>
                                        <Label htmlFor="method">Method</Label>
                                        <select
                                            id="method"
                                            value={methodFilter}
                                            onChange={(e) => setMethodFilter(e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                                        >
                                            <option value="">All Methods</option>
                                            <option value="GET">GET</option>
                                            <option value="POST">POST</option>
                                            <option value="PUT">PUT</option>
                                            <option value="DELETE">DELETE</option>
                                            <option value="PATCH">PATCH</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Input
                                            id="status"
                                            placeholder="e.g., 200, 404"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="ip">IP Address</Label>
                                        <Input
                                            id="ip"
                                            placeholder="e.g., 192.168"
                                            value={ipFilter}
                                            onChange={(e) => setIpFilter(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="url">URL Pattern</Label>
                                        <Input
                                            id="url"
                                            placeholder="e.g., /api/auth"
                                            value={urlFilter}
                                            onChange={(e) => setUrlFilter(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button onClick={clearFilters} variant="outline" size="sm" className="mt-3">
                                    Clear Filters
                                </Button>
                            </div>
                        )}

                        {/* Logs Table */}
                        <div className="overflow-x-auto">
                            {logsLoading ? (
                                <div className="text-center py-8">
                                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                                    <p className="text-sm text-zinc-500">Loading logs...</p>
                                </div>
                            ) : logs.length === 0 ? (
                                <p className="text-center py-8 text-zinc-500">No logs found</p>
                            ) : (
                                <div className="space-y-2">
                                    {logs.map((log) => (
                                        <div
                                            key={log._id}
                                            className="p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(log.method)}`}>
                                                            {log.method}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(log.statusCode)}`}>
                                                            {log.statusCode}
                                                        </span>
                                                        <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono break-all">
                                                            {log.url}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 flex-wrap text-xs text-zinc-500 dark:text-zinc-400">
                                                        <span className="flex items-center gap-1">
                                                            <Globe className="h-3 w-3" />
                                                            {log.ip}
                                                        </span>
                                                        <span>{log.browser}</span>
                                                        <span>{log.os}</span>
                                                        <span>{log.device}</span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {log.responseTime}ms
                                                        </span>
                                                    </div>
                                                    {log.userId && (
                                                        <div className="text-xs text-blue-600 dark:text-blue-400">
                                                            User: {log.userId.name} ({log.userId.email})
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-zinc-500 dark:text-zinc-400 text-right">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <Button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    variant="outline"
                                    size="sm"
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    variant="outline"
                                    size="sm"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
