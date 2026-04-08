import express from "express";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import adminController from "../controller/adminController.js";
import categoryController from "../controller/categoryController.js";

const router = express.Router()

router.get(
    "/allUser",
    auth,
    checkRole("admin", "super_admin"),
    userController.allUser,
);

router.patch(
    "/update/:id",
    auth,
    checkRole("admin", "super_admin"),
    adminController.updateUserData);

router.delete(
    "/delete/:id",
    auth, checkRole("admin", "super_admin"),
    adminController.deleteUserData);

router.post(
    "/add",
    auth,
    checkRole("admin", "super_admin"),
    categoryController.add
);

router.post(
    "/addService",
    auth,
    checkRole("admin","super_admin"),
    ser
)

export default router