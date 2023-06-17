const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },

    password: {

        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must contain atleast 6 characters'],
    }


},{timestamps: true})




//fire a function after document is saved to databse(mongodb)
UserSchema.post('save', function(doc, next) {
    console.log('User is created', doc)
    next()
})

//fire a function before document is saved to databse(mongodb) i.e this function will run before post
UserSchema.pre('save', async function(next) {
    //console.log('User is about to be created and saved', doc)

    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)

    next()
})

//static function for user model schema

UserSchema.statics.login = async function (email, password){
    const user = await this.findOne({ email })

    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user
        }
        throw Error('incorrect password')
    }

    throw Error('incorrect email')


}

module.exports = mongoose.model('User', UserSchema)



