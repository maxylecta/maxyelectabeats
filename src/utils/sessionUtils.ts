/**
 * Utility functions for session management
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