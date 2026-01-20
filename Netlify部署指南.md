# 🚀 Netlify 部署完整指南

## ✅ 你已经创建的文件

```
web/
├── 611.html                              ✅ 已上传
├── netlify.toml                          🆕 配置文件
├── package.json                          🆕 项目配置
└── netlify/
    └── functions/
        └── tripo-proxy.js               🆕 后端API
```

---

## 📋 部署步骤

### 1️⃣ 重新部署到Netlify

**方法A：通过网站界面（推荐）**

1. 访问 https://app.netlify.com/sites/moss3d/deploys
2. 点击 **"Deploys"** 标签
3. 拖拽整个 `web` 文件夹到页面上（包含新文件）
4. 等待部署完成

**方法B：使用Netlify CLI**

```powershell
# 安装CLI（只需一次）
npm install -g netlify-cli

# 在web文件夹中
cd "c:\Users\liuyaoyao\Desktop\创业\web"

# 登录
netlify login

# 链接站点
netlify link

# 部署
netlify deploy --prod
```

---

### 2️⃣ 配置环境变量（重要！）🔐

在Netlify设置API密钥：

1. 打开 https://app.netlify.com/sites/moss3d/settings/deploys
2. 找到 **"Environment variables"**
3. 点击 **"Add a variable"**
4. 添加：
   ```
   Key: TRIPO_API_KEY
   Value: tsk_1hogTAujjDaKOQKdvI8WfU6xbMQrjyaikT2Jzr4Frmj
   ```
5. 点击 **"Save"**
6. **重新部署**（在Deploys页面点击 "Trigger deploy"）

**为什么要用环境变量？**
- 🔒 密钥不会暴露在前端代码中
- 🔒 更安全
- 🔄 更容易更换密钥

---

### 3️⃣ 测试部署

部署完成后访问：

```
前端页面: https://moss3d.netlify.app/611.html
后端API: https://moss3d.netlify.app/api/task/xxx
```

**测试步骤：**
1. 打开 https://moss3d.netlify.app/611.html
2. 按 F12 打开控制台
3. 完成设计流程
4. 生成3D模型
5. 查看控制台是否有错误

---

## 🔍 部署后的URL结构

### 前端调用后端的方式

```javascript
// 本地开发时
fetch('http://localhost:3000/api/upload')

// 线上部署时（自动转换）
fetch('/api/upload')  // 实际访问 /.netlify/functions/tripo-proxy/upload
```

### Netlify的路由

```
用户访问: /api/upload
    ↓ (netlify.toml重定向)
实际调用: /.netlify/functions/tripo-proxy/upload
    ↓ (Serverless Function)
转发到: https://api.tripo3d.ai/v2/openapi/upload
```

---

## 🎯 完整的文件结构

```
c:\Users\liuyaoyao\Desktop\创业\web\
│
├── 611.html                     # 前端页面
├── netlify.toml                 # Netlify配置（路由、CORS）
├── package.json                 # 项目信息
│
└── netlify/
    └── functions/
        └── tripo-proxy.js      # 后端API代理
```

---

## ⚠️ 常见问题

### Q1: 部署后API调用失败？

**检查：**
1. 环境变量是否设置正确
2. 控制台是否显示404错误
3. Netlify Functions是否正确部署（在Deploy日志中查看）

**解决：**
```
访问: https://app.netlify.com/sites/moss3d/functions
查看: tripo-proxy 函数是否显示
```

### Q2: 本地测试还能用吗？

**能！** 代码会自动检测：
- 本地（localhost）→ 使用 http://localhost:3000/api
- 线上（netlify.app）→ 使用 /api（Netlify Functions）

**本地测试步骤：**
```powershell
# 终端1：启动Tripo代理
cd "c:\Users\liuyaoyao\Desktop\大三上\自动控制\yuyin"
node tripo-proxy-server.js

# 终端2：启动Web服务器
cd "c:\Users\liuyaoyao\Desktop\创业\web"
python -m http.server 8000

# 访问：http://localhost:8000/611.html
```

### Q3: 如何查看后端日志？

1. 访问 https://app.netlify.com/sites/moss3d/functions
2. 点击 `tripo-proxy` 函数
3. 查看实时日志

---

## 📊 部署检查清单

部署前确认：

- [x] `netlify.toml` 已创建
- [x] `package.json` 已创建
- [x] `netlify/functions/tripo-proxy.js` 已创建
- [ ] 所有文件已上传到Netlify
- [ ] 环境变量 `TRIPO_API_KEY` 已设置
- [ ] 重新部署触发
- [ ] 访问 https://moss3d.netlify.app/611.html 测试

---

## 🎉 完成后

你的网站将：
- ✅ 完全在云端运行
- ✅ 无需本地服务器
- ✅ 任何人都能访问
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ API密钥安全存储

---

需要帮助？把部署日志或错误信息发给我！
