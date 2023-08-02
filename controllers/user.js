const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
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
                    const token = jwt.sign({
                        _id: user[0]._id,
                        username: user[0].username
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "24h"
                    });

                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
            });

        })
        .catch(err => {
            res.status(500).json({
                error: 'Auth failed due to server issue'
            });
        });
};