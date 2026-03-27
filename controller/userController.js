import HttpError from "../middleware/HttpError.js"
import User from "../model/User.js"


const addUser = async (req, res, next) => {
    try {
        const { name, email, password, role, phone } = req.body

        const newUser = {
            name,
            email,
            password,
            role,
            phone,
        }
        const user = await User(newUser)

        await user.save()

        res.status(201).json({ success: true, user })
    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByCredential(email, password)

        if (!user) {
            return next(new HttpError("unable to login", 400))
        }
        res.status(200).json({ success: true, message: "user login successful", user })
    } catch (error) {
        next(new HttpError(error.message))
    }
}

const authLogin = async (req, res, next) => {

}

export default { addUser, loginUser }