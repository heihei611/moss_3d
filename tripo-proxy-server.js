// Tripo AI 代理服务器 - 解决CORS跨域问题
// 使用方法：node tripo-proxy-server.js

const http = require('http');
const https = require('https');

const PORT = 3000;
const TRIPO_API_KEY = 'tsk_H6syaytV6_1zfnIw1DyxM27r6MyHeuQYVMoxq7G-eB7'; // 👈 在这里填写你的API密钥

const server = http.createServer((req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 解析请求路径
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const tripoPath = url.pathname.replace('/api', '');
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${tripoPath}`);

    // 收集请求体数据
    let body = [];
    req.on('data', chunk => body.push(chunk));
    req.on('end', () => {
        const requestData = Buffer.concat(body);
        
        // 构建Tripo API请求
        const options = {
            hostname: 'api.tripo3d.ai',
            path: `/v2/openapi${tripoPath}`,
            method: req.method,
            headers: {
                'Authorization': `Bearer ${TRIPO_API_KEY}`,
                'Content-Type': req.headers['content-type'] || 'application/json',
                'Content-Length': requestData.length
            }
        };

        // 转发请求到Tripo AI
        const proxyReq = https.request(options, (proxyRes) => {
            console.log(`  ← 状态码: ${proxyRes.statusCode}`);
            
            res.writeHead(proxyRes.statusCode, {
                'Content-Type': proxyRes.headers['content-type'] || 'application/json',
                'Access-Control-Allow-Origin': '*'
            });

            proxyRes.on('data', chunk => res.write(chunk));
            proxyRes.on('end', () => res.end());
        });

        proxyReq.on('error', (error) => {
            console.error('  ✗ 代理请求失败:', error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        });

        if (requestData.length > 0) {
            proxyReq.write(requestData);
        }
        proxyReq.end();
    });
});

server.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   Tripo AI 代理服务器已启动 🚀        ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║   监听端口: http://localhost:${PORT}    ║`);
    console.log('║   API转发: api.tripo3d.ai              ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('\n✓ 现在可以在浏览器中打开 611.html 了\n');
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`\n✗ 端口 ${PORT} 已被占用！请关闭其他程序或修改PORT变量\n`);
    } else {
        console.error('\n✗ 服务器错误:', error.message, '\n');
    }
    process.exit(1);
});
