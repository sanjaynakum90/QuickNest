import HttpError from "./HttpError.js";

const validate = (schema) => (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      return next(new HttpError(error.details[0].message, 400));
    }
    next();
    return value;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default validate;
