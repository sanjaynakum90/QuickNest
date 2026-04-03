import User from "../model/User.js";
import HttpError from "../middleware/HttpError.js"

const updateUserData = async (req, res, next) => {
    try {
        const id = req.params.id;

        const user = await User.findById()

        if (!user) {
            return next(new HttpError("user not found with this id", 404))
        }

        const allowedField = [
            "name",
            "email",
            "password",
            "role",
            "profilePic",
            "isVerified",
        ]

        const update = Object.keys(req.body)

        const isValid = update.every((field) => allowedField.includes(field))

        if (!isValid) {
            return next(new HttpError("only allowed field can be update", 400))
        }

        update.forEach((update) => (user[update] = req.body[update]))

        await user.save()

        res.status(200).json({ success: true, message: "user update successfully", user })
    } catch (error) {
        next(new HttpError(error.message))
    }
}

const deleteUserData = async (req, res, next) => {
    try {
        const id = req.params.id

        const user = await User.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "user data delete successfully" })

    } catch (error) {
        next(new HttpError(error.message))
    }
}

export default { updateUserData, deleteUserData }