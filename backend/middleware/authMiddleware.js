const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    let token = req.headers.token;
    try {
        if (!token) throw 'Unauthorized Access - No token provided';
        let payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) throw 'Unauthorized Access - Invalid token';
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ message: error });
    }
}

function verifyAdmin(req, res, next) {
    let token = req.headers.token;
    try {
        if (!token) throw 'Unauthorized Access - No token provided';
        let payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload || !payload.isAdmin) throw 'Unauthorized Access - Admins only';
        req.admin = payload;
        next();
    } catch (error) {
        res.status(401).json({ message: error });
    }
}

module.exports = { verifyToken, verifyAdmin };