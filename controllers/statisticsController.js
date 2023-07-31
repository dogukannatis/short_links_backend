
const Link = require("../models/linkModel");
const User = require("../models/userModel");
const createError = require("http-errors");


const getAll = async (req, res, next) => {
    try{
        const numberOfUsers = await User.countDocuments({});
        const numberOfLinks = await Link.countDocuments({});

        return res.status(200).json({
            "users" : numberOfUsers,
            "links" : numberOfLinks
        })

    }catch(e){
        next(createError(400,e));
    }
}

module.exports = {
    getAll
}