import HttpError from "../middleware/HttpError.js";
import User from "../model/User.js";

const add = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const newUser = {
      name,
      email,
      password,
      role,
      phone,
      profilePic: req.file ? req.file.path : "undefined",
      cloudinaryId: req.file ? req.file.fileName : "undefined",
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

    const token = await user.generateAuthToken();

    if (!user) {
      return next(new HttpError("unable to login"));
    }

    res.status(200).json({ success: true, user, token });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const authLogin = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new HttpError("user not found", 404));
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

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

const allUser = async (req, res, next) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      res.status(200).json({ success: true, message: "no user data found" });
    }

    res
      .status(200)
      .json({ success: true, message: "all user data fetched", users });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const update = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new HttpError("user not found", 404));
    }

    const updates = Object.keys(req.body);

    const allowedFields = ["name", "password", "phone"];

    const isValid = updates.every((field) => allowedFields.includes(field));

    if (!isValid) {
      return next(new HttpError("only allowed field can be updated", 400));
    }

    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "user Data updated successfully", user });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = req.user;

    await User.deleteOne(user);

    res
      .status(200)
      .json({ success: true, message: "user deleted successfully" });
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
