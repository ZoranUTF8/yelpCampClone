const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

// sanitizing HTML input using JOI extension
const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error("string.escapeHTML", {
                    value
                })
                return clean;
            }
        }
    }
})
// add extension to Joi
const Joi = BaseJoi.extend(extension);


module.exports.campValidator = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(), FIX LATER
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewValidator = Joi.object({
    review: Joi.object({
        text: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(0).max(5)
    }).required()
})