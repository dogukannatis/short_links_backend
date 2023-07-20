const jwt = require("jsonwebtoken");
const constants = require("../constants");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
    try{
        if(req.header("Authorization")){
            const token = req.header("Authorization").replace("Bearer ", "");
            const result = jwt.verify(token, constants.secretKey);
            const user = await User.findById({
                _id: result._id
            });

            if(user){
                req.user = user;
            }else{
                throw new Error("Please sign in");
            }

            next();
        }else{
            throw new Error("Please sign in");
        }

    }catch(e){
        next(e);
    }


}

module.exports = auth;