import HttpError from "../middleware/HttpError.js";
import Booking from "../model/Booking.js";
import Services from "../model/Services.js";

const createBooking = async (req, res, next) => {
    try {
        const { serviceId, bookingDate, timeSlot, note } = req.body;

        const userId = req.user._id;

        const service = await Services.findById(serviceId);
        if (!service) {
            return next(new HttpError("Service not Founded", 404));
        }

        if (!service.isActive) {
            return next(
                new HttpError(
                    "Service is currently not active please try again some time",
                    400,
                ),
            );
        }

        const startOfDate = new Date(bookingDate);
        startOfDate.setHours(0, 0, 0, 0);

        const endOfDate = new Date(bookingDate);
        endOfDate.setHours(23, 59, 59, 999);

        const existingBooking = await Booking.findOne({
            serviceId,
            bookingDate: { $gte: startOfDate, $lt: endOfDate },
            status: { $in: ["pending", "confirm"] },
        });

        if (existingBooking) {
            return next(
                new HttpError("Service Already booked for this time slot", 409),
            );
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

export default { createBooking }