import express from "express";
import providerController from "../controller/providerController.js";
import auth from "../middleware/auth.js"
import checkRole from "../middleware/checkRole.js";

const router = express.Router()


router.post("/registerAsProvider", auth, providerController.registerAsProvider)

router.get("/getAllProvider", auth, checkRole("admin", "super_admin"), providerController.getAllProvider)

export default router