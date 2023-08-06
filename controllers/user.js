const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_login = (req, res, next) => {
    User.find({$or:[{ username: req.body.userIdentifier }, { shortID: req.body.userIdentifier }]   })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(404).json({
                    error: 'user not found'
                });
            };

            bcryptjs.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: 'internal server error'
                    });
                }

                if (!result) {
                    return res.status(406).json({
                        error: 'input error'
                    });
                } else {
                    const jwt_token = jwt.sign({
                        _id: user[0]._id,
                        username: user[0].username
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "15m"
                    });

                    const jid_token = jwt.sign({
                        _id: user[0]._id
                    },
                    process.env.JID_KEY,
                    {
                        expiresIn: "15d"
                    });

                    res.cookie(
                        "jid",
                        jid_token,
                        {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none',
                            expires: new Date(Date.now() + 1296000000) //15 Days
                        }
                    );

                    return res.status(200).json({
                        message: 'Auth successful',
                        token: jwt_token
                    });
                }
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Auth failed due to server issue'
            });
        });
};

exports.refresh_token = (req, res, next) => {

    var jid_token = '';

    if (req.cookies.jid === 'undefined'){
        return res.status(401).json({
            error: 'no refresh token'
        });
    }

    try {
        jid_token = jwt.verify(req.cookies.jid, process.env.JID_KEY);
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            error: 'refresh token invalid'
        });
    }; 

    User.find({ _id: jid_token._id})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    error: 'refresh token invalid'
                });
            };

            const jwt_token = jwt.sign({
                _id: user[0]._id,
                username: user[0].username
            },
            process.env.JWT_KEY,
            {
                expiresIn: "15m"
            });

            const jid_token = jwt.sign({
                _id: user[0]._id
            },
            process.env.JID_KEY,
            {
                expiresIn: "15d"
            });

            res.cookie(
                "jid",
                jid_token,
                {
                    httpOnly: true
                }
            );

            return res.status(200).json({
                message: 'Auth successful',
                token: jwt_token
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Auth failed due to server issue'
            });
        });


};