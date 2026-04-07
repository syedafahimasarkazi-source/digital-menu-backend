const Joi = require("joi");

// ✅ ONLY NAME REQUIRED
exports.createCategorySchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Category name is required",
  }),
});

// ✅ UPDATE OPTIONAL
exports.updateCategorySchema = Joi.object({
  name: Joi.string().trim().optional(),
});