import HttpError from "../middleware/HttpError.js"


const add = async (req, res, next) => {
    try {
        const { name, description } = req.body

        const newCategory = Category.create({
            name,
            description
        })

        res.status(201).json({ success: true, message: "category added successfully", newCategory })
    } catch (error) {
        next(new HttpError(error.message))
    }
}

export default { add }