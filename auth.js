"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserAuthenticated = void 0;
const utility_class_1 = __importDefault(require("../utils/utility-class"));
const userModel_1 = __importDefault(require("../models/userModel"));
const isUserAuthenticated = async (req, res, next) => {
    const { id } = req.query;
    if (!id)
        return next(new utility_class_1.default("login first", 401));
    const user = await userModel_1.default.findById(id);
    if (!user)
        return next(new utility_class_1.default("Wrong auth Id", 401));
    if (user.role !== "admin")
        return next(new utility_class_1.default("Only admin can access this", 403));
    next();
};
exports.isUserAuthenticated = isUserAuthenticated;
