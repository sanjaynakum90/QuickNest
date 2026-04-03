import express from "express";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import adminController from "../controller/adminController.js";

const router = express.Router()

router.patch("/update/:id", auth, checkRole("admin", "super_admin"), adminController.updateUserData)

router.delete("/delete/:id", auth, checkRole("admin", "super_admin"), adminController.deleteUserData)

export default router