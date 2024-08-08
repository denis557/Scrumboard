const jwt = require('jsonwebtoken');
// require('dotenv').config({ path: __dirname+'/.env' });
require('dotenv').config();
process.env.ACCESS_TOKEN_SECRET='68543ffbb6881209c51c26d66471eac9181f3e0d9692079c7cb412fc61c97b2e'

function authentificateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(401);
        req.user = user;
        next();
    });
};

module.exports = {
    authentificateToken,
};