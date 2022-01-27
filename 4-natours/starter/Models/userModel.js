const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
        minlength: 8,
        select:false
    },
    confirmPassword : {
        type: String,
        required : [true,"This field is required"],
        validate:{
            validator: function(entry){
                return this.password === entry
            },
            message: "doesnt match entered password "
        
    }},
    passwordChangedAt:Date,
    role:{
        type:String,
        enum:["admin",'user','tour-guide'],
        required:[true,'Please assign a role to the user']
    },
    resetToken : String
})

userSchema.pre("save",async function(next){
    
    if(!this.isModified('password')) return;
    
    const encryptedPassword =await bcrypt.hash(this.password,12);
    
    this.password = encryptedPassword;
    
    this.confirmPassword = undefined;
    
next()
})

userSchema.methods.comparePasswords = async (newPassword,originalPassword) => await bcrypt.compare(newPassword,originalPassword);

userSchema.methods.checkPasswordUpdate = (JWTTimeStamp)=>{
    
    if(this.passwordChangedAt){
        const passwordChangedAtTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        
        return JWTTimeStamp < passwordChangedAtTimeStamp 
    }
    
    
    return false 
}

userSchema.methods.generateResetToken= async ()=>{
    
    const tokenString = crypto.randomBytes(32).toString('hex')
    
    this.resetToken = await crypto.createHash('sha25').update(tokenString).digest('hex')
    
    
}


const UserModel = mongoose.model('User',userSchema)

module.exports = UserModel 