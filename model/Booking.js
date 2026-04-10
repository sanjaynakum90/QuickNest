import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    },
    bookingDate: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        enum: [
            "9:00-10:00",
            "10:00-11:00",
            "11:00-12:00",
            "12:00-13:00",
            "13:00-14:00",
            "14:00-15:00",
            "15:00-16:00",
            "16:00-17:00",
            "17:00-18:00",
        ],
        required: true
    },
    note: {
        type: String,
        maxLength: 500
    },
    status: {
        type: String,
        enum: ["pending", "confirm", "complete", "cancel"],
        default: "pending"
    },
    totalPrice: {
        type: Number,
        required: true
    }
});

const Booking = mongoose.model("Booking", bookingSchema)