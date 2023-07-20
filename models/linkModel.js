const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("@hapi/joi");


const LinkSchema = new Schema({
    "original_link": {
        type: String,
        required: true,
        trim: true,
    },
    "short_link": {
        type: String,
        trim: true,
    },
    "belongs_to": {
        type: String,
        required: true,
        trim: true,
    }
}, {collection: "links", timestamps: true});

const schema = Joi.object({
    original_link : Joi.string().required().trim(),
    short_link : Joi.string().trim(),
    belongs_to : Joi.string().required().trim()
});


LinkSchema.methods.joiValidation = function (linkObject){
    schema.required();
    return schema.validate(linkObject);
}

LinkSchema.statics.joiValidationForUpdate = function (userlinkObjectObject){
    return schema.validate(linkObject);
}



LinkSchema.methods.toJSON = function (){
    const link = this.toObject();

    delete link._id;
    delete link.createdAt;
    delete link.updatedAt;
    delete link.__v;

    return link;
}


const Link = mongoose.model("Link", LinkSchema);


module.exports = Link;