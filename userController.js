"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUser = exports.getAllUsers = exports.register = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const utility_class_1 = __importDefault(require("../utils/utility-class"));
const register = async (req, res, next) => {
    try {
        const { _id, name, email, dob, gender, role, pic } = req.body;
        let user = await userModel_1.default.findById(_id);
        if (user) {
            return res.status(200).json({ success: true, message: `Welcome ${user.name}` });
        }
        if (!_id || !name || !email || !dob || !gender || !pic)
            return (next(new utility_class_1.default("All fields are required", 400)));
        user = await userModel_1.default.create({
            _id, name, email, dob: new Date(dob), gender, pic, role
        });
        res.status(201).json({ success: true, message: `Welcome ${user.name}` });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const getAllUsers = async (req, res, next) => {
    try {
        // const {_id} = req.body;
        let allUsers = await userModel_1.default.find();
        if (!allUsers)
            return (next(new utility_class_1.default("users not found", 403)));
        res.status(200).json({ success: true, message: allUsers });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res, next) => {
    try {
        // const {_id} = req.body;
        const { id } = req.params;
        if (!id)
            return next(new utility_class_1.default("no _id params", 402));
        let user = await userModel_1.default.findById(id);
        if (!user)
            return next(new utility_class_1.default("user not found", 402));
        res.status(200).json({ success: true, message: user });
    }
    catch (error) {
        next(error);
    }
};
exports.getUser = getUser;
const deleteUser = async (req, res, next) => {
    try {
        // const {_id} = req.body;
        const { id } = req.params;
        if (!id)
            return next(new utility_class_1.default("no _id params", 402));
        let user = await userModel_1.default.findByIdAndDelete(id);
        if (!user)
            return next(new utility_class_1.default("user not found", 402));
        res.status(200).json({ success: true, message: user });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
