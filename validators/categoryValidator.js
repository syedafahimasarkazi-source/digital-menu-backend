const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(250).optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().max(50).optional(),
  description: Joi.string().max(250).optional(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};