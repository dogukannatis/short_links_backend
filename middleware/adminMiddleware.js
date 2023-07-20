
const admin = (req, res, next) => {

    if(!req.user.isAdmin){
        return res.status(403).json({
            "message" : "You don't have a permission for this operation"
        })
    }

    next();

}

module.exports = admin;