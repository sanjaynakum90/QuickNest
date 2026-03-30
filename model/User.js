import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        roll: {
            type: String,
            enum: ["customer", "provider", "admin", "super-admin"],
            default: "customer",
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
});

userSchema.statics.findByCredentials = async function (email, password) {
    try {
        const user = await this.findOne({ email });

        if (!user) {
            throw new Error("Unable to login");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Unable to login");
        }

        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

userSchema.methods.generateAuthToken = async function () {
    try {
        const user = this;

        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.JWT_SECRET,
        );

        if (!token) {
            throw new Error("Failed to generate auth token");
        }

        user.tokens = user.tokens.concat({ token });

        await user.save();
    } catch (error) {
        throw new Error(error.message);
    }
};

const User = mongoose.model("User", userSchema);

export default User;