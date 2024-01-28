"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupan = exports.allCoupans = exports.applyDiscount = exports.newCoupan = exports.createPaymentIntent = void 0;
const coupanModel_1 = __importDefault(require("../models/coupanModel"));
const utility_class_1 = __importDefault(require("../utils/utility-class"));
const app_1 = require("../../app");
const createPaymentIntent = async (req, res, next) => {
    const { amount } = req.body;
    if (!amount)
        return next(new utility_class_1.default("Please enter amount", 400));
    const paymentIntent = await app_1.stripe.paymentIntents.create({ amount: Number(amount) * 100, currency: "inr" });
    return res.status(201).json({ success: true, clientSecret: paymentIntent.client_secret, message: "" });
};
exports.createPaymentIntent = createPaymentIntent;
const newCoupan = async (req, res, next) => {
    const { coupan, amount } = req.body;
    if (!coupan || !amount)
        return (next(new utility_class_1.default("All fields are required", 400)));
    await coupanModel_1.default.create({ code: coupan, amount });
    return res.status(201).json({ success: true, message: `Coupan : ${coupan}` });
};
exports.newCoupan = newCoupan;
const applyDiscount = async (req, res, next) => {
    const { coupan } = req.query;
    const discount = await coupanModel_1.default.findOne({ code: coupan });
    if (!discount)
        return (next(new utility_class_1.default("Invalid Coupan Code", 400)));
    return res.status(201).json({ success: true, message: discount.amount });
};
exports.applyDiscount = applyDiscount;
const allCoupans = async (req, res, next) => {
    const coupans = await coupanModel_1.default.find({});
    if (!coupans)
        return (next(new utility_class_1.default("Coupans not found", 402)));
    return res.status(200).json({ success: true, message: coupans });
};
exports.allCoupans = allCoupans;
const deleteCoupan = async (req, res, next) => {
    const { id } = req.params;
    const coupan = await coupanModel_1.default.findByIdAndDelete(id);
    if (!coupan)
        return next(new utility_class_1.default("Invalid Coupan", 400));
    return res.status(200).json({ success: true, message: `${coupan} : deleted` });
};
exports.deleteCoupan = deleteCoupan;
