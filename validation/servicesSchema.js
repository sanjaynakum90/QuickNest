import Joi from "joi";

const ServiceSchema = Joi.object({
    name: Joi.string().min(2).trim().label("Name").messages({
        "string.base": "Name must be in string format",
        "string.empty": "name is required",
        "string.min": "name must be at least 2 character long",
    }),

    description: Joi.string().allow("").label("Description").messages({
        "string.base": "description must be in string format",
    }),

    price: Joi.number().min(0).label("Price").messages({
        "number.base": "price must be a number",
        "number.empty": "price is required",
        "number.min": "price must be greater than or equal to 0",
    }),

    duration: Joi.number().min(0).label("Duration").messages({
        "number.base": "duration must be a number",
    }),

    category: Joi.string()
        .hex()
        .length(24)
        .label("Category")
        .messages({
            "string.empty": "category is required",
            "string.length": "category must be a valid ObjectId",
        }),

    isActive: Joi.boolean().label("isActive").messages({
        "boolean.base": "isActive must be true or false",
    }),
});

export const createServiceSchema = ServiceSchema.fork(
    ["name", "price", "category"],
    (fields) => fields.required()
).messages({
    "any.required": "{#label} is required",
});

export const updateServiceSchema = ServiceSchema.fork(
    ["name", "description", "price", "duration", "isActive"],
    (fields) => fields.optional()
)
    .fork(["category"], (fields) => fields.optional())
    .or("name", "description", "price", "duration", "isActive")
    .messages({
        "object.missing": "name, description, price, duration or isActive any of these field required when updating",
    });