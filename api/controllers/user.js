const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(409).json({
                    message: 'Mail exists'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err)
                        res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result)
                                res.status(200).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    message: err
                                })
                            })

                    }
                })
            }
        })

};

exports.user_login = (req, res, next) => {
    User.find({email: req.body.email}).exec()
    .then(user => {
         if(user.length < 1) {
         return res.status(401).json({
             message: 'Authenticaton failed'
         });
         
     }
     bcrypt.compare(req.body.password, user[0].password, (err, result) => {
         if(err) {
             console.log(err)
             return res.status(200).json({
                 error: 'Authentication failed'
             });
         } 
         if(result) {
             const token = jwt.sign({
                 emai: user[0].email,
                 password: user[0].password
             },
             process.env.JWT_KEY,
             {
                 expiresIn: '1h'
             });
             return res.status(200).json({
                 message: 'Authentication success',
                 token: token
             })
         }
         res.status(401).json({
             meddage: 'Authentication failed'
         })
     })
    })
    .catch(err => {
     console.log(err)
     res.status(401).json({
         error: err
     })
    })
 }; 

 exports.user_deleteUser = (req, res, next) => {
    User.deleteOne({_id: req.params.userId}).exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'User deleted'
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: err
            })
        })
};