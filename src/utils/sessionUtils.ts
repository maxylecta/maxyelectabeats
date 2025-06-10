/**
 * Utility functions for session management and unique ID generation
 */

/**
 * Generates a unique session ID using timestamp and random string
 * Format: sess_[timestamp]_[random8chars]
 */
export const generateSessionId = (): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  return `sess_${timestamp}_${randomString}`;
};

/**
 * Generates a unique sale/action ID for tracking webhook calls
 * Format: [prefix]_[timestamp]_[random8chars]
 */
export const generateUniqueId = (prefix: string = 'action'): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${randomString}`;
};

/**
 * Generates a random numeric sale ID (similar to your example format)
 * Returns a string of random digits with specified length
 */
export const generateSaleId = (length: number = 11): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
};

/**
 * Gets or creates a session ID for the current user session
 */
export const getOrCreateSessionId = (): string => {
  const existingSessionId = sessionStorage.getItem('payment_session_id');
  
  if (existingSessionId) {
    return existingSessionId;
  }
  
  const newSessionId = generateSessionId();
  sessionStorage.setItem('payment_session_id', newSessionId);
  return newSessionId;
};

/**
 * Clears the current session ID (useful after successful payment)
 */
export const clearSessionId = (): void => {
  sessionStorage.removeItem('payment_session_id');
};

/**
 * Gets the current session ID without creating a new one
 */
export const getCurrentSessionId = (): string | null => {
  return sessionStorage.getItem('payment_session_id');
};