import User from "../model/User.js";
import Provider from "../model/provider.js";
import bookings from "../model/Booking.js";
import services from "../model/Services.js";

import HttpError from "../middleware/HttpError.js";

const dashBoardStatic = async (req, res, next) => {
    try {
        const totalUser = await User.countDocuments();

        const totalCustomer = await User.countDocuments({ role: "customer" });

        const totalProvider = await User.countDocuments({ role: "provider" });

        const totalIsApprovedProvider = await Provider.countDocuments({
            isVerified: true,
        });

        const totalRejectedProvider = await Provider.countDocuments({
            isVerified: false,
        });

        const totalBooking = await bookings.countDocuments({});

        const pendingBookings = await bookings.countDocuments({
            status: "pending",
        });

        const completeBookings = await bookings.countDocuments({
            status: "complete",
        });

        const cancellBookings = await bookings.countDocuments({
            status: "cancel",
        });

        const confirmBooking = await bookings.countDocuments({
            status: "confirm",
        });

        const totalServices = await services.countDocuments();

        const totalActiveServices = await services.countDocuments({
            isActive: true,
        });

        const totalDeActiveServices = await services.countDocuments({
            isActive: false,
        });

        const totalRevenue = await bookings.aggregate([
            {
                $group: {
                    _id: null,
                    revenue: { $sum: "$totalPrice" },
                },
            },
        ]);

        const totalBookingAggregate = await bookings.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            message: "dashBored statics fetched successfully",
            totalUser,
            totalCustomer,
            totalProvider,
            totalIsApprovedProvider,
            totalRejectedProvider,
            totalBooking,
            cancellBookings,
            confirmBooking,
            pendingBookings,
            completeBookings,
            totalServices,
            totalActiveServices,
            totalDeActiveServices,
            totalRevenue: totalRevenue[0]?.totalRevenue || 0,
            totalBookingAggregate,
        });
    } catch (error) {
        next(new HttpError(error));
    }
};

export default dashBoardStatic;
