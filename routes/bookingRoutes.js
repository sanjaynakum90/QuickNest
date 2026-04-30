import express from "express";
import bookingController from "../controllers/bookingController.js";
import auth from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();


// CREATE BOOKING
router.post(
    "/create",
    auth,
    bookingController.createBooking
);


// ALL BOOKINGS
router.get(
    "/all",
    auth,
    bookingController.getAllBooking
);


// Own bookings (customer)
router.get(
    "/user",
    auth,
    bookingController.getBookingsByUserId
);


// BOOKINGS BY SERVICE ID
router.get(
    "/service/:id",
    auth,
    bookingController.getAllService
);


// BOOKING BY ID
router.get(
    "/my/:id",
    auth,
    bookingController.getBookingById
);


// Bookings by userId (admin)
router.get(
    "/user/:id",
    auth,
    checkRole("admin", "super_admin"),
    bookingController.getBookingsByUserId
);


// AVAILABLE TIME SLOTS
router.get(
    "/availableTimeSlots",
    auth,
    bookingController.availableTimeSlots
);


// CONFIRM BOOKING
router.patch(
    "/confirm/:id",
    auth,
    checkRole("admin", "super_admin"),
    bookingController.confirmBookingStatus
);


// CANCEL BOOKING
router.patch(
    "/cancel/:id",
    auth,
    bookingController.cancelBookingStatus
);


// COMPLETE BOOKING
router.patch(
    "/complete/:id",
    auth,
    checkRole("admin", "super_admin"),
    bookingController.completeBookingStatus
);


export default router;