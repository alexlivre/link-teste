// backend/utils/botDetector.js
// Utilitário de detecção de bots seguindo Clean Code (< 50 linhas)

/**
 * Lista de user-agents conhecidos de bots
 */
const BOT_PATTERNS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'applebot',
  'semrushbot',
  'ahrefsbot',
  'mj12bot',
  'dotbot',
  'crawler',
  'spider',
  'scraper'
]

/**
 * Detecta se user-agent é um bot
 * @param {string} userAgent - User-Agent string
 * @returns {boolean} - True se for bot
 */
export function isBot(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') {
    return false
  }

  const normalizedUA = userAgent.toLowerCase()
  
  return BOT_PATTERNS.some(pattern => 
    normalizedUA.includes(pattern)
  )
}

/**
 * Obtém informações do bot detectado
 * @param {string} userAgent - User-Agent string
 * @returns {object} - Informações do bot
 */
export function getBotInfo(userAgent) {
  if (!isBot(userAgent)) {
    return null
  }

  const normalizedUA = userAgent.toLowerCase()
  const detectedBot = BOT_PATTERNS.find(pattern => 
    normalizedUA.includes(pattern)
  )

  return {
    isBot: true,
    botType: detectedBot,
    userAgent: userAgent
  }
}

export { BOT_PATTERNS }
