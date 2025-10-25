import jwtNS from 'jsonwebtoken';
const jwt = jwtNS.default || jwtNS;

export default function auth(requiredRole = null) {
  return (req, res, next) => {
    const hdr = req.headers.authorization || '';
    if (!hdr.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
    try {
      const token = hdr.slice(7);
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (requiredRole && payload.role !== requiredRole) return res.status(403).json({ error: 'Forbidden' });
      req.user = payload;
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}
