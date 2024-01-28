"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const express = require("express");
const app = express();
app.route("/new").post(orderController_1.newOrder);
app.route("/my").get(orderController_1.myOrders);
app.route("/all").get(auth_1.isUserAuthenticated, orderController_1.allOrder);
app.route("/:id").get(orderController_1.getSingleOrder)
    .put(auth_1.isUserAuthenticated, orderController_1.processOrder)
    .delete(auth_1.isUserAuthenticated, orderController_1.deleteOrder);
exports.default = app;
