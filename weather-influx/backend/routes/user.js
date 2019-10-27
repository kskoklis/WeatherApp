const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res, next) => {
    //console.log(req.body.username);

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message: "User created!",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    });
    
});

router.post("/login", (req, res, next) => {
    let fetchedUser;
    User.findOne({ username: req.body.username})
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed!"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
                .then(result => {
                    if (!result) {
                        return res.status(401).json({
                            message: "Auth failed!"
                        });
                    }
                    const token = jwt.sign({username: fetchedUser.username, userId: fetchedUser._id}, 
                    'secret_for_web_token',
                    { expiresIn: "1h" });
                    res.status(200).json({
                        token: token
                    });
                })
                .catch(err => {
                    return res.status(401).json({
                        message: "Auth failed!"
                    });
                });
    });
});

module.exports = router;