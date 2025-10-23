const RequestLog = require('../models/RequestLog');

const parseUserAgent = (userAgent) => {
    if (!userAgent) return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };

    let browser = 'Unknown';
    let os = 'Unknown';
    let device = 'Desktop';

    // Detect Browser
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Edg')) browser = 'Edge';
    else if (userAgent.includes('Opera') || userAgent.includes('OPR')) browser = 'Opera';

    // Detect OS
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac OS')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

    // Detect Device
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) device = 'Mobile';
    else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) device = 'Tablet';

    return { browser, os, device };
};

const requestLogger = async (req, res, next) => {
    const start = Date.now();

    // Store original methods
    const originalSend = res.send;
    const originalJson = res.json;

    // Override send to capture response
    res.send = function (body) {
        res.send = originalSend;
        logRequest(req, res, start, body);
        return res.send(body);
    };

    res.json = function (body) {
        res.json = originalJson;
        logRequest(req, res, start, body);
        return res.json(body);
    };

    next();
};

const logRequest = async (req, res, start, body) => {
    try {
        const responseTime = Date.now() - start;
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
        const userAgent = req.headers['user-agent'] || '';
        const { browser, os, device } = parseUserAgent(userAgent);

        const logData = {
            method: req.method,
            url: req.originalUrl || req.url,
            statusCode: res.statusCode,
            ip: ip.replace('::ffff:', ''), // Clean IPv6 prefix
            userAgent,
            browser,
            os,
            device,
            referrer: req.headers.referer || req.headers.referrer || '',
            responseTime,
            userId: req.user?.id || null,
            error: res.statusCode >= 400 ? (typeof body === 'string' ? body : JSON.stringify(body)) : null,
            timestamp: new Date()
        };

        await RequestLog.create(logData);
    } catch (error) {
        console.error('Error logging request:', error);
    }
};

module.exports = requestLogger;
