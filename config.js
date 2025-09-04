/**
 * GitHub 自动 Star 配置文件
 * @description 配置需要点击 Star 的仓库列表和其他参数
 */

/**
 * 延迟配置
 * @type {Object}
 */
const DELAY_CONFIG = {
  // 最小延迟时间 (毫秒)
  minDelay: parseInt(process.env.MIN_DELAY) || 2000,

  // 最大延迟时间 (毫秒)
  maxDelay: parseInt(process.env.MAX_DELAY) || 5000,
}

/**
 * GitHub 登录配置
 * @type {Object}
 */
const LOGIN_CONFIG = {
  token: process.env.GITHUB_TOKEN || '',
}

module.exports = {
  DELAY_CONFIG,
  LOGIN_CONFIG,
}
