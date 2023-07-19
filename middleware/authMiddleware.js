const jwt = require("jsonwebtoken");
const constants = require("../constants");

const auth = (res, req, next) => {
    try{
        const token = req.header("Authorization").replace("Bearer ", "");
        const result = jwt.verify(token, constants.secretKey);
        next();


    }catch(e){
        next(e);
    }


}

module.exports = auth;