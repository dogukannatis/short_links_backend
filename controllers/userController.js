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

                console.log("decodedsa:" + decoded);
                if(error){
                    next(createError(400,"Token is invalid or expired"));
                }else{
                    const userId = decoded.id;
                    console.log("decoded:" + decoded);
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

const forgotPassword = async (req, res, next) => {

    const user = await User.findOne({
        "email" : req.body.email
    });

    if(user){

        console.log("user:: " + user);

        const jwtInfo = {
            "id": user._id,
            "email": user.email
        };

        console.log("user: " + jwtInfo);

        const secretKey = constants.resetPasswordSecretKey + "-" + user.password;

        const token = jwt.sign(jwtInfo, secretKey, {expiresIn: "1d"});


        const url = constants.url + "/api/users/resetPassword/" + user._id + "/" + token;


            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "linkshortenerproject@gmail.com",
                    pass: "emvtlmpvddmjflwx"
                }
            });

            transporter.sendMail({
                from: "Link Shortener App",
                to: user.email,
                subject: "Reset Password",
                text: "Please enter following link for reset your password " + url
            }, (error, info) => {
                if(error){
                    console.log("HATA" + error);
                }else{
                    console.log("mail sent");
                }
            });



    }else{
        next(createError(404, "User can not found"))
    }


}


const resetPassword = async (req, res, next) => {

    const id = req.params.id;
    const token = req.params.token;

    if(id && token){

        const user = await User.findOne({
            _id: id
        });


        if(user){

            const secretKey = constants.resetPasswordSecretKey + "-" + user.password;
        

        jwt.verify(token, secretKey, async (e, decoded) => {
            if(e){
                next(createError(500, "Paramaters error"));
            }else{
                res.render("resetPassword", {id: id, token: token, layout: "./views/resetPassword.ejs"});
            }
        });

        }else{
            next(createError(404, "User not found"));
        }

    }else{
        next(createError(500, "Paramaters are not correct"));
    }


}


const saveNewPassword = async (req, res, next) => {

    console.log("body" + req.body);

    const newPassword = await bcrypt.hash(req.body.password,10);

    const result = await User.findByIdAndUpdate(req.body.id, {
        password: newPassword
    })

    if(result){

        console.log("password has been changed!");
        res.render("successPage", {layout: "./views/successPage.ejs"});
    }else{
        res.status(500).json({
            "error" : "Something went wrong"
        });
    }


    //res.redirect("/api/users/resetPassword/" + req.body.id + "/" + req.body.token);
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
    verifyEmail,
    forgotPassword,
    resetPassword,
    saveNewPassword
}