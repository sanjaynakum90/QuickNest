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
        timestamps: true
    }
)

const Category = mongoose.model("Category", categorySchema)