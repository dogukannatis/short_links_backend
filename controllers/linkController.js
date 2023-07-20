const Link = require("../models/linkModel");
const createError = require("http-errors");

const getAllLinks =  async (req, res) => {
    const allLinks = await Link.find({});

    res.json(allLinks);

}


const getMyLinks = async (req, res) => {
    res.json(req.user);
}

const addLink = async (req, res, next) => {

    try{
        const willBeAddedLink = new Link(req.body);

        const {err, value} = willBeAddedLink.joiValidation(req.body);
        
        if(err){
            next(createError(400, err));
        }else{
            const result = await willBeAddedLink.save();
            res.json(result); 
        }

        
    }catch(e){
        next(e);
        console.log("Hata: " + e);
    }

}


const deleteLinkWithId = async (req, res, next) => {
    try{

        console.log(req.params);

        const result = await Link.findByIdAndRemove({
            _id: req.params.id,
        });

        if(result){
            return res.json({
                "message" : "Link has been deleted"
            });
        }else{
            throw createError(404, "Link not found");
        }
    

    }catch(e){
        next(createError(400,e));
    }

}

const deleteMyLink = async (req, res, next) => {
    try{

       
        const link = await Link.findById({
            _id: req.params.id,
        });

        console.log(req.user._id);

        if(link.belongs_to != req.user._id){
            throw createError(404, "Link not found");
        }


        const result = await Link.findByIdAndRemove({
            _id: req.params.id,
        });

        if(result){
            return res.json({
                "message" : "Link has been deleted"
            });
        }else{
            throw createError(404, "Link not found");
        }
    

    }catch(e){
        next(createError(400,e));
    }

}



module.exports = {
    getAllLinks,
    getMyLinks,
    addLink,
    deleteLinkWithId,
    deleteMyLink
}