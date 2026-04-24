import HttpError from "../middleware/HttpError.js";
import User from "../model/User.js";
import cloudinary from "../config/cloudinary.js";

const add = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const newUser = {
      name,
      email,
      password,
      role,
      phone,
      profilePic: req.file ? req.file.path : undefined,
      cloudinaryId: req.file ? req.file.filename : undefined,
    };

    const user = new User(newUser);
    await user.save();

    res.status(201).json({ success: true, user });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);

    if (!user) {
      return next(new HttpError("Unable to login", 401));
    }

    const token = await user.generateAuthToken();

    res.status(200).json({ success: true, user, token });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const authLogin = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const logOut = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
    await req.user.save();

    res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const logOutAll = async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.status(200).json({
      success: true,
      message: "User logged out from all devices successfully",
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const allUser = async (req, res, next) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res.status(200).json({ success: true, message: "No user data found" });
    }

    res.status(200).json({ success: true, message: "All user data fetched", users });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const update = async (req, res, next) => {
  try {
    const targetedUserId = req.params.id || req.user._id;

    const user = await User.findById(targetedUserId);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    const isAdmin = req.user.role === "admin" || req.user.role === "super_admin";
    const isSelf = req.user._id.toString() === user._id.toString();

  
    if (!isAdmin && !isSelf) {
      return next(new HttpError("Unauthorized access", 403));
    }

    const updates = Object.keys(req.body);
    let allowedFields = ["name", "password", "phone", "profilePic"];

    if (isAdmin) {
      allowedFields = [...allowedFields, "role", "isVerified"];
    }

    const isValid = updates.every((field) => allowedFields.includes(field));
    if (!isValid) {
      return next(new HttpError("Only allowed fields can be updated", 400));
    }

    if (req.file) {
      if (user.cloudinaryId) {
        await cloudinary.uploader.destroy(user.cloudinaryId);
      }
      user.profilePic = req.file.path;
      user.cloudinaryId = req.file.filename;
    }

    updates.forEach((field) => (user[field] = req.body[field]));

    await user.save();

    res.status(200).json({ success: true, message: "User data updated successfully", user });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const targetedUserId = req.params.id || req.user._id;

    const user = await User.findById(targetedUserId);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    const isAdmin = req.user.role === "admin" || req.user.role === "super_admin";
    const isSelf = req.user._id.toString() === user._id.toString();

    
    if (!isAdmin && !isSelf) {
      return next(new HttpError("Unauthorized access", 403));
    }

    if (user.cloudinaryId) {
      await cloudinary.uploader.destroy(user.cloudinaryId);
    }

    await User.findByIdAndDelete(user._id);

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default {
  add,
  login,
  authLogin,
  logOut,
  logOutAll,
  allUser,
  update,
  deleteUser,
};