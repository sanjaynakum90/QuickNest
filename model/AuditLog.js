import { ref } from "joi";
import mongoose from "mongoose";

const auditSchema = mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    performBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    module: {
        type: String
    },
    targetedId: {
        type: String
    },
    Ip: String,
    userAgent: String
},
    {
        timestamps: true
    }
)

const AuditLog = mongoose.model("AuditLog", auditSchema);

export default AuditLog