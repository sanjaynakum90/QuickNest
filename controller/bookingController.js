import HttpError from "../middleware/HttpError.js";
import Booking from "../model/Booking.js";
import Service from "../model/Services.js";

const createBooking = async (req, res, next) => {
  try {
    const { serviceId, bookingDate, timeSlot, note } = req.body;

    const userId = req.user._id;

    const service = await Service.findById(serviceId);
    if (!service) {
      return next(new HttpError("Service not Found", 404));
    }

    if (!service.isActive) {
      return next(
        new HttpError("Service is currently not active, please try again later", 400)
      );
    }

    const startOfDate = new Date(bookingDate);
    startOfDate.setHours(0, 0, 0, 0);

    const endOfDate = new Date(bookingDate);
    endOfDate.setHours(23, 59, 59, 999);

    const existingBooking = await Booking.findOne({
      serviceId,
      timeSlot,
      bookingDate: { $gte: startOfDate, $lt: endOfDate },
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return next(new HttpError("Service already booked for this time slot", 409));
    }

    const newBooking = new Booking({
      userId,
      serviceId,
      bookingDate: new Date(bookingDate),
      timeSlot,
      note,
      totalPrice: service.price,
    });

    await newBooking.save();
    await newBooking.populate("serviceId");
    await newBooking.populate("userId");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getAllBooking = async (req, res, next) => {
  try {
    let bookings;
    const role = req.user.role;

    if (role === "admin" || role === "super_admin") {
      bookings = await Booking.find({}).populate([
        { path: "serviceId", select: "name price description duration -_id" },
        { path: "userId", select: "name email phone -_id" },
      ]);
    } else if (role === "customer") {
      bookings = await Booking.find({ userId: req.user._id }).populate(
        "serviceId",
        "name price duration description -_id"
      );
    } else {
      return next(new HttpError("Unauthorized", 401));
    }

    if (bookings.length === 0) {
      return res.status(200).json({ success: true, message: "No Booking Data Found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking Data fetched successfully",
      bookings,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getByServiceId = async (req, res, next) => {
  try {
    let bookings;
    const role = req.user.role;
    const serviceId = req.params.id;

    if (role === "admin" || role === "super_admin") {
      bookings = await Booking.find({ serviceId }).populate([
        { path: "serviceId", select: "name price description duration -_id" },
        { path: "userId", select: "name email phone" },
      ]);
    } else if (role === "customer") {
      bookings = await Booking.find({
        userId: req.user._id,
        serviceId,
      }).populate("serviceId", "name price description duration -_id");
    } else {
      return next(new HttpError("Unauthorized", 401));
    }

    if (bookings.length === 0) {
      return res.status(200).json({ success: true, message: "No Booking Data Found" });
    }

    res.status(200).json({ success: true, message: "Bookings fetched successfully", bookings });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookingId = req.params.id;
    const role = req.user.role;

    let booking;

    if (role === "admin" || role === "super_admin") {
      booking = await Booking.findById(bookingId).populate([
        { path: "serviceId", select: "name price duration" },
        { path: "userId", select: "name email phone" },
      ]);
    } else {
      booking = await Booking.findById(bookingId);
    }

    if (!booking) {
      return next(new HttpError("No Booking data found", 404));
    }

    if (role === "customer" && booking.userId.toString() !== userId.toString()) {
      return next(new HttpError("Unauthorized Access", 403));
    }

    res.status(200).json({ success: true, message: "Booking fetched successfully", booking });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const bookingByUserId = async (req, res, next) => {
  try {
    const role = req.user.role;
    const loginUserId = req.user._id;
    const paramUserId = req.params.id;

    let targetUserId;

    if (role === "admin" || role === "super_admin") {
      // Admin can view any user's bookings via param
      targetUserId = paramUserId || loginUserId;
    } else {
      // Customers can only see their own bookings
      targetUserId = loginUserId;
    }

    const bookings = await Booking.find({ userId: targetUserId }).populate(
      "serviceId",
      "name price description duration -_id"
    );

    if (!bookings || bookings.length === 0) {
      return next(new HttpError("No Booking Data Found", 404));
    }

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// ─── NEW: Update booking status ───────────────────────────────────────────────
const updateBookingStatus = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const role = req.user.role;
    const userId = req.user._id;
    const { status } = req.body;

    const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

    if (!allowedStatuses.includes(status)) {
      return next(new HttpError(`Status must be one of: ${allowedStatuses.join(", ")}`, 400));
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return next(new HttpError("Booking not found", 404));
    }

    // Customers can only cancel their own bookings
    if (role === "customer") {
      if (booking.userId.toString() !== userId.toString()) {
        return next(new HttpError("Unauthorized Access", 403));
      }
      if (status !== "cancelled") {
        return next(new HttpError("Customers can only cancel bookings", 403));
      }
    }

    booking.status = status;
    await booking.save();
    await booking.populate("serviceId", "name price duration description -_id");
    await booking.populate("userId", "name email phone -_id");

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

// ─── NEW: Delete booking ───────────────────────────────────────────────────────
const deleteBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const role = req.user.role;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return next(new HttpError("Booking not found", 404));
    }

    // Only admin/super_admin or the booking owner can delete
    if (
      role !== "admin" &&
      role !== "super_admin" &&
      booking.userId.toString() !== userId.toString()
    ) {
      return next(new HttpError("Unauthorized Access", 403));
    }

    // Only allow deletion of pending or cancelled bookings
    if (role === "customer" && !["pending", "cancelled"].includes(booking.status)) {
      return next(new HttpError("Only pending or cancelled bookings can be deleted", 400));
    }

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const availableTimeSlot = async (req, res, next) => {
  try {
    const { serviceId, bookingDate } = req.query;

    const service = await Service.findById(serviceId);
    if (!service) {
      return next(new HttpError("Service not found", 404));
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.find({
      serviceId,
      bookingDate: { $gte: startOfDay, $lt: endOfDay },
      status: { $in: ["pending", "confirmed"] },
    });

    const bookedTimeSlots = existingBookings.map((b) => b.timeSlot);

    const totalTimeSlots = [
      "9:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "12:00-13:00",
      "13:00-14:00",
      "14:00-15:00",
      "15:00-16:00",
      "16:00-17:00",
      "17:00-18:00",
    ];

    const availableSlots = totalTimeSlots.filter((slot) => !bookedTimeSlots.includes(slot));

    if (!availableSlots.length) {
      return res.status(200).json({
        success: true,
        message: "No time slots available for this date",
        availableTimeSlot: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Available time slots fetched successfully",
      availableTimeSlot: availableSlots,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export default {
  createBooking,
  getAllBooking,
  getByServiceId,
  getBookingById,
  bookingByUserId,
  updateBookingStatus,
  deleteBooking,
  availableTimeSlot,
};