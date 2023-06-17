const jwt = require('jsonwebtoken')
const User = require('../models/user')


const requireAuth = (req, res, next) =>{

    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) =>{

            if(err){
                console.log(err.message)
                res.redirect('/login')
            }
            else{
                next()
            }
        })
    }
    else{
        res.redirect('/login')
    }

}

//check if user is logged in then send some data so that we can use in our views..or html page usig res.locals

const checkUser = (req, res, next) =>{
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, process.env.SECRET_TOKEN, async (err, decodedToken) =>{
            if(err){
                console.log(err.message)
                res.locals.user = null
                next()
            }else{
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })

    }
    else{
        res.locals.user = null
        next()
    }
}


module.exports = {
    requireAuth,
    checkUser,
}