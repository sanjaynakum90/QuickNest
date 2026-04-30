import express from "express";

import userController from "../controllers/userController.js";

import validate from "../middleware/validate.js";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import uploads from "../middleware/upload.js";
import { authLimiter } from "../middleware/rateLimit.js";

import { createUserSchema, updateUserSchema } from "../validation/UserSchema.js";
import { forgetPasswordSchema, resetPasswordSchema } from "../validation/passwordSchema.js";


const router = express.Router();

// ADD USER
router.post(
    "/add",
    uploads.single("profilePic"),
    validate(createUserSchema),
    userController.add
);


// LOGIN USER
router.post(
    "/login",
    authLimiter,
    userController.login
);


// PROTECTED
router.get(
    "/authLogin",
    authLimiter,
    auth,
    userController.authLogin
);


router.post(
    "/logOut",
    auth,
    userController.logOut
);


router.post(
    "/logOutAll",
    auth,
    userController.logOutAll
);


router.get(
    "/allUser",
    auth,
    checkRole("admin", "super_admin"),
    userController.allUser
);


router.patch(
    "/update",
    uploads.single("profilePic"),
    validate(updateUserSchema),
    auth,
    userController.update
);


router.delete(
    "/delete",
    auth,
    userController.deleteUser
);


router.post(
    "/forget-password",
    validate(forgetPasswordSchema),
    userController.forgetPassword
);


router.post(
    "/reset-password/:token",
    validate(resetPasswordSchema),
    userController.resetPassword
);


export default router;