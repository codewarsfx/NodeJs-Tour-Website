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
    photo:{
        type:String,
        default:'default.jpg'
    },
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
        enum:["admin",'user','lead-guide','guide'],
        required:[true,'Please assign a role to the user']
    },
    resetToken : String,
    resetTokenExpires: Date,
    active:{
        type: Boolean,
        default: true
    }
})

userSchema.pre("save",async function(next){
    
    if(!this.isModified('password')) return next();
   
    const encryptedPassword =await bcrypt.hash(this.password,12);
    
    this.password = encryptedPassword;
    this.confirmPassword = undefined;
    
next()
})

userSchema.pre("save",function(next){
    
    if(!this.isModified('password') || this.isNew) return next();
    
    this.passwordChangedAt = Date.now() - 1000
    next()
} 
)

userSchema.pre(/^find/,function(next){
    
    this.find({active:{$ne:false}})
    
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




userSchema.methods.generateResetToken= function (){
    
    const tokenString = crypto.randomBytes(32).toString('hex')
    this.resetToken =  crypto.createHash('sha256').update(tokenString).digest('hex')

    this.resetTokenExpires = Date.now() +10 * 60 *1000
    return tokenString
    
}





const UserModel = mongoose.model('User',userSchema)

module.exports = UserModel 