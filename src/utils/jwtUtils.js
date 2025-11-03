/**
 * JWT Utility Functions
 * Decode JWT tokens to extract user data without validation
 * Note: This is ONLY for reading non-sensitive data from the token.
 * Token validation happens on the server side.
 */

/**
 * Decode a JWT token without verification
 * @param {string} token - The JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export function decodeToken(token) {
  if (!token) return null;

  try {
    // JWT structure: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (base64url)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));

    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

/**
 * Check if a token is expired
 * @param {string} token - The JWT token
 * @returns {boolean} - True if expired, false otherwise
 */
export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
}

/**
 * Get user data from token
 * @param {string} token - The JWT token
 * @returns {object|null} - User data or null
 */
export function getUserFromToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    userId: decoded.userId,
    email: decoded.email,
    name: decoded.name || null,
    profilePicture: decoded.profilePicture || null,
  };
}

/**
 * Check if token is valid (exists and not expired)
 * @param {string} token - The JWT token
 * @returns {boolean} - True if valid, false otherwise
 */
export function isTokenValid(token) {
  return token && !isTokenExpired(token);
}
