"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const statsController_1 = require("../controllers/statsController");
const app = express_1.default.Router();
app.route("/stats").get(auth_1.isUserAuthenticated, statsController_1.getDashboardStats);
app.route("/pie").get(auth_1.isUserAuthenticated, statsController_1.getPieCharts);
app.route("/bar").get(auth_1.isUserAuthenticated, statsController_1.getBarCharts);
app.route("/line").get(auth_1.isUserAuthenticated, statsController_1.getLineCharts);
exports.default = app;
