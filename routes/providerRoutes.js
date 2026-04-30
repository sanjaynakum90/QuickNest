import express from "express";
import providerController from "../controller/providerController.js";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// Register as provider (any authenticated user)
router.post("/registerAsProvider", auth, providerController.registerAsProvider);

// Get all providers (admin only), supports ?isVerified=true/false
router.get("/getAllProvider", auth, checkRole("admin", "super_admin"), providerController.getAllProvider);

// Get single provider by ID (admin or the provider themselves)
router.get("/:id", auth, providerController.getProviderById);

// Update provider (admin can update isVerified; provider can update own info)
router.patch("/update/:id", auth, providerController.updateProvider);

// Delete provider (admin or provider themselves)
router.delete("/delete/:id", auth, providerController.deleteProvider);

// provider can get own booking 

router.get("/getProviderBooking", auth, checkRole("provider"), providerController.getProviderBooking);

export default router;