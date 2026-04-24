import express from "express";
import auth from "../middleware/auth.js";
import bookingController from "../controller/bookingController.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// Create booking
router.post("/create", auth, bookingController.createBooking);

// Get available time slots for a service on a date (?serviceId=...&bookingDate=...)
router.get("/availableSlots", auth, bookingController.availableTimeSlot);

// Get all bookings (admin sees all, customer sees own)
router.get("/getallBookings", auth, bookingController.getAllBooking);

// Get bookings by service ID
router.get("/getByServiceId/:id", auth, bookingController.getByServiceId);

// Get single booking by booking ID
router.get("/getBookingById/:id", auth, bookingController.getBookingById);

// Get bookings for logged-in user
router.get("/user", auth, bookingController.bookingByUserId);

// Admin: get bookings by any user ID
router.get("/user/:id", auth, checkRole("admin", "super_admin"), bookingController.bookingByUserId);

// Update booking status (admin: any status | customer: cancel only)
router.patch("/updateStatus/:id", auth, bookingController.updateBookingStatus);

// Delete booking
router.delete("/delete/:id", auth, bookingController.deleteBooking);

export default router;