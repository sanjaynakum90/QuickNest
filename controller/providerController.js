import Provider from "../model/provider.js";
import HttpError from "../middleware/HttpError.js";
import User from "../model/User.js";
import Service from "../model/Services.js";

const registerAsProvider = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    const existingProvider = await Provider.findOne({ userId });
    if (existingProvider) {
      return next(new HttpError("Provider already registered with this account", 400));
    }

    const { service, experience, documents } = req.body;

    if (!service || !Array.isArray(service) || service.length === 0) {
      return next(new HttpError("At least one service is required", 400));
    }

    const validServices = await Service.find({ _id: { $in: service } }).select("_id");

    if (validServices.length !== service.length) {
      return next(new HttpError("One or more services are invalid", 400));
    }

    const newProvider = new Provider({
      userId,
      service: validServices.map((s) => s._id),
      experience,
      documents,
    });

    user.role = "provider";
    await user.save();
    await newProvider.save();

    res.status(201).json({
      success: true,
      message: "Provider account registered. Awaiting admin approval.",
      newProvider,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getAllProvider = async (req, res, next) => {
  try {
    let query = {};
    const { isVerified } = req.query;

    if (isVerified !== undefined) {
      query.isVerified = isVerified === "true"; // convert string to boolean
    }

    const providers = await Provider.find(query).populate("userId", "name email phone role").populate("service", "name price duration");

    if (providers.length === 0) {
      return res.status(200).json({ success: true, message: "No providers found", providers: [] });
    }

    res.status(200).json({ success: true, message: "Providers fetched successfully", providers });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// ─── NEW: Get provider by ID ──────────────────────────────────────────────────
const getProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id)
      .populate("userId", "name email phone role")
      .populate("service", "name price duration description");

    if (!provider) {
      return next(new HttpError("Provider not found", 404));
    }

    res.status(200).json({ success: true, message: "Provider fetched successfully", provider });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// ─── NEW: Update provider ─────────────────────────────────────────────────────
const updateProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = req.user.role;
    const loginUserId = req.user._id;

    const provider = await Provider.findById(id);
    if (!provider) {
      return next(new HttpError("Provider not found", 404));
    }

    // Only the provider themselves or admin can update
    if (
      role !== "admin" &&
      role !== "super_admin" &&
      provider.userId.toString() !== loginUserId.toString()
    ) {
      return next(new HttpError("Unauthorized access", 403));
    }

    const updates = Object.keys(req.body);
    let allowedFields = ["service", "experience", "documents"];

    // Only admin can update isVerified
    if (role === "admin" || role === "super_admin") {
      allowedFields.push("isVerified");
    }

    const isValid = updates.every((field) => allowedFields.includes(field));
    if (!isValid) {
      return next(new HttpError("Only allowed fields can be updated", 400));
    }

    // If updating services, validate they exist
    if (req.body.service) {
      if (!Array.isArray(req.body.service) || req.body.service.length === 0) {
        return next(new HttpError("Service must be a non-empty array", 400));
      }
      const validServices = await Service.find({ _id: { $in: req.body.service } }).select("_id");
      if (validServices.length !== req.body.service.length) {
        return next(new HttpError("One or more services are invalid", 400));
      }
      provider.service = validServices.map((s) => s._id);
      updates.splice(updates.indexOf("service"), 1); // already handled
    }

    updates.forEach((field) => {
      if (field !== "service") provider[field] = req.body[field];
    });

    await provider.save();
    await provider.populate("userId", "name email phone role");
    await provider.populate("service", "name price duration");

    res.status(200).json({ success: true, message: "Provider updated successfully", provider });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// ─── NEW: Delete provider ─────────────────────────────────────────────────────
const deleteProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = req.user.role;
    const loginUserId = req.user._id;

    const provider = await Provider.findById(id);
    if (!provider) {
      return next(new HttpError("Provider not found", 404));
    }

    // Only admin or the provider themselves can delete
    if (
      role !== "admin" &&
      role !== "super_admin" &&
      provider.userId.toString() !== loginUserId.toString()
    ) {
      return next(new HttpError("Unauthorized access", 403));
    }

    // Revert the user's role back to customer
    await User.findByIdAndUpdate(provider.userId, { role: "customer" });

    await Provider.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Provider deleted successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default {
  registerAsProvider,
  getAllProvider,
  getProviderById,
  updateProvider,
  deleteProvider,
};