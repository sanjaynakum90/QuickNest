import HttpError from "../middleware/HttpError";


const adc = async (req, res, next) => {
    try {
        const { name, price, duration, description, isActive, category } = req.body

        const existingService = await Service.findOne({ name });

        if (existingService) {
            return next(new HttpError("service is already exist ", 500))
        }

        const existingCategory = await Category.findById(category);

        if (!existingCategory) {
            return next(new HttpError("category not existed", 500));
        }


        const newService = new Service({
            name,
            price,
            duration,
            description,
            isActive,
            category,
        });

        await newService.save()

        res.status(201).json({ success: true, message: "new service created", newService })
    } catch (error) {
        next(new HttpError(error.message))
    }
}

export default { add }