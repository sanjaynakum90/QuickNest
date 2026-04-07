import express from "express";

import userController from "../controller/userController.js";
import UserSchema from "../validation/userSchema.js";

import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import uploads from "../middleware/upload.js";

const router = express.Router();

router.post("/add", validate(UserSchema),uploads.single("profilePic"), userController.add);

router.post("/login", userController.login);

router.get("/authLogin", auth, userController.authLogin);

router.post("/logOut", auth, userController.logOut);

router.post("/logOutAll", auth, userController.logOutAll);



router.patch("/update", auth, userController.update);

router.delete("/delete", auth, userController.deleteUser);

export default router;
