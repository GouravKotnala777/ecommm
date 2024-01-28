"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLineCharts = exports.getBarCharts = exports.getPieCharts = exports.getDashboardStats = void 0;
const app_1 = require("../../app");
const productModel_1 = __importDefault(require("../models/productModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const features_1 = require("../utils/features");
const getDashboardStats = async (req, res, next) => {
    let stats = {};
    if (app_1.myCache.has("admin-stats"))
        stats = JSON.parse(app_1.myCache.get("admin-stats"));
    else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today
        };
        const LastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0)
        };
        const thisMonthProductsPromise = productModel_1.default.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });
        const lastMonthProductsPromise = productModel_1.default.find({
            createdAt: {
                $gte: LastMonth.start,
                $lte: LastMonth.end
            }
        });
        const thisMonthUsersPromise = userModel_1.default.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });
        const lastMonthUsersPromise = userModel_1.default.find({
            createdAt: {
                $gte: LastMonth.start,
                $lte: LastMonth.end
            }
        });
        const thisMonthOrdersPromise = orderModel_1.default.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });
        const lastMonthOrdersPromise = orderModel_1.default.find({
            createdAt: {
                $gte: LastMonth.start,
                $lte: LastMonth.end
            }
        });
        const lastSixMonthOrdersPromise = orderModel_1.default.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today
            }
        });
        const latestTransactionsPromise = orderModel_1.default.find({}).select(["orderItems", "discount", "total", "status"]).limit(4);
        const [thisMonthProducts, thisMonthUsers, thisMonthOrders, lastMonthProducts, lastMonthUsers, lastMonthOrders, productCount, userCount, allOrders, lastSixMonthOrders, categories, femaleUserCount, latestTransactions] = await Promise.all([
            thisMonthProductsPromise,
            thisMonthUsersPromise,
            thisMonthOrdersPromise,
            lastMonthProductsPromise,
            lastMonthUsersPromise,
            lastMonthOrdersPromise,
            productModel_1.default.countDocuments(),
            userModel_1.default.countDocuments(),
            orderModel_1.default.find({}).select("total"),
            lastSixMonthOrdersPromise,
            productModel_1.default.distinct("category"),
            userModel_1.default.countDocuments({ gender: "female" }),
            latestTransactionsPromise
        ]);
        const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const changePercent = {
            revenue: (0, features_1.calculatePercentage)(thisMonthRevenue, lastMonthRevenue),
            product: (0, features_1.calculatePercentage)(thisMonthProducts.length, lastMonthProducts.length),
            user: (0, features_1.calculatePercentage)(thisMonthUsers.length, lastMonthUsers.length),
            order: (0, features_1.calculatePercentage)(thisMonthOrders.length, lastMonthOrders.length)
        };
        const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);
        const counts = {
            revenue,
            product: productCount,
            user: userCount,
            order: allOrders.length
        };
        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthlyRevenue = new Array(6).fill(0);
        lastSixMonthOrders.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
            if (monthDiff < 6) {
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
            }
        });
        const categoryCount = await (0, features_1.getInventories)({ categories, productCount });
        const userRatio = {
            male: userCount - femaleUserCount,
            female: femaleUserCount
        };
        const modifiedLatestTransaction = latestTransactions.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status
        }));
        stats = {
            categoryCount,
            changePercent,
            counts,
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthlyRevenue,
            },
            userRatio,
            latestTransactions: modifiedLatestTransaction
        };
        app_1.myCache.set("admin-stats", JSON.stringify(stats));
    }
    ;
    return res.status(200).json({ success: true, message: stats });
};
exports.getDashboardStats = getDashboardStats;
const getPieCharts = async (req, res, next) => {
    let charts;
    if (app_1.myCache.has("admin-pie-charts"))
        charts = JSON.parse(app_1.myCache.get("admin-pie-charts"));
    else {
        const allOrdersPromise = orderModel_1.default.find({}).select(["total", "discount", "subtotal", "tax", "shippingCharges"]);
        const [processingOrder, shippedOrder, deliveredOrder, categories, productCount, productOutOfStock, allOrders, allUsers, adminUsers, customerUsers] = await Promise.all([
            orderModel_1.default.countDocuments({ status: "Processing" }),
            orderModel_1.default.countDocuments({ status: "Shipped" }),
            orderModel_1.default.countDocuments({ status: "Delivered" }),
            productModel_1.default.distinct("category"),
            productModel_1.default.countDocuments(),
            productModel_1.default.countDocuments({ stock: 0 }),
            allOrdersPromise,
            userModel_1.default.find({}).select(["dob"]), // we need only length of User but don't need unnessessary data fields so it will give only "dob" of each user from User and we won't use "_id" (because here "dob" is nessessary and not other properties like "_id" because of `userSchema.virtual("age").get(function(){};` function in User model)
            userModel_1.default.countDocuments({ role: "admin" }),
            userModel_1.default.countDocuments({ role: "user" })
        ]);
        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder,
        };
        const productCategories = await (0, features_1.getInventories)({ categories, productCount });
        const stockAvailablity = {
            inStock: productCount - productOutOfStock,
            outOfStock: productOutOfStock
        };
        const grossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0);
        const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);
        const productCost = allOrders.reduce((prev, order) => prev + (order.shippingCharges || 0), 0);
        const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
        const marketingCost = Math.round(grossIncome * (30 / 100));
        const netMargin = grossIncome - discount - productCost - burnt - marketingCost;
        const revenueDistribution = {
            netMargin,
            discount,
            productCost,
            burnt,
            marketingCost
        };
        const usersAgeGroup = {
            teen: allUsers.filter(i => i.age < 20).length,
            adult: allUsers.filter(i => i.age >= 20 && i.age < 40).length,
            old: allUsers.filter(i => i.age >= 40).length
        };
        const adminCustomer = {
            admin: adminUsers,
            customer: customerUsers
        };
        charts = {
            orderFullfillment,
            productCategories,
            stockAvailablity,
            revenueDistribution,
            usersAgeGroup,
            adminCustomer
        };
        app_1.myCache.set("admin-pie-charts", JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        message: charts
    });
};
exports.getPieCharts = getPieCharts;
const getBarCharts = async (req, res, next) => {
    let charts;
    const key = "admin-bar-charts";
    if (app_1.myCache.has(key))
        charts = JSON.parse(app_1.myCache.get(key));
    else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const lastSixMonthProductsPromise = productModel_1.default.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today
            }
        }).select("createdAt");
        const lastSixMonthUsersPromise = userModel_1.default.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today
            }
        }).select("createdAt");
        const lastTwelveMonthOrdersPromise = orderModel_1.default.find({
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today
            }
        }).select("createdAt");
        const [lastSixMonthProducts, lastSixMonthUsers, lastTwelveMonthOrders] = await Promise.all([
            lastSixMonthProductsPromise,
            lastSixMonthUsersPromise,
            lastTwelveMonthOrdersPromise
        ]);
        const productCounts = (0, features_1.getChartData)({ length: 6, docArr: lastSixMonthProducts, today });
        const userCounts = (0, features_1.getChartData)({ length: 6, docArr: lastSixMonthUsers, today });
        const orderCounts = (0, features_1.getChartData)({ length: 12, docArr: lastTwelveMonthOrders, today });
        charts = {
            productCounts,
            userCounts,
            orderCounts
        };
        app_1.myCache.set(key, JSON.stringify(charts));
    }
    ;
    return res.status(200).json({
        success: true,
        message: charts
    });
};
exports.getBarCharts = getBarCharts;
const getLineCharts = async (req, res, next) => {
    let charts;
    const key = "admin-line-charts";
    if (app_1.myCache.has(key))
        charts = JSON.parse(app_1.myCache.get(key));
    else {
        const today = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const baseQuery = {
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today
            }
        };
        const [lastSixMonthProducts, lastSixMonthUsers, lastSixMonthOrders] = await Promise.all([
            productModel_1.default.find(baseQuery).select("createdAt"),
            userModel_1.default.find(baseQuery).select("createdAt"),
            orderModel_1.default.find(baseQuery).select(["createdAt", "discount", "total"])
        ]);
        const productCounts = (0, features_1.getChartData)({ length: 12, today, docArr: lastSixMonthProducts });
        const userCounts = (0, features_1.getChartData)({ length: 12, today, docArr: lastSixMonthUsers });
        const discount = (0, features_1.getChartData)({ length: 12, today, docArr: lastSixMonthOrders, property: "discount" });
        const revenue = (0, features_1.getChartData)({ length: 12, today, docArr: lastSixMonthOrders, property: "total" });
        charts = {
            users: productCounts,
            products: userCounts,
            discount,
            revenue
        };
        app_1.myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        message: charts
    });
};
exports.getLineCharts = getLineCharts;
