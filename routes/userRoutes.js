import express from "express";

import userController from "../controller/userController.js";
import validate from "../middleware/validate.js";
import UserSchema from "../validation/userSchema.js";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import uploads from "../middleware/upload.js";

const router = express.Router();

router.post("/add", validate(UserSchema),uploads.single("profilePic"), userController.add);

router.post("/login", userController.login);

router.get("/authLogin", auth, userController.authLogin);

router.post("/logOut", auth, userController.logOut);

router.post("/logOutAll", auth, userController.logOutAll);

router.get(
  "/allUser",
  auth,
  checkRole("admin", "super_admin"),
  userController.allUser,
);

router.patch("/update", auth, userController.update);

router.delete("/delete", auth, userController.deleteUser);

export default router;
