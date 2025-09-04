/**
 * 从 Excel 文件读取仓库列表并执行 Star 操作
 * @description 读取本地 Excel 文件中的 GitHub 仓库列表
 */

require('dotenv').config()
const { DELAY_CONFIG, LOGIN_CONFIG } = require('./config')

/**
 * 生成随机延迟时间
 */
function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 等待指定时间
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 从 GitHub URL 提取仓库信息
 */
function parseRepoUrl(url) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (!match) {
    throw new Error(`无效的 GitHub URL: ${url}`)
  }
  return {
    owner: match[1],
    repo: match[2],
  }
}

/**
 * 检查是否是自己的项目
 */
function isOwnRepository(owner, currentUser) {
  return owner.toLowerCase() === currentUser.toLowerCase()
}

/**
 * 检查仓库是否已经被 Star
 */
async function isRepoStarred(owner, repo) {
  try {
    const response = await fetch(`https://api.github.com/user/starred/${owner}/${repo}`, {
      method: 'GET',
      headers: {
        Authorization: `token ${LOGIN_CONFIG.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'GitHub-Auto-Star-Bot',
      },
    })

    return response.status === 204
  } catch (error) {
    console.error(`❌ 检查 Star 状态失败 ${owner}/${repo}:`, error.message)
    return false
  }
}

/**
 * 点击仓库的 Star
 */
async function starRepository(owner, repo) {
  try {
    console.log(`⭐ 正在处理仓库: ${owner}/${repo}`)

    // 先检查是否已经 Star 过
    const isStarred = await isRepoStarred(owner, repo)
    if (isStarred) {
      console.log(`✅ 仓库已经 Star 过: ${owner}/${repo}`)
      return { success: true, alreadyStarred: true }
    }

    // 发送 Star 请求
    const response = await fetch(`https://api.github.com/user/starred/${owner}/${repo}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${LOGIN_CONFIG.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'GitHub-Auto-Star-Bot',
        'Content-Length': '0',
      },
    })

    if (response.status === 204) {
      console.log(`✅ 成功点击 Star: ${owner}/${repo}`)
      return { success: true, alreadyStarred: false }
    } else {
      const errorText = await response.text()
      console.log(`❌ 点击 Star 失败: ${owner}/${repo} (状态码: ${response.status})`)
      console.log(`错误信息: ${errorText}`)
      return { success: false, alreadyStarred: false }
    }
  } catch (error) {
    console.error(`❌ 处理仓库时发生错误 ${owner}/${repo}:`, error.message)
    return { success: false, alreadyStarred: false }
  }
}

/**
 * 验证 GitHub Token
 */
