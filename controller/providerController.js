import Provider from "../model/provider.js";
import HttpError from "../middleware/HttpError.js";
import User from "../model/UserModel.js";
import Service from "../model/service.js";

import services from "../services/emailTemplate.js";

const registerAsProvider = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("User not Found", 404));
    }

    const existingProvider = await Provider.findById(userId);

    if (!existingProvider) {
      return next(
        new HttpError("Already provider Registered with this id", 500),
      );
    }

    const { service, experience, documents } = req.body;

    if (!service || Array.isArray(service) || service.length === 0) {
      return next(new HttpError("Service is Required", 500));
    }

    const validService = await Service.find({
      _id: { $in: Services },
    }).select("_id");

    if (validService.length !== Service.length) {
      return next(new HttpError("Service are missing"));
    }

    const newProvider = new Provider({
      userId,
      service: validService,
      experience,
      documents,
    });

    user.role="provider"

    await newProvider.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Provider Account registered wait for Admin approval",
        newProvider,
      });
  } catch (error) {
    next(new HttpError(error.message));
  }
};



export default {registerAsProvider};