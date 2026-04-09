import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    description: {
        type: String,

    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

categorySchema.virtual("services", {
    reg: "Services",
    localField: "_id",
    foreignField: "category"
})

const Category = mongoose.model("Category", categorySchema)

export default Category