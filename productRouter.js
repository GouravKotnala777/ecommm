"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const productController_1 = require("../controllers/productController");
const multer_1 = require("../middleware/multer");
const app = (0, express_1.default)();
app.route("/new").post(auth_1.isUserAuthenticated, multer_1.singleUpload, productController_1.createProduct);
app.route("/all").get(productController_1.getAllProducts);
app.route("/latest").get(productController_1.getLatestProducts);
app.route("/categories").get(productController_1.getAllCategories);
app.route("/admin-products").get(auth_1.isUserAuthenticated, productController_1.getAdminProducts);
app.route("/:id").get(productController_1.getSingleProduct)
    .put(auth_1.isUserAuthenticated, multer_1.singleUpload, productController_1.updateProduct)
    .delete(auth_1.isUserAuthenticated, productController_1.deleteProduct);
exports.default = app;
