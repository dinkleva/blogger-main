const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')



//Adding to database
router.post('/', (req, res, next) => {

    
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                })

                user.save()
                    .then(result => {
                        res.render('user', { title: 'User Profile', username: result.name })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }


        })

        // user.save()
        //     .then(result => {
        //         res.status(201).json({
        //             message: 'User ' + result.name + ' created'
        //         })
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     });
    



    // next();

})

module.exports = router