import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'task_planner_super_secret_jwt_key_2026';

/**
 * Sign a JWT token with user/admin payload
 */
export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Extract and verify JWT from incoming Request headers or cookies
 */
export function getTokenFromRequest(req) {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  // Check cookie
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/task_planner_token=([^;]+)/);
    if (match) return match[1];
  }
  
  return null;
}
