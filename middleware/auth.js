const jwt = require('jsonwebtoken');
const User = require('../MODELS/users'); 



const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log(token);

        const user = jwt.verify(token, 'TOKEN_SECRET');
        console.log('userId >>>>', user.userId);

        User.findByPk(user.userId).then(user => {
           

            req.user = user; 
            next();
        })
        

    } catch (err) {
        console.log('JWT verification error:', err);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

module.exports = {authenticate};

