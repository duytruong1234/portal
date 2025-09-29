/**
 * Utility functions for user-related operations
 */

/**
 * So sánh user ID một cách nhất quán
 * @param {Object|string} user1 - User object hoặc user ID
 * @param {Object|string} user2 - User object hoặc user ID
 * @returns {boolean}
 */
export const isSameUser = (user1, user2) => {
  if (!user1 || !user2) return false
  
  const getId = (user) => {
    if (typeof user === 'string') return user
    return user._id || user.id
  }
  
  const id1 = getId(user1)
  const id2 = getId(user2)
  
  return id1 && id2 && id1.toString() === id2.toString()
}

/**
 * Lấy user ID từ user object
 * @param {Object} user - User object
 * @returns {string|null}
 */
export const getUserId = (user) => {
  if (!user) return null
  return user._id || user.id || null
}

/**
 * Kiểm tra user có phải admin không
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user && (user.role === 'admin' || user.isAdmin === true)
}