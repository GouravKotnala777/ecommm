"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pin: {
            type: Number,
            required: true
        }
    },
    user: {
        type: String,
        ref: "User",
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    shippingCharges: {
        type: Number,
        default: 0,
        required: true
    },
    discount: {
        type: Number,
        default: 0,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered"],
        default: "Processing"
    },
    orderItems: [
        {
            name: String,
            photo: String,
            price: Number,
            quantity: Number,
            productId: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "Product"
            }
        }
    ]
}, {
    timestamps: true
});
const orderModel = mongoose_1.default.model("Order", orderSchema);
exports.default = orderModel;
