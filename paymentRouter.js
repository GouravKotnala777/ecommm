"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const app = express_1.default.Router();
app.route("/create").post(paymentController_1.createPaymentIntent);
app.route("/discount").get(paymentController_1.applyDiscount);
app.route("/coupan/new").post(auth_1.isUserAuthenticated, paymentController_1.newCoupan);
app.route("/coupan/all").get(auth_1.isUserAuthenticated, paymentController_1.allCoupans);
app.route("/coupan/:id").delete(auth_1.isUserAuthenticated, paymentController_1.deleteCoupan);
exports.default = app;
