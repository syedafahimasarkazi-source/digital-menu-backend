const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ID");
  }
  return value;
};

exports.createMenuSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().required(),
  category: Joi.string().required().custom(objectId),
});

exports.updateMenuSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(""),
  price: Joi.number(),
  category: Joi.string().custom(objectId),
  isAvailable: Joi.boolean(),
});