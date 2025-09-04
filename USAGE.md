# 使用说明

## 🚀 快速开始

### 1. 生成新的 GitHub Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择以下权限：
   - ✅ `public_repo` (公开仓库访问权限)
   - ✅ `user` (用户信息访问权限)
4. 复制生成的 token

### 2. 配置 Token

编辑 `.env` 文件，将 `your_token_here` 替换为你的实际 token：

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```



### 3. 运行脚本

```bash
pnpm dev
```

## 📊 输出示例

```
🚀 启动 GitHub 自动 Star 脚本 (API 版本)...
📋 待处理仓库数量: 5
🔐 验证 GitHub Token...
✅ Token 验证成功，当前用户: your_username

📊 进度: 1/5
⭐ 正在处理仓库: electron/electron
✅ 成功点击 Star: electron/electron
⏳ 等待 3247ms 后继续...

📊 进度: 2/5
⭐ 正在处理仓库: vuejs/vue
✅ 仓库已经 Star 过: vuejs/vue
⏳ 等待 2156ms 后继续...

🎉 任务完成！
✅ 成功处理: 5 个仓库
  ├─ 新点击 Star: 3 个仓库
  └─ 已经 Star 过: 2 个仓库
❌ 失败: 0 个仓库
⏭️  跳过: 0 个仓库（自己的项目）
📊 总计: 5 个仓库

🎯 本次成功点击了 3 个新仓库的 Star！
```

## ⚠️ 注意事项

- 确保 Token 有正确的权限
- 不要频繁运行，避免触发 GitHub API 限制
- 仓库 URL 格式必须正确：`https://github.com/owner/repo`
- **自动跳过自己的项目**：脚本会自动识别并跳过你自己的项目，避免无意义的操作
- **智能去重**：脚本会自动检查仓库是否已经 Star 过，避免重复操作
- **详细统计**：会明确显示新点击了多少个仓库，以及已经 Star 过的仓库数量
