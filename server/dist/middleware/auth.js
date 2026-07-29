import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { User } from '../models/User.js';
export async function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    try {
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, String(config.jwt.secret));
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }
        req.user = user;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}
export function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }
    next();
}
export function optionalAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        next();
        return;
    }
    const token = header.split(' ')[1];
    jwt.verify(token, String(config.jwt.secret), async (err, decoded) => {
        if (!err && decoded && typeof decoded === 'object' && 'id' in decoded) {
            const user = await User.findById(decoded.id).select('-password');
            if (user)
                req.user = user;
        }
        next();
    });
}
