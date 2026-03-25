const Joi = require("joi");

exports.createMenuSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().required(),
  category: Joi.string().required(),
});

exports.updateMenuSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(""),
  price: Joi.number(),
  category: Joi.string(),
  isAvailable: Joi.boolean(),
});