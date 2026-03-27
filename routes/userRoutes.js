import express from "express";
import validate from "../middleware/validate.js";
import registerSchema from "../validation/registerSchema.js";
import userController from "../controller/userController.js";

const router = express.Router()

router.post("/add", validate(registerSchema), userController.addUser)

router.post("/login", userController.loginUser)

export default router