"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const coupanSchema = new mongoose_1.default.Schema({
    code: {
        type: String,
        require: [true, "Please enternthe Coupan Code"],
        unique: true
    },
    amount: {
        type: Number,
        require: [true, "Please enter the Discount Amount"]
    }
});
const coupanModel = mongoose_1.default.model("Coupan", coupanSchema);
exports.default = coupanModel;
