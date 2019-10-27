const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        //na dw an pairnei to token timh swsta
        //console.log(token);
        jwt.verify(token, 'secret_for_web_token');
        next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed!"});
    }
}