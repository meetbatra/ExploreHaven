const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow('', null),
        price: Joi.number().required(),
        category: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        from: Joi.date().required(),
        to: Joi.date().required()
    }).required()
});