const { link } = require("@hapi/joi");
const Link = require("../models/linkModel");
const createError = require("http-errors");
const stringGenerator = require('unique-string-generator');



const getAllLinks =  async (req, res) => {
    const allLinks = await Link.find({});

    res.json(allLinks);

}


const getMyLinks = async (req, res) => {

    const links = await Link.find({"belongs_to" : req.user._id});

    res.json(links); 


}

const addLink = async (req, res, next) => {

    try{


        const link_ref = stringGenerator.UniqueCharOTP(6);
        console.log("link ref is " + link_ref);

        req.body.link_ref = link_ref;
        req.body.belongs_to = req.user._id;

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

const deleteAll = async (req, res, next) => {
    try{
        const result = await Link.deleteMany();

        if(result){
            return res.json({
                "message" : "All links has been deleted"
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


const redirect = async (req, res, next) => {
    try{

        const link_ref = req.params.ref;

        const link = await Link.findOne({
            link_ref: link_ref
        }, {original_link: 1, click: 1});

        console.log("link: " + link);

        const original_link = link.original_link;

        if(!original_link){
            throw createError(404, "URL is not found");
        }else{
            const click = link.click + 1;
            await Link.updateOne({
                link_ref: link_ref
            }, {click: click});

            res.redirect(301,original_link);
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
    deleteAll,
    deleteMyLink,
    redirect
}