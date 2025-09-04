# GitHub 自动点击 Star 脚本

一个基于 GitHub REST API 的自动化脚本，用于批量点击 GitHub 仓库的 Star 按钮。

## ✨ 功能特性

- 🚀 **API 操作**：使用 GitHub REST API 直接操作，无需浏览器
- 🔐 **Token 认证**：使用 Personal Access Token 安全认证
- 📊 **详细统计**：实时显示操作进度和成功率
- ⚙️ **灵活配置**：支持自定义仓库列表和参数
- 🛡️ **速率限制**：内置延迟机制，避免触发 API 限制
- 🔒 **智能过滤**：自动跳过自己的项目，避免无意义操作

## 📋 系统要求

- Node.js 16.0 或更高版本
- GitHub Personal Access Token

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
# GitHub Personal Access Token（必需）
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 延迟配置（可选）
MIN_DELAY=2000
MAX_DELAY=5000
```

### 3. 下载最新腾讯云文档至本地同级目录
```

### 4. 运行脚本

```bash
npm start
```

## 🔧 配置说明

### 环境变量配置

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `GITHUB_TOKEN` | Personal Access Token | - | 是 |
| `MIN_DELAY` | 最小随机延迟（毫秒） | `2000` | 否 |
| `MAX_DELAY` | 最大随机延迟（毫秒） | `5000` | 否 |

### 仓库列表配置

在 `config.js` 中配置需要点击 Star 的仓库：

```javascript
const REPOSITORIES = [
  'https://github.com/electron/electron',
  'https://github.com/ElemeFE/element',
  'https://github.com/vuejs/vue',
  // 添加更多仓库...
];
```

## 🔐 GitHub Personal Access Token 获取

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择以下权限：
   - `public_repo` (公开仓库访问权限)
   - `user` (用户信息访问权限)
4. 复制生成的 token 并配置到 `.env` 文件中

## 📊 使用示例

### 基本使用

```bash
# 运行脚本
npm start

# 调试模式运行
npm run dev
```

### 输出示例

```
🚀 启动 GitHub 自动 Star 脚本...
📋 待处理仓库数量: 5
🔐 开始登录 GitHub...
✅ GitHub 登录成功

📊 进度: 1/5
⭐ 正在处理仓库: https://github.com/electron/electron
✅ 成功点击 Star: https://github.com/electron/electron
⏳ 等待 3247ms 后继续...

📊 进度: 2/5
⭐ 正在处理仓库: https://github.com/ElemeFE/element
✅ 仓库已经 Star 过: https://github.com/ElemeFE/element
⏳ 等待 2156ms 后继续...

🎉 任务完成！
✅ 成功: 4 个仓库
❌ 失败: 1 个仓库
📊 总计: 5 个仓库
```

## 🛡️ 安全建议

1. **使用 Personal Access Token**：比用户名密码更安全
2. **合理设置延迟**：避免过于频繁的操作
3. **小批量操作**：不要一次性处理过多仓库
4. **定期更新**：保持脚本和依赖的更新

## ⚠️ 注意事项

1. **遵守 GitHub 服务条款**：请确保你的使用符合 GitHub 的使用政策
2. **避免滥用**：不要用于恶意目的或大规模自动化操作
3. **网络环境**：确保网络连接稳定
4. **浏览器兼容性**：脚本基于 Chrome/Chromium，确保系统支持

## 🔧 故障排除

### 常见问题

**Q: 登录失败怎么办？**
A: 检查用户名密码是否正确，或尝试使用 Personal Access Token

**Q: 找不到 Star 按钮？**
A: 可能是页面结构变化，检查仓库 URL 是否正确

**Q: 脚本运行很慢？**
A: 可以调整 `MIN_DELAY` 和 `MAX_DELAY` 参数，但不要设置过小

**Q: 浏览器无法启动？**
A: 确保系统支持 Chrome/Chromium，或尝试设置 `HEADLESS=true`

### 调试模式

启用调试模式查看详细日志：

```bash
DEBUG=true npm start
```

## 📝 开发说明

### 项目结构

```
github-auto-star/
├── index.js          # 主脚本文件
├── config.js         # 配置文件
├── utils.js          # 工具函数
├── package.json      # 项目配置
└── README.md         # 说明文档
```

### 扩展功能

可以通过修改代码添加以下功能：

- 支持其他 Git 平台（GitLab、Bitbucket 等）
- 添加更多反检测机制
- 支持批量取消 Star
- 添加操作日志记录

## 📄 许可证

ISC License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

**免责声明**：此脚本仅供学习和研究使用，请遵守相关平台的使用条款和法律法规。
