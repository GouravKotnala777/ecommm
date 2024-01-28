"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myCache = exports.stripe = void 0;
// const express = require("express");
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./Amazaun/config/db"));
const error_1 = require("./Amazaun/middleware/error");
const node_cache_1 = __importDefault(require("node-cache"));
const dotenv_1 = require("dotenv");
const morgan_1 = __importDefault(require("morgan"));
const stripe_1 = __importDefault(require("stripe"));
const userRouter_1 = __importDefault(require("./Amazaun/routes/userRouter"));
const productRouter_1 = __importDefault(require("./Amazaun/routes/productRouter"));
const orderRouter_1 = __importDefault(require("./Amazaun/routes/orderRouter"));
const paymentRouter_1 = __importDefault(require("./Amazaun/routes/paymentRouter"));
const statRouter_1 = __importDefault(require("./Amazaun/routes/statRouter"));
(0, dotenv_1.config)({
    path: "./.env"
});
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";
(0, db_1.default)(MONGO_URI);
exports.stripe = new stripe_1.default(stripeKey);
exports.myCache = new node_cache_1.default();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/api/v1/product", productRouter_1.default);
app.use("/api/v1/user", userRouter_1.default);
app.use("/api/v1/order", orderRouter_1.default);
app.use("/api/v1/payment", paymentRouter_1.default);
app.use("/api/v1/dashboard", statRouter_1.default);
app.use("/uploads", express_1.default.static("uploads"));
app.use(error_1.errorMiddleware);
app.listen(PORT, () => {
    console.log("listening....");
});
