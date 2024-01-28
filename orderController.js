"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processOrder = exports.updateOrder = exports.deleteOrder = exports.getSingleOrder = exports.allOrder = exports.myOrders = exports.newOrder = exports.getOrders = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const features_1 = require("../utils/features");
const utility_class_1 = __importDefault(require("../utils/utility-class"));
const app_1 = require("../../app");
const getOrders = async (req, res, next) => {
};
exports.getOrders = getOrders;
const newOrder = async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total } = req.body;
    if (!shippingInfo || !orderItems || !user || !subtotal || !total) {
        return next(new utility_class_1.default("All fields are required", 401));
    }
    const order = await orderModel_1.default.create({
        shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total
    });
    await (0, features_1.reduceStock)(orderItems);
    (0, features_1.invalidateCache)({ product: true, order: true, admin: true, userId: user, productId: order.orderItems.map(item => String(item.productId)) });
    return res.status(201).json({
        success: true,
        message: "Order placed successfully"
    });
};
exports.newOrder = newOrder;
const myOrders = async (req, res, next) => {
    const { id: user } = req.query;
    let orders = [];
    if (app_1.myCache.has(`my-orders-${user}`))
        orders = JSON.parse(app_1.myCache.get(`my-orders-${user}`));
    else {
        orders = await orderModel_1.default.find({ user });
        app_1.myCache.set(`my-orders-${user}`, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        message: orders
    });
};
exports.myOrders = myOrders;
const allOrder = async (req, res, next) => {
    let orders = [];
    if (app_1.myCache.has(`all-orders`))
        orders = JSON.parse(app_1.myCache.get(`all-orders`));
    else {
        orders = await orderModel_1.default.find().populate("user", "name");
        app_1.myCache.set(`all-orders`, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        message: orders
    });
};
exports.allOrder = allOrder;
const getSingleOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        let order;
        if (app_1.myCache.has(`order-${id}`))
            order = JSON.parse(app_1.myCache.get(`order-${id}`));
        else {
            order = await orderModel_1.default.findById(id).populate("user", "name");
            if (!order)
                return next(new utility_class_1.default("Order not found", 404));
            app_1.myCache.set(`order-${id}`, JSON.stringify(order));
        }
        return res.status(200).json({
            success: true,
            message: order
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.getSingleOrder = getSingleOrder;
const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await orderModel_1.default.findById(id);
        if (!order)
            return next(new utility_class_1.default("Product not found", 404));
        await order.deleteOne();
        (0, features_1.invalidateCache)({ product: false, order: true, admin: true, userId: order.user, orderId: String(order._id) });
        return res.status(200).json({ success: true, message: "Order deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteOrder = deleteOrder;
const updateOrder = async (req, res, next) => {
};
exports.updateOrder = updateOrder;
const processOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await orderModel_1.default.findById(id);
        if (!order)
            return next(new utility_class_1.default("Order not found", 404));
        switch (order.status) {
            case "Processing":
                order.status = "Shipped";
                break;
            case "Shipped":
                order.status = "Delivered";
                break;
            default:
                order.status = "Delivered";
                break;
        }
        await order.save();
        (0, features_1.invalidateCache)({ product: false, order: true, admin: true, userId: order.user, orderId: String(order._id) });
        return res.status(200).json({
            success: true,
            message: order
        });
    }
    catch (error) {
        next(error);
    }
};
exports.processOrder = processOrder;
