import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().min(2).trim().required().messages({
    "string.base": "Name must be in string format",
    "string.empty": "name is required",
    "string.min": "name must be atleast 2 character long",
    "any.required": "name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "email is required",
    "any.required": "email is required",
  }),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.empty": "password is required",
      "string.min": "password must be atleast 6 character long",
      "any.required": "password is required",
    }),
  phone: Joi.number().min(1000000000).max(9999999999).required().messages({
    "number.empty": "number is required",
    "any.required": "number is required",
  }),
  role: Joi.string()
    .valid("customer", "provider", "admin", "super_admin")
    .optional()
    .messages({
      "string.empty":
        "role is required from any of these customer. provider,admin,super_admin",
      "any.required": "role is required",
    }),
});

export default registerSchema;
