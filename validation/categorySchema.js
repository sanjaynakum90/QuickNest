import Joi from "joi";

const CategorySchema = Joi.object({
    name: Joi.string().min(2).trim().label("Category Name").messages({
        "string.base": "category name must be a string",
        "string.empty": "category name is required",
        "string.min": "category name must be at least 2 characters long",
    }),

    description: Joi.string().allow("").label("Description").messages({
        "string.base": "description must be in string format",
    }),
});



export const createCategorySchema = CategorySchema.fork(
    ["name"],
    (field) => field.required()
).messages({
    "any.required": "{#label} is required",
});



export const updateCategorySchema = CategorySchema.fork(
    ["name", "description"],
    (field) => field.optional()
)
    .or("name", "description")
    .messages({
        "object.missing": "At least one of name or description must be provided for update",
    });