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

- Node.js 22 或更高版本(安装nodejs 22 请参考 https://nodejs.org/zh-cn/download/releases/)
- pnpm 9.15.0 或更高版本(安装pnpm 请参考 https://pnpm.io/installation)
- GitHub Personal Access Token

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

编辑 `.env` 文件：

```bash
# GitHub Personal Access Token（必需）
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 延迟配置（可选）
MIN_DELAY=2000
MAX_DELAY=5000
```

### 3. 下载最新腾讯云文档至本地替换github 仓库合集.xlsx
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

```

## 🔐 GitHub Personal Access Token 获取

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择以下权限：
   - `repo` (公开仓库访问权限)
   - `user` (用户信息访问权限)
4. 复制生成的 token 并配置到 `.env` 文件中

## 📊 使用示例

### 基本使用

```bash
#运行脚本
pnpm dev
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


## 📄 许可证

ISC License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

**免责声明**：此脚本仅供学习和研究使用，请遵守相关平台的使用条款和法律法规。
