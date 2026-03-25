import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["customer", "provider", "admin", "super_admin"],
        default: "customer"
    },
    is_verified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8)
    }
})

userSchema.statics.findByCredential = async function (email, password) {
    try {
        const user = await this.findOne({ email })

        if (!user) {
            throw new Error("unable to login")
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("unable to login")
        }

        return user

    } catch (error) {
        throw new Error(error.message)
    }
}



const User = mongoose.model("User", userSchema)

export default User;