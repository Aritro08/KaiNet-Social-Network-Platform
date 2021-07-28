const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.auth.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { username: decodedToken.username, id: decodedToken.id }
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Auth failed'
        });
    }
}