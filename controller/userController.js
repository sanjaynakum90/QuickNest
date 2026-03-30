import HttpError from "../middleware/HttpError.js";
import User from "../model/User.js";

const addUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, roll } = req.body;

    const newUser = {
      name,
      email,
      password,
      phone,
      roll,
    };

    const user = new User(newUser);

    await user.save();

    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);

    if (!user) {
      return next(new HttpError("Unable to login ", 400));
    }

    const token = await user.generateAuthToken();

    res
      .status(200)
      .json({ success: true, message: "Login Successfully", user, token });
  } catch (error) {
    next(new HttpError(error.message, 404));
  }
};

const authLogin = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new HttpError("Unable to login"));
    }

    res.status(201).json({ success: true, user });
  } catch (error) {
    next(new HttpError(error.message, 404));
  }
};

export default { addUser, loginUser, authLogin };