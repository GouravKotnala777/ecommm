"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartData = exports.getInventories = exports.calculatePercentage = exports.reduceStock = exports.invalidateCache = void 0;
const app_1 = require("../../app");
const productModel_1 = __importDefault(require("../models/productModel"));
const utility_class_1 = __importDefault(require("./utility-class"));
const invalidateCache = async ({ product, order, admin, userId, productId, orderId }) => {
    if (product) {
        const productKeys = ["latest-products", "categories", "all-products"];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object")
            productId.forEach((i) => productKeys.push(`product-${i}`));
        app_1.myCache.del(productKeys);
    }
    if (order) {
        const orderKeys = ["all-orders", `my-orders-${userId}`, `order-${orderId}`];
        app_1.myCache.del(orderKeys);
    }
    if (admin) {
        app_1.myCache.del(["admin-stats", "admin-pie-charts", "admin-bar-charts", "admin-line-charts"]);
    }
};
exports.invalidateCache = invalidateCache;
const reduceStock = async (orderItems) => {
    console.log("aaaaaaa");
    // console.log(orderItems/length);
    // console.log(orderItems[0].productId);
    for (let i = 0; i < orderItems.length; i++) {
        console.log("bbbbb");
        const order = orderItems[i];
        const product = await productModel_1.default.findById(order.productId);
        console.log(order.productId);
        console.log({ product });
        if (!product)
            throw new utility_class_1.default("Product not found", 404);
        product.stock -= order.quantity;
        await product.save();
    }
};
exports.reduceStock = reduceStock;
const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
exports.calculatePercentage = calculatePercentage;
const getInventories = async ({ categories, productCount }) => {
    const categoriesCountPromise = categories.map(category => productModel_1.default.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productCount) * 100)
        });
    });
    return categoryCount;
};
exports.getInventories = getInventories;
;
const getChartData = ({ length, docArr, today, property }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            if (property) {
                data[length - monthDiff - 1] += i[property];
            }
            else {
                data[length - monthDiff - 1] += 1;
            }
        }
    });
    return data;
};
exports.getChartData = getChartData;