async function validateToken() {
  try {
    console.log('🔐 验证 GitHub Token...')

    const response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `token ${LOGIN_CONFIG.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'GitHub-Auto-Star-Bot',
      },
    })

    if (response.ok) {
      const user = await response.json()
      console.log(`✅ Token 验证成功，当前用户: ${user.login}`)
      return { valid: true, username: user.login }
    } else {
      console.log(`❌ Token 验证失败 (状态码: ${response.status})`)
      return { valid: false, username: null }
    }
  } catch (error) {
    console.error('❌ Token 验证过程中发生错误:', error.message)
    return { valid: false, username: null }
  }
}

/**
 * 读取 Excel 文件
 */
async function readExcelFile() {
  try {
    console.log('📊 正在读取 Excel 文件...')

    // 检查是否安装了 xlsx 库
    let XLSX
    try {
      XLSX = require('xlsx')
    } catch (error) {
      console.log('❌ 需要安装 xlsx 库来读取 Excel 文件')
      console.log('请运行: npm install xlsx')
      throw new Error('xlsx 库未安装')
    }

    // 读取 Excel 文件
    const workbook = XLSX.readFile('github 仓库合集.xlsx')
    const sheetName = workbook.SheetNames[0] // 使用第一个工作表
    const worksheet = workbook.Sheets[sheetName]

    console.log(`📋 工作表名称: ${sheetName}`)

    // 将工作表转换为 JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    console.log(`📊 读取到 ${jsonData.length} 行数据`)

    // 提取第一列的数据（假设仓库 URL 在第一列）
    const urls = []
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i]
      if (row && row[0] && typeof row[0] === 'string') {
        const url = row[0].trim()
        if (url.includes('github.com')) {
          urls.push(url)
        }
      }
    }

    console.log(`✅ 提取到 ${urls.length} 个 GitHub 仓库 URL`)

    return urls
  } catch (error) {
    console.error('❌ 读取 Excel 文件失败:', error.message)
    throw error
  }
}

/**
 * 验证和清理仓库 URL
 */
function validateAndCleanUrls(urls) {
  const validUrls = []
  const seen = new Set()

  urls.forEach((url) => {
    // 清理 URL
    let cleanUrl = url.trim()

    // 移除可能的查询参数和锚点
    cleanUrl = cleanUrl.split('?')[0].split('#')[0]

    // 验证是否是有效的 GitHub URL
    if (cleanUrl.match(/^https:\/\/github\.com\/[^\/]+\/[^\/]+$/)) {
      // 去重
      if (!seen.has(cleanUrl)) {
        seen.add(cleanUrl)
        validUrls.push(cleanUrl)
      }
    }
  })

  return validUrls
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 启动从 Excel 文件自动 Star 脚本...')

    // 验证 Token
    if (!LOGIN_CONFIG.token) {
      throw new Error('❌ 请配置 GitHub Token')
    }

    const tokenResult = await validateToken()
    if (!tokenResult.valid) {
      throw new Error('❌ GitHub Token 无效，请检查配置')
    }

    const currentUser = tokenResult.username

    // 读取 Excel 文件
    const rawUrls = await readExcelFile()

    if (!rawUrls || rawUrls.length === 0) {
      throw new Error('❌ 未能从 Excel 文件获取到任何仓库 URL')
    }

    // 验证和清理 URL
    const repositories = validateAndCleanUrls(rawUrls)
    console.log(`✅ 获取到 ${repositories.length} 个有效仓库 URL`)

    if (repositories.length === 0) {
      throw new Error('❌ 没有找到有效的 GitHub 仓库 URL')
    }

    // 统计变量
    let successCount = 0
    let failCount = 0
    let skipCount = 0
    let alreadyStarredCount = 0
    let newlyStarredCount = 0

    // 遍历仓库列表
    for (let i = 0; i < repositories.length; i++) {
      const repoUrl = repositories[i]
      console.log(`\n📊 进度: ${i + 1}/${repositories.length}`)

      try {
        // 解析仓库 URL
        const { owner, repo } = parseRepoUrl(repoUrl)

        // 检查是否是自己的项目
        if (isOwnRepository(owner, currentUser)) {
          console.log(`⏭️  跳过自己的项目: ${owner}/${repo}`)
          skipCount++
          continue
        }

        // 执行 Star 操作
        const result = await starRepository(owner, repo)
        if (result.success) {
          successCount++
          if (result.alreadyStarred) {
            alreadyStarredCount++
          } else {
            newlyStarredCount++
          }
        } else {
          failCount++
        }
      } catch (error) {
        console.error(`❌ 处理仓库失败 ${repoUrl}:`, error.message)
        failCount++
      }

      // 随机延迟，避免触发 API 限制
      if (i < repositories.length - 1) {
        const delay = getRandomDelay(DELAY_CONFIG.minDelay, DELAY_CONFIG.maxDelay)
        console.log(`⏳ 等待 ${delay}ms 后继续...`)
        await sleep(delay)
      }
    }

    // 输出最终统计
    console.log('\n🎉 任务完成！')
    console.log(`📄 数据来源: Excel 文件`)
    console.log(`✅ 成功处理: ${successCount} 个仓库`)
    console.log(`  ├─ 新点击 Star: ${newlyStarredCount} 个仓库`)
    console.log(`  └─ 已经 Star 过: ${alreadyStarredCount} 个仓库`)
    console.log(`❌ 失败: ${failCount} 个仓库`)
    console.log(`⏭️  跳过: ${skipCount} 个仓库（自己的项目）`)
    console.log(`📊 总计: ${repositories.length} 个仓库`)

    // 重点提示
    if (newlyStarredCount > 0) {
      console.log(`\n🎯 本次成功点击了 ${newlyStarredCount} 个新仓库的 Star！`)
    } else {
      console.log(`\n💡 所有仓库都已经 Star 过了，没有新的操作。`)
    }

    // API 使用统计
    console.log('\n📈 API 使用统计:')
    console.log(`- 请求总数: ${repositories.length * 2} (每个仓库 2 个请求: 检查 + Star)`)
    console.log(`- 成功率: ${Math.round((successCount / repositories.length) * 100)}%`)
  } catch (error) {
    console.error('❌ 程序执行过程中发生错误:', error.message)
    process.exit(1)
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error)
}

module.exports = {
  main,
  starRepository,
  isRepoStarred,
  validateToken,
  parseRepoUrl,
  readExcelFile,
}
