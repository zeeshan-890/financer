const RequestLog = require('../models/RequestLog');
const User = require('../models/User');

// Get all request logs with pagination and filters
exports.getAllLogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            method,
            status,
            ip,
            startDate,
            endDate,
            url,
            category
        } = req.query;

        const filter = {};

        if (method) filter.method = method;
        if (status) filter.statusCode = parseInt(status);
        if (ip) filter.ip = new RegExp(ip, 'i');
        if (url) filter.url = new RegExp(url, 'i');

        // Category filter
        if (category) {
            const categoryPatterns = {
                'Authentication': /\/auth/i,
                'Transactions': /\/transaction/i,
                'Goals': /\/goal/i,
                'Groups': /\/group/i,
                'Users': /\/user/i,
                'Reminders': /\/reminder/i,
                'Admin': /\/admin/i,
                'Static': /\/_next|\.js$|\.css$|\.ico$|\.svg$|\.png$|\.jpg$/i,
                'Other': /^(?!.*\/(auth|transaction|goal|group|user|reminder|admin|_next|\.(js|css|ico|svg|png|jpg))).*$/i
            };
            if (categoryPatterns[category]) {
                filter.url = categoryPatterns[category];
            }
        }

        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        // Sort by timestamp descending (latest first)
        const logs = await RequestLog.find(filter)
            .populate('userId', 'name email')
            .sort({ timestamp: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await RequestLog.countDocuments(filter);

        res.json({
            logs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalLogs: count
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Error fetching logs' });
    }
};

// Get dashboard statistics
exports.getStats = async (req, res) => {
    try {
        const now = new Date();
        const last24h = new Date(now - 24 * 60 * 60 * 1000);
        const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const last30d = new Date(now - 30 * 24 * 60 * 60 * 1000);

        // Total requests
        const totalRequests = await RequestLog.countDocuments();
        const requests24h = await RequestLog.countDocuments({ timestamp: { $gte: last24h } });
        const requests7d = await RequestLog.countDocuments({ timestamp: { $gte: last7d } });
        const requests30d = await RequestLog.countDocuments({ timestamp: { $gte: last30d } });

        // Status code distribution
        const statusDistribution = await RequestLog.aggregate([
            {
                $group: {
                    _id: {
                        $cond: [
                            { $lt: ['$statusCode', 300] }, '2xx Success',
                            {
                                $cond: [
                                    { $lt: ['$statusCode', 400] }, '3xx Redirect',
                                    {
                                        $cond: [
                                            { $lt: ['$statusCode', 500] }, '4xx Client Error',
                                            '5xx Server Error'
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Top endpoints
        const topEndpoints = await RequestLog.aggregate([
            {
                $group: {
                    _id: '$url',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Top IPs
        const topIPs = await RequestLog.aggregate([
            {
                $group: {
                    _id: '$ip',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Browser distribution
        const browserStats = await RequestLog.aggregate([
            {
                $group: {
                    _id: '$browser',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // OS distribution
        const osStats = await RequestLog.aggregate([
            {
                $group: {
                    _id: '$os',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Device distribution
        const deviceStats = await RequestLog.aggregate([
            {
                $group: {
                    _id: '$device',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Average response time
        const avgResponseTime = await RequestLog.aggregate([
            {
                $group: {
                    _id: null,
                    avg: { $avg: '$responseTime' }
                }
            }
        ]);

        // Error rate
        const errorCount = await RequestLog.countDocuments({ statusCode: { $gte: 400 } });
        const errorRate = totalRequests > 0 ? (errorCount / totalRequests * 100).toFixed(2) : 0;

        // Requests per hour (last 24 hours)
        const requestsPerHour = await RequestLog.aggregate([
            {
                $match: { timestamp: { $gte: last24h } }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d %H:00',
                            date: '$timestamp'
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Method distribution
        const methodStats = await RequestLog.aggregate([
            {
                $group: {
                    _id: '$method',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Unique users
        const uniqueUsers = await RequestLog.distinct('userId', { userId: { $ne: null } });

        res.json({
            overview: {
                totalRequests,
                requests24h,
                requests7d,
                requests30d,
                errorRate: parseFloat(errorRate),
                avgResponseTime: avgResponseTime[0]?.avg?.toFixed(2) || 0,
                uniqueUsers: uniqueUsers.length
            },
            statusDistribution,
            topEndpoints,
            topIPs,
            browserStats,
            osStats,
            deviceStats,
            methodStats,
            requestsPerHour
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
};

// Delete old logs (cleanup)
exports.cleanupLogs = async (req, res) => {
    try {
        const { days = 30 } = req.body;
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const result = await RequestLog.deleteMany({ timestamp: { $lt: cutoffDate } });

        res.json({
            message: `Deleted logs older than ${days} days`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error cleaning up logs:', error);
        res.status(500).json({ message: 'Error cleaning up logs' });
    }
};
