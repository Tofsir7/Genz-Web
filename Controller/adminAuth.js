const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check local role from token first
        if (decoded.role === 'admin') {
            req.user = decoded;
            next();
        } else {
            // Not authorized
            return res.status(403).send("<h1>403 Forbidden: Admins Only</h1><a href='/home'>Go Home</a>");
        }
    } catch (err) {
        console.error("Auth Error:", err);
        return res.redirect('/login');
    }
};

module.exports = adminAuth;
