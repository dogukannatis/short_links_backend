const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("@hapi/joi");

var httpRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const LinkSchema = new Schema({
    "original_link": {
        type: String,
        required: true,
        trim: true,
        validate: httpRegex
    },
    "link_ref": {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    "belongs_to": {
        type: String,
        required: true,
        trim: true,
    },
    "click" : {
        type: Number,
        default: 0
    }
}, {collection: "links", timestamps: true});

const schema = Joi.object({
    original_link : Joi.string().regex(httpRegex).required().trim(),
    link_ref : Joi.string().required().trim(),
    belongs_to : Joi.string().required().trim(),
    click : Joi.number()
});


LinkSchema.methods.joiValidation = function (linkObject){
    schema.required();
    return schema.validate(linkObject);
}

LinkSchema.statics.joiValidationForUpdate = function (linkObject){
    return schema.validate(linkObject);
}



LinkSchema.methods.toJSON = function (){
    const link = this.toObject();

    delete link.createdAt;
    delete link.updatedAt;
    delete link.__v;

    return link;
}


const Link = mongoose.model("Link", LinkSchema);


module.exports = Link;