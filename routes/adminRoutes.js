import express from "express";

import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import validate from "../middleware/validate.js";

import {
    createCategorySchema,
    updateCategorySchema,
} from "../validation/categorySchema.js";
import {
    createServiceSchema,
    updateServiceSchema,
} from "../validation/servicesSchema.js";

import userController from "../controller/userController.js";
import categoryController from "../controller/categoryController.js";
import serviceController from "../controller/servicesController.js";

const router = express.Router();

//USER ROUTES 
router.get("/allUser", auth, checkRole("admin", "super_admin"), userController.allUser,);

router.patch("/update/:id", auth, checkRole("admin", "super_admin"), userController.update,);

router.delete("/delete/:id", auth, checkRole("admin", "super_admin"), userController.deleteUser,);

//CATEGORY ROUTES 


router.post("/addCategory", auth, validate(createCategorySchema), checkRole("admin", "super_admin"), categoryController.add,);


router.get("/categories", auth, checkRole("admin", "super_admin"), categoryController.getAll,);


router.get("/category/:id", auth, checkRole("admin", "super_admin"), categoryController.getById,);


router.patch("/category/:id", auth, validate(updateCategorySchema), checkRole("admin", "super_admin"), categoryController.update,);


router.delete("/category/:id", auth, checkRole("admin", "super_admin"), categoryController.deleteCategory);

//SERVICE ROUTES 


router.post("/addService", auth, validate(createServiceSchema), checkRole("admin", "super_admin"), serviceController.add,
);


router.get("/services", auth, checkRole("admin", "super_admin"), serviceController.getAll,);


router.get("/service/:id", auth, checkRole("admin", "super_admin"), serviceController.getById,);


router.patch("/service/:id", auth, validate(updateServiceSchema), checkRole("admin", "super_admin"), serviceController.update,);


router.delete("/service/:id", auth, checkRole("admin", "super_admin"), serviceController.deleteService,);

export default router;