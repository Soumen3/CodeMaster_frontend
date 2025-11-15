/**
 * Avatar caching utility with 7-day expiration
 * Stores avatar images in sessionStorage to avoid repeated fetches
 */

const CACHE_KEY_PREFIX = 'avatar_cache_'
const CACHE_EXPIRY_DAYS = 7
const CACHE_EXPIRY_MS = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000

/**
 * Get cached avatar data for a user
 * @param {string} userId - User ID
 * @returns {string|null} - Cached avatar URL or null if expired/not found
 */
export const getCachedAvatar = (userId) => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`
    const cachedData = sessionStorage.getItem(cacheKey)
    
    if (!cachedData) {
      return null
    }

    const { avatarUrl, timestamp } = JSON.parse(cachedData)
    const now = Date.now()
    
    // Check if cache has expired (7 days)
    if (now - timestamp > CACHE_EXPIRY_MS) {
      // Cache expired, remove it
      sessionStorage.removeItem(cacheKey)
      return null
    }

    return avatarUrl
  } catch (error) {
    console.error('Error reading avatar cache:', error)
    return null
  }
}

/**
 * Set avatar in cache with current timestamp
 * @param {string} userId - User ID
 * @param {string} avatarUrl - Avatar URL to cache
 */
export const setCachedAvatar = (userId, avatarUrl) => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`
    const cacheData = {
      avatarUrl,
      timestamp: Date.now()
    }
    
    sessionStorage.setItem(cacheKey, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Error setting avatar cache:', error)
    // If sessionStorage is full or unavailable, fail silently
  }
}

/**
 * Clear avatar cache for a specific user
 * @param {string} userId - User ID
 */
export const clearCachedAvatar = (userId) => {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`
    sessionStorage.removeItem(cacheKey)
  } catch (error) {
    console.error('Error clearing avatar cache:', error)
  }
}

/**
 * Clear all avatar caches
 */
export const clearAllAvatarCaches = () => {
  try {
    const keys = Object.keys(sessionStorage)
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        sessionStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Error clearing all avatar caches:', error)
  }
}

/**
 * Get or fetch avatar with caching
 * @param {string} userId - User ID
 * @param {string} avatarUrl - Avatar URL from API
 * @returns {string} - Avatar URL to use
 */
export const getAvatarWithCache = (userId, avatarUrl) => {
  if (!userId || !avatarUrl) {
    return avatarUrl
  }

  // Try to get from cache first
  const cachedUrl = getCachedAvatar(userId)
  
  if (cachedUrl) {
    return cachedUrl
  }

  // Not in cache or expired, cache the new URL
  setCachedAvatar(userId, avatarUrl)
  return avatarUrl
}
