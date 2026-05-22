import razorpay from "../config/razorPay.js";

export const createOrder = async ({ amount, receipt }) => {
    try {
        const option = {
            amount: amount * 100,
            currency: "INR",
            receipt
        };

        const order = await razorpay.orders.create(option);
        return order
    } catch (error) {
        throw new Error(error)
    }
}