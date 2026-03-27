import Joi from "joi";

const registerSchema = Joi.object({
    
    name: Joi.string().trim().min(2).required()
        .messages({
            "string.base": "Name must be a string",
            "string.empty": "Name is required",
            "string.min": "Name must be at least 2 characters long",
            "any.required": "Name is required",
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Email must be a valid email",
            "string.empty": "Email is required",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .trim()
        .pattern(/^[a-zA-Z0-9]{3,30}$/)
        .required()
        .messages({
            "string.pattern.base":
                "Password must be 3-30 characters and contain only letters and numbers",
            "string.empty": "Password is required",
            "any.required": "Password is required",
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            "string.pattern.base": "Phone number must be exactly 10 digits",
            "string.empty": "Phone number is required",
            "any.required": "Phone number is required",
        }),

    role: Joi.string()
});

export const validateRegister = (data) => {
    const { error, value } = registerSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        return {
            success: false,
            errors: error.details.map((err) => ({
                field: err.path[0],
                message: err.message,
            })),
        };
    }

    return {
        success: true,
        data: value,
    };
};

export default registerSchema;