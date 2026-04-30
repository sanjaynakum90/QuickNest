import HttpError from "../middleware/HttpError.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

import sendEmail from "../utils/sendEmail.js";
import { getWelcomeEmailTemplate } from "../services/emailTemplate.js";

import crypto from "crypto";
import { getForgotPasswordEmailTemplate } from "../services/emailTemplate.js";



// CREATE USER
const add = async (req, res, next) => {
  try {

    const { name, email, password, phone } = req.body;

    const newUser = {
      name,
      email,
      password,
      phone,
      profilePic: req.file ? req.file.path : "undefined",
      cloudinaryId: req.file ? req.file.filename : "undefined",
    };

    console.log("cloudinaryId", newUser.cloudinaryId);

    const user = new User(newUser);

    await user.save();

    sendEmail({
      to: newUser.email,
      subject: "Welcome to QuickNest",
      html: getWelcomeEmailTemplate(newUser.name)
    })

    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// LOGIN USER
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);

    if (!user) {
      return next(new HttpError("unable to login", 400));
    }

    const token = await user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// PROTECTED ROUTE
const authLogin = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new HttpError("unable to login", 401));
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// LOGOUT
const logOut = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => {
      return t.token != req.token;
    });

    await req.user.save();

    res
      .status(200)
      .json({ success: true, message: "user logOut successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// LOGOUT ALL
const logOutAll = async (req, res, next) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.status(200).json({
      success: true,
      message: "user logOut from all device successfully",
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// GET ALL 
const allUser = async (req, res, next) => {
  try {

    const { role, limit, skip, sortBy } = req.query

    let query = {};

    let sortByValue = {};

    if (role) {
      query.role = role
    }

    if (sortBy) {
      const [field, order] = sortBy.split(":");

      sortByValue[field] = order === "desc" ? -1 : 1;
    }

    const users = await User.find(query).limit(parseInt(limit) || 5).skip(parseInt(skip) || 0).sort(sortByValue);

    if (users.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "no user data found" });
    }

    res.status(200).json({
      success: true,
      message: "all user data fetched",
      users,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// UPDATE 
const update = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new HttpError("user not found", 404));
    }

    const updates = Object.keys(req.body);
    const allowedFields = ["name", "password", "phone"];

    const isValid = updates.every((field) =>
      allowedFields.includes(field)
    );

    if (!isValid) {
      return next(
        new HttpError("only allowed field can be updated", 400)
      );
    }


    if (req.file) {
      if (user.cloudinaryId) {
        await cloudinary.uploader.destroy(user.cloudinaryId);
      }

      user.profilePic = req.file.path;
      user.cloudinaryId = req.file.filename;
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "user Data updated successfully",
      user,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// DELETE 
const deleteUser = async (req, res, next) => {
  try {
    const user = req.user;


    if (user.cloudinaryId) {
      await cloudinary.uploader.destroy(user.cloudinaryId);
    }

    await User.deleteOne(user);

    res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// FORGOT PASSWORD
const forgetPassword = async (req, res, next) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");


    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Reset Link
    const resetUrl = `${process.env.CLIENT_URL}/users/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: getForgotPasswordEmailTemplate(user.name, resetUrl),
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
      resetUrl,
    });

  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


// RESET PASSWORD
const resetPassword = async (req, res, next) => {
  try {

    const { token } = req.params;

    const { newPassword, confirmPassword } = req.body;


    if (newPassword !== confirmPassword) {
      return next(new HttpError("Passwords do not match", 400));
    }


    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");


    const user = await User.findOne({

      resetPasswordToken: hashedToken,

      resetPasswordExpiry: {
        $gt: Date.now()
      }

    });


    if (!user) {
      return next(new HttpError("Invalid or expired token", 400));
    }


    user.password = confirmPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await user.save();


    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

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
  forgetPassword,
  resetPassword
};