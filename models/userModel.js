const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("@hapi/joi");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const constants = require("../constants");

//const secretKey = "SecretKey.DA123";

const UserSchema = new Schema({
    "email" : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    "username" : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30,
    },
    "password": {
        type: String,
        required: true,
        minLength: 6,
        trim: true,
    }
}, {collection: "users", timestamps: true});


const schema = Joi.object({
    username : Joi.string().min(3).max(30).trim(),
    email : Joi.string().trim().email(),
    password : Joi.string().min(6).max(50).trim()
});

UserSchema.methods.joiValidation = function (userObject){
    schema.required();
    return schema.validate(userObject);
}

UserSchema.statics.joiValidationForUpdate = function (userObject){
    return schema.validate(userObject);
}


UserSchema.methods.toJSON = function (){
    const user = this.toObject();
    delete user._id;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.password;
    delete user.__v;
    return user;
}

/*
userSchema.methods.toJSON = function () {
 
  const user = this.toObject();
 
  const { isim, email, userName } = user;
 
  return { isim, email, userName };
};
*/


UserSchema.statics.signIn = async (email, password) => {

    const {error, value} = schema.validate({email, password});

    if(error){
        throw createError(400, error);
    }

    const user = await User.findOne({email: email});
    if(!user){
        throw createError(404, "Email or password is wrong");
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if(!checkPassword){
        throw createError(404, "Email or password is wrong");
    }

    return user;
}

UserSchema.methods.generateToken = async function (){
    const loggedInUser = this;
    const token = await jwt.sign({
        _id: loggedInUser._id,
        email: loggedInUser.email,
        username: loggedInUser.email
    }, constants.secretKey, {expiresIn: "24h"});
    return token;
}


const User = mongoose.model("User", UserSchema);



module.exports = User;