const Joi = require('joi');

// Schema for validating a listing
module.exports.validateSchema = Joi.object({
  listings: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
      filename: Joi.string().allow('', null),
      url: Joi.string().allow('', null),
    }).allow(null), // Allow `null` or undefined; remove `' '` as it's rarely intentional
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

// Schema for validating a review
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
