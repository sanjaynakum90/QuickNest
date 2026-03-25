import express from "express"
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })

import HttpError from "./middleware/HttpError.js"
import userRoutes from "./routes/userRoutes.js"
import connectDB from "./config/db.js"

const app = express()

app.use(express.json())

app.use("/User", userRoutes)

app.get("/", (req, res) => {
    res.status(200).json("hello form server")
})

app.use((req, res, next) => {
    next(new HttpError("requested routes not found", 404))
})

app.use((error, req, res, next) => {
    if (req.headerSent) {
        next(error)
    }

    res.status(error.statusCode || 500).json({ message: error.message || "internal server error" })
})

const port = process.env.PORT || 5000

async function startServer() {
    try {
        await connectDB()

        app.listen(port, () => {
            console.log(`server running on port ${port}`);

        })
    } catch (error) {

        console.log(error.message);

        process.exit(1)
    }
}

startServer()