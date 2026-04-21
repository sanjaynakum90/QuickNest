import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  service: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
    },
  ],
  experience: {
    type: Number,
    default: 0,
  },
  documents: [
    {
      type: String,
      required: true,
    },
  ],
  isValid: {
    type: Boolean,
    default: false,
  },
});

const Provider = mongoose.model("Provider", providerSchema);

export default Provider