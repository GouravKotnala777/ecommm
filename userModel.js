"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: [true, "Please enter ID"]
    },
    name: {
        type: String,
        required: [true, "Please add Name"]
    },
    email: {
        type: String,
        unique: [true, "Email already Exists"],
        required: [true, "Please add Email"]
    },
    pic: {
        type: String,
        required: [true, "Please add Photo"]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter Gender"]
    },
    dob: {
        type: Date,
        required: [true, "Please enter Date-Of-Birth"]
    }
}, {
    timestamps: true
});
userSchema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
            today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
const userModel = mongoose_1.default.model("User", userSchema);
exports.default = userModel;
