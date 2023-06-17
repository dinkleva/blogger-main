const User = require('../models/user')
const jwt = require('jsonwebtoken')


const handleError = (err) =>{
    console.log(err.message, err.code)

    let errors = { email: '', password: ''}


    //Duplicate email error handling
    if(err.code === 11000){
        errors.email = 'Email is already Taken.'
        return errors
    }


    //login error handling
    if(err.message === 'incorrect email'){
        errors.email = 'Email is not Registered'
    }

    if(err.message === 'incorrect password'){
        errors.password = 'Password does not Match'
    }


    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    return errors
}


//create jwt toekn

const createToken = (id) =>{
    return jwt.sign({ id }, process.env.SECRET_TOKEN)
}



//Signup controllers

module.exports.signup_get = (req, res) =>{
    res.render('signup', {title: 'Signup Page'})
}


module.exports.signup_post = async (req, res) =>{
    
    const { name, email, password } = req.body

    try{

        const user = await User.create({ name, email, password })
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly: true, secure: true})
        res.status(201).json({ user })

    }
    catch(err){
        const errors = handleError(err)
        res.status(400).json({ errors })
    }

}


//Login controllers
module.exports.login_get = (req, res) =>{
    res.render('login', {title: 'Login Page'})
    
}

module.exports.login_post = async (req, res) =>{

    const { email , password } = req.body

    try{
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly: true, secure:true})
        res.status(201).json({ user: user})

    }
    catch (err){
        const errors = handleError(err)
        res.status(400).json({ errors })
    }
}

//logout controller
module.exports.logout_get = (req, res) =>{
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
}

