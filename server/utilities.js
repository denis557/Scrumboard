const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname+'/.env' });

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