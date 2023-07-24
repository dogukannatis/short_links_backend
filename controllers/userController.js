const User = require("../models/userModel");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const {validationResult} = require("express-validator");
const nodemailer = require("nodemailer");
const constants = require("../constants");
const jwt = require("jsonwebtoken");


const getAllUsers =  async (req, res) => {
    const allUsers = await User.find({});

    res.json(allUsers);

}

const getMyData = async (req, res) => {
    res.json(req.user);
}

const signIn = async (req, res, next) => {

    try{
        const user = await User.signIn(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.json({
            user: user,
            token: token
        });

    }catch(e){
        next(e);
    }

}

const updateUserDate = async (req, res) => {
    delete req.body.createdAt;
    delete req.body.updatedAt;

    if(req.body.hasOwnProperty("password")){
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }


    const {err, value} = User.joiValidationForUpdate(req.body);

    if(err){
        next(createError(400,e));
    }else{
        try{

            const result = await User.findByIdAndUpdate({
                _id: req.user._id
            },req.body, {new: true, runValidators: true});
        
            if(result){
                return res.json(result);
            }else{
                return res.status(404).json({
                    "message" : "User can nat be found"
                });
            }
            
        
        }catch(e){
            next(createError(400,e));
        }
    }
}

const getUserWithId = async (req, res, next) => {
    try{
        const result = await User.findById({
            _id: req.params.id
        },req.body, {new: true});
        if(result){
            return res.json(result);
        }else{
            return res.status(404).json({
                "message" : "User can nat be found"
            });
        }
    

    }catch(e){
        next(e);
        console.log("Hata: " + e);
    }
}

const saveUser = async (req, res, next) => {

    try{
        const willBeAddedUser = new User(req.body);

        willBeAddedUser.password = await bcrypt.hash(req.body.password, 10);

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            console.log(errors.array());
            res.json({
                "errors" : errors.array()
            })
        }else{
            const result = await willBeAddedUser.save();
            res.json(result); 


            // Email validation

            const jwtInfo = {
                id: willBeAddedUser._id,
                email: willBeAddedUser.email
            }
            console.log(jwtInfo);

            const token = jwt.sign(jwtInfo, constants.emailConfirmSecretKey, {expiresIn: "1d"});

            const url = constants.url + "/api/users/verifyEmail?id=" + token;

            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "linkshortenerproject@gmail.com",
                    pass: "emvtlmpvddmjflwx"
                }
            });

            transporter.sendMail({
                from: "Link Shortener App",
                to: willBeAddedUser.email,
                subject: "Verify Your Email",
                text: "Please enter following link for verify email " + url
            }, (error, info) => {
                if(error){
                    console.log("HATA" + error);
                }else{
                    console.log("mail sent");
                }
            });


        }


        /*
        const {err, value} = willBeAddedUser.joiValidation(req.body);
        
        if(err){
            next(createError(400, err));
        }else{
            const result = await willBeAddedUser.save();
            res.json(result); 
        }
        */

        
    }catch(e){
        next(e);
        console.log("Hata: " + e);
    }

}

const updateUser = async (req, res, next) => {

    delete req.body.createdAt;

    if(req.body.hasOwnProperty("password")){
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }


    const {err, value} = User.joiValidationForUpdate(req.body);

    if(err){
        next(createError(400,e));
    }else{
        try{

            const result = await User.findByIdAndUpdate({
                _id: req.params.id
            },req.body, {new: true, runValidators: true});
        
            if(result){
                return res.json(result);
            }else{
                return res.status(404).json({
                    "message" : "User can nat be found"
                });
            }
            
        
        }catch(e){
            next(createError(400,e));
        }
    }   
}

const deleteUser = async (req, res, next) => {
    try{
        const result = await User.findByIdAndRemove({
            _id: req.user._id
        });

        if(result){
            return res.json({
                "message" : "User has been deleted"
            });
        }else{
            throw createError(404, "User not found");
        }
    

    }catch(e){
        next(createError(400,e));
    }

}

const deleteUserWithId = async (req, res, next) => {
    try{
        const result = await User.findByIdAndRemove({
            _id: req.params.id
        });

        if(result){
            return res.json({
                "message" : "User has been deleted"
            });
        }else{
            throw createError(404, "User not found");
        }
    

    }catch(e){
        next(createError(400,e));
    }

}

const deleteAllUsers = async (req, res, next) => {
    try{
        const result = await User.deleteMany({
            isAdmin: false
        });

        if(result){
            return res.json({
                "message" : "All users has been deleted"
            });
        }else{
            throw createError(404, "User not found");
        }
    

    }catch(e){
        next(createError(400,e));
    }

}


const verifyEmail = async (req, res, next) => {

    const token = req.query.id;
    console.log("token:" + token);
    if(token){
        try{
            jwt.verify(token, constants.emailConfirmSecretKey, async (error, decoded) => {
                if(e){
                    next(createError(400,"Token is invalid or expired"));
                }else{
                    const userId = decoded.id;
                    console.log("userId:" + userId);
                    const result = await User.findByIdAndUpdate(
                        userId,
                        {
                            "isEmailVerified" : true
                        }
                    );

                    if(result){
                        return res.json({
                            "message" : "Email is verifed"
                        });
                    }else{
                        next(createError(404,"Error occured"));
                    }



                }
            });
        }catch(e){
            next(createError(400,e));
        }
    }else{
        next(createError(404,"Token not found"));
    }

}





module.exports = {
    getAllUsers,
    getMyData,
    signIn,
    updateUserDate,
    getUserWithId,
    saveUser,
    updateUser,
    deleteUser,
    deleteUserWithId,
    deleteAllUsers,
    verifyEmail
}