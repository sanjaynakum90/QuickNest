import crypto from "crypto";
import mongoose from "mongoose";
import Payment from "../model/Payment.js";
import Booking from "../model/Booking.js";

export const razorpayWebhook =
    async (req, res) => {

        try {

            const signature =
                req.headers["x-razorpay-signature"];

            const expectedSignature =
                crypto
                    .createHmac(
                        "sha256",
                        process.env.RAZORPAY_WEBHOOK_SECRET
                    )
                    .update(req.body)
                    .digest("hex");

            if (signature !== expectedSignature) {

                return res.status(400).json({
                    message: "Invalid webhook",
                });

            }

            const event =
                JSON.parse(req.body).event;

            // Handle payment captured event
            if (event === "payment.captured") {
                const payment = JSON.parse(req.body).payload.payment.entity;
                const bookingId = payment.notes.bookingId;

                const session =
                    await mongoose.startSession();

                session.startTransaction();

                try {
                    const paymentDoc = await Payment.findOne({
                        razorPayOrderId: payment.order_id,
                    });

                    const booking = await Booking.findById(bookingId);

                    if (!paymentDoc || !booking) {
                        await session.abortTransaction();
                        return res.status(404).json({
                            message: "Payment or Booking not found",
                        });
                    }

                    paymentDoc.status = "captured";
                    paymentDoc.razorPayPaymentId = payment.id;
                    paymentDoc.razorPaySignature = payment.signature;

                    await paymentDoc.save({ session });

                    booking.paymentStatus = "paid";
                    booking.status = "confirmed";

                    await booking.save({ session });

                    await session.commitTransaction();
                } catch (error) {
                    await session.abortTransaction();
                    throw error;
                } finally {
                    session.endSession();
                }
            }

            return res.status(200).json({
                success: true,
            });

        } catch (error) {

            return res.status(500).json({
                message: error.message,
            });

        }
    };