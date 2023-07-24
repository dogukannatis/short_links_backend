const {body} = require("express-validator");


const validateNewUser = () => {
    return [
        body("email").trim().isEmail().withMessage("Please enter a valid email"),
        body("password").trim().isLength({min:6}).withMessage("Password length should be minimum 6 chracter"),
        body("password").trim().isLength({max:50}).withMessage("Password length should be maximum 50 chracter"),
        /*
        body("repassword").trim().custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error("Passwords are not match");
            }else{
                return true;
            }
        }),
        */
    ];
}


module.exports = {
    validateNewUser
};