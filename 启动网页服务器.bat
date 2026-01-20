@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════╗
echo ║   本地Web服务器启动器                  ║
echo ╚════════════════════════════════════════╝
echo.

:: 检查 Python
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ 使用 Python 启动HTTP服务器...
    echo ✓ 服务器地址: http://localhost:8000
    echo ✓ 按 Ctrl+C 停止服务器
    echo.
    echo 正在打开浏览器...
    timeout /t 2 >nul
    start http://localhost:8000/611.html
    python -m http.server 8000
    goto :end
)

:: 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ 使用 Node.js 启动HTTP服务器...
    echo ✓ 服务器地址: http://localhost:8000
    echo ✓ 按 Ctrl+C 停止服务器
    echo.
    echo 正在打开浏览器...
    timeout /t 2 >nul
    start http://localhost:8000/611.html
    node -e "const http = require('http'); const fs = require('fs'); const path = require('path'); const server = http.createServer((req, res) => { let filePath = '.' + req.url; if (filePath === './') filePath = './611.html'; const ext = path.extname(filePath); const types = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json'}; const contentType = types[ext] || 'application/octet-stream'; fs.readFile(filePath, (err, content) => { if (err) { res.writeHead(404); res.end('404'); } else { res.writeHead(200, {'Content-Type': contentType}); res.end(content); }}); }); server.listen(8000, () => console.log('Server running at http://localhost:8000/'));"
    goto :end
)

:: 都没有
echo ✗ 错误：未安装 Python 或 Node.js
echo.
echo 请选择以下方案之一：
echo.
echo   方案1: 安装 Python 3
echo          下载: https://python.org/
echo.
echo   方案2: 安装 Node.js
echo          下载: https://nodejs.org/
echo.
echo   方案3: 使用 VS Code 的 Live Server 插件
echo          在VS Code中右键HTML文件 → Open with Live Server
echo.

:end
pause
