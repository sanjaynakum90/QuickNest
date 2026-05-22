import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZOR_TEST_API_KEY,
    key_secret: process.env.RAZOR_TEST_API_SECRET,
});

export default razorpay;
