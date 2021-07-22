const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    
    name : {
        type: String,
        required : [true,"The name field is required "]
    },
    email :{
        type: String,
        required : [true,"The email field is required "],
        validate : [validator.isEmail, "please enter a valid email address"],
        unique:true,
        lowercase:true
    },
    photo:String,
    password : {
        type: String,
        required : [true,"The password field is required"],
        minlength: 8    
    },
    confirmPassword : {
        type: String,
        required : [true,"This field is required"],
        validate:{
            validator: function(entry){
                return this.password === entry
            },
            message: "doesnt match entered password "
        }
    }
})


//define a document middleware that takes the password of the user and encrypts it before saving it to the database

userSchema.pre('save', async function(next){
    
    if(!this.isModified) return next();
    
    this.password = await bcrypt.hash(this.password,12)
    this.confirmPassword =undefined
    
    next()
    
})

const UserModel = mongoose.model('User',userSchema)

module.exports = UserModel