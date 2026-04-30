import rateLimit from "express-rate-limit";


// General API Rate Limiter
export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 500,
    message: {
        success: false,
        message: "Too many requests, please try again later."
    },

});


// Auth Rate Limiter (Login/Register)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        success: false,
        message: "Too many login attempts. Try again after 15 minutes."
    },

});


export default {
    rateLimiter,
    authLimiter
};