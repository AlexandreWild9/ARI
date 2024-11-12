/*const jwt = require('jsonwebtoken');
require('dotenv').config();


const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];// Usamos essa quebra pq normalmente usamos “Baerer XXX”
    if (token == null) return res.sendStatus(401);
    try {
        const user = jwtConfig.verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
}

module.exports = { autenticarToken }; */	
