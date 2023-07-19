const express = require("express");
const { Mongoose } = require("mongoose");
const router = express.Router();
const User = require("../models/userModel");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/", async (req, res) => {
    const allUsers = await User.find({});

    res.json(allUsers);

});


router.post("/signin", async (req, res, next) => {

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

});

router.get("/me", authMiddleware, async (req, res) => {
    
});


router.get("/:id", async (req, res, next) => {
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
});


router.post("/", async (req, res, next) => {

    try{
        const willBeAddedUser = new User(req.body);

        willBeAddedUser.password = await bcrypt.hash(req.body.password, 10);

        const {err, value} = willBeAddedUser.joiValidation(req.body);
        
        if(err){
            next(createError(400, err));
        }else{
            const result = await willBeAddedUser.save();
            res.json(result); 
        }

        
    }catch(e){
        next(e);
        console.log("Hata: " + e);
    }

});


router.patch("/:id", async (req, res, next) => {

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
})


router.delete("/:id", async (req, res, next) => {
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

});










module.exports = router;

