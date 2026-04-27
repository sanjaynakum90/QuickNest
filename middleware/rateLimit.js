import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "to many request , try again later"
})

