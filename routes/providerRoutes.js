import express from "express";
import providerController from "../controller/providerController.js";
import auth from "../middleware/auth.js"

const router = express.Router()


router.post("/registerAsProvider", auth, providerController.registerAsProvider)

export default router