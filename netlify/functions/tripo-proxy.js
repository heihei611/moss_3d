// Netlify Serverless Function - Tripo AI 代理
// 文件位置：netlify/functions/tripo-proxy.js

const https = require('https');

const TRIPO_API_KEY = process.env.TRIPO_API_KEY || 'tsk_1hogTAujjDaKOQKdvI8WfU6xbMQrjyaikT2Jzr4Frmj';

// 简单的速率限制（防止滥用）
const requestCounts = new Map();
const RATE_LIMIT = 100; // 每小时最多100次请求
const RATE_WINDOW = 60 * 60 * 1000; // 1小时

function checkRateLimit(ip) {
    const now = Date.now();
    const record = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_WINDOW };
    
    if (now > record.resetTime) {
        record.count = 0;
        record.resetTime = now + RATE_WINDOW;
    }
    
    record.count++;
    requestCounts.set(ip, record);
    
    return record.count <= RATE_LIMIT;
}

exports.handler = async (event, context) => {
    // 设置CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };

    // 处理预检请求
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // 简单速率限制检查
        const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
        if (!checkRateLimit(clientIP)) {
            console.log(`⚠️ 速率限制：IP ${clientIP} 超过限制`);
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ 
                    error: 'Too Many Requests',
                    message: '请求过于频繁，请稍后再试'
                })
            };
        }

        // 解析路径
        const path = event.path.replace('/.netlify/functions/tripo-proxy', '');
        const tripoUrl = `https://api.tripo3d.ai/v2/openapi${path}`;
        
        console.log(`[${new Date().toISOString()}] ${event.httpMethod} ${path} - IP: ${clientIP}`);

        // 转发请求到Tripo AI
        const response = await new Promise((resolve, reject) => {
            const options = {
                method: event.httpMethod,
                headers: {
                    'Authorization': `Bearer ${TRIPO_API_KEY}`,
                    'Content-Type': event.headers['content-type'] || 'application/json'
                }
            };

            const req = https.request(tripoUrl, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    console.log(`  ← 状态码: ${res.statusCode}`);
                    resolve({
                        statusCode: res.statusCode,
                        data: data,
                        contentType: res.headers['content-type']
                    });
                });
            });

            req.on('error', reject);

            if (event.body) {
                req.write(event.body);
            }
            req.end();
        });

        return {
            statusCode: response.statusCode,
            headers: {
                ...headers,
                'Content-Type': response.contentType || 'application/json'
            },
            body: response.data
        };

    } catch (error) {
        console.error('代理请求失败:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: error.message,
                message: '代理服务器错误'
            })
        };
    }
};
