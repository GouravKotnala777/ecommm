"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require("express");
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const app = express_1.default.Router();
// userRoute /api/v1/user/
app.route("/new").post(userController_1.register);
app.route("/all").post(auth_1.isUserAuthenticated, userController_1.getAllUsers);
app.route("/:id").post(userController_1.getUser)
    .delete(userController_1.deleteUser);
// module.exports = app;
exports.default = app;
