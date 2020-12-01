const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers['Authorization'].split(' ')[1];
        if (!token) {
            throw new Error();
        }

        const { JWT_SECRET, JWT_TIME } = process.env;
        const decoded = jwt.decode(token, JWT_SECRET);
        
        if (Date.now() >= decoded.exp * 1000) {
            const user = await User.findOne(({ where: { id: decoded.id } }));
            const refreshToken = user.token;
            
            try {
                const verified = jwt.verify(refreshToken, JWT_SECRET);
                const newToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: JWT_TIME });
                
                req.refresh = { token: newToken, id: decoded.id };
                req.user = verified;
                next();
            } catch (err) {
                console.log(err);
                res.send401("Authorization expired");
            }
        } else {
            try {
                const verified = jwt.verify(token, JWT_SECRET);
                req.user = verified;
                next();
            } catch (err) {
                console.log(err);
                res.send401("Authorization expired");
            }
        }
    } catch (err) {
        console.log(err);
        res.send401("aaa " + err.stack);
    }
};
