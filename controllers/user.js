const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require("path");

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
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    expires: new Date(Date.now() + 1296000000) //15 Days
                }
            );

            return res.status(200).json({
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

exports.get_user_data = (req, res, next) => {
    User.find({ _id: req.userData._id })
        .exec()
        .then(user => {
            if (user.length < 1){
                return res.status(401).json({
                    error: 'no user found'
                });
            }

            return res.status(200).json({
                _id: user[0]._id,
                username: user[0].username,
                email: user[0].email,
                role: user[0].role,
                class: user[0].class,
                project: {
                    favs: user[0].project.favs,
                    first: user[0].project.first,
                    second: user[0].project.second,
                    third: user[0].project.third,
                    final: user[0].project.final
                },
                ownProject: {
                    hasProject: user[0].ownProject.hasProject,
                    project: user[0].ownProject.project
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'internal server issue'
            });
        });
};

exports.delete = (req, res, next) => {
    User.find({ _id: req.userData._id })
        .exec()
        .then(user => {
            if (user.length < 1){
                return res.status(401).json({
                    error: 'no user found'
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
                    User.deleteOne({ _id: req.userData._id })
                        .exec()
                        .then(result => {
                            return res.status(200).json({
                                message: 'user deleted'
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: 'internal server issue'
                            });
                        });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'internal server issue'
            });
        });
};

exports.request_data = (req, res, next) => {
    User.find({ _id: req.userData._id })
        .exec()
        .then(user => {
            if (user.length < 1){
                return res.status(401).json({
                    error: 'no user found'
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
                    const obj = {
                        table: []
                    };

                    obj.table.push({
                        shortID: user[0].shortID,
                        username: user[0].username,
                        email: user[0].email,
                        role: user[0].role,
                        class: user[0].class,
                        favorites: user[0].project.favs,
                        first: user[0].project.first,
                        second: user[0].project.second,
                        third: user[0].project.third,
                        hasOwnProject: user[0].ownProject.hasProject,
                        project: user[0].ownProject.project
                    })

                    const transporter = nodemailer.createTransport({
                        port: 465,
                        host: "mail.your-server.de",
                           auth: {
                                user: process.env.EMAIL_USER,
                                pass: process.env.EMAIL_PWD,
                             },
                        secure: true,
                    });

                    const mailData = {
                        from: 'no-reply@sunaarisu.de',
                        to: user[0].email,
                        subject: 'User data request',
                        text: 'Requested data is in the attachment.',
                        html: {
                            path: path.resolve(__dirname, "../templates/requestData.html"),
                        },
                        attachments: [
                            {
                                filename: 'UserData.json',
                                content: JSON.stringify(obj)
                            }
                        ]
                        };

                    transporter.sendMail(mailData, function (err, info) {
                        if(err){
                            console.log(err);
                            return res.status(500).json({
                                error: "Email can't be send"
                            });
                        }else{
                            return res.status(200).json({
                                message: 'Email send'
                            });
                        }                            
                    });
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'internal server issue'
            });
        });
}

exports.set_fav = (req, res, next) => {
    User.find({ _id: req.userData._id })
        .exec()
        .then(user => {
            if (user.length < 1){
                return res.status(401).json({
                    error: 'no user found'
                });
            };

            if (!user[0].project.favs.includes(req.body.projectId)){
                User.updateOne({ _id: req.userData._id }, { "$push": {"project.favs": req.body.projectId} })
                    .exec()
                    .then(result => {
                        return res.status(200).json({
                            message: 'updated'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json({
                            error: 'internal server issue'
                        });
                    });
            }else{
                User.updateOne({ _id: req.userData._id }, { "$pull": {"project.favs": req.body.projectId} })
                    .exec()
                    .then(result => {
                        return res.status(200).json({
                            message: 'updated'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json({
                            error: 'internal server issue'
                        });
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'internal server issue'
            });
        });
};