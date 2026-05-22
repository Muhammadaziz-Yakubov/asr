import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'asr_tracker_jwt_secret_key_2026';

export default function authMiddleware(req, res, next) {
  // Allow preflight options requests or health checks
  if (req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Ruxsat berilmagan: Token topilmadi' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({ message: 'Ruxsat berilmagan: Yaroqsiz token' });
  }
}
