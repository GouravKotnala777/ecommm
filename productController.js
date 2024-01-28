"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getSingleProduct = exports.getAdminProducts = exports.getAllCategories = exports.getLatestProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const utility_class_1 = __importDefault(require("../utils/utility-class"));
const fs_1 = require("fs");
const app_1 = require("../../app");
const features_1 = require("../utils/features");
const getLatestProducts = async (req, res, next) => {
    let products;
    if (app_1.myCache.has("latest-products"))
        products = JSON.parse(app_1.myCache.get("latest-products"));
    else {
        products = await productModel_1.default.find({}).sort({ createdAt: -1 }).limit(5);
        app_1.myCache.set("latest-products", JSON.stringify(products));
    }
    return res.status(201).json({
        success: true,
        message: products
    });
};
exports.getLatestProducts = getLatestProducts;
const getAllCategories = async (req, res, next) => {
    let categories;
    if (app_1.myCache.has("categories"))
        categories = JSON.parse(app_1.myCache.get("categories"));
    else {
        categories = await productModel_1.default.distinct("category");
        app_1.myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(201).json({
        success: true,
        message: categories
    });
};
exports.getAllCategories = getAllCategories;
const getAdminProducts = async (req, res, next) => {
    let products;
    if (app_1.myCache.has("all-products"))
        products = JSON.parse(app_1.myCache.get("all-products"));
    else {
        products = await productModel_1.default.find({});
        app_1.myCache.set("all-products", JSON.stringify(products));
    }
    return res.status(200).json({ success: true, message: products });
};
exports.getAdminProducts = getAdminProducts;
const getSingleProduct = async (req, res, next) => {
    let product;
    if (app_1.myCache.has(`product-${req.params.id}`))
        product = JSON.parse(app_1.myCache.get(`product-${req.params.id}`));
    else {
        product = await productModel_1.default.findById(req.params.id);
        if (!product) {
            return next(new utility_class_1.default("Product not found", 404));
        }
        app_1.myCache.set(`product-${req.params.id}`, JSON.stringify(product));
    }
    return res.status(200).json({ success: true, message: product });
};
exports.getSingleProduct = getSingleProduct;
const createProduct = async (req, res, next) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new utility_class_1.default("Please add Photo", 400));
    if (!name || !price || !stock || !category) {
        (0, fs_1.rm)(photo.path, () => {
            console.log("deleted");
        });
        return next(new utility_class_1.default("All fields are required", 400));
    }
    await productModel_1.default.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path
    });
    (0, features_1.invalidateCache)({ product: true, admin: true });
    return res.status(201).json({
        success: true,
        message: "Product created successfully"
    });
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    const product = await productModel_1.default.findById(id);
    if (!product)
        return next(new utility_class_1.default("Product not found", 404));
    if (photo) {
        (0, fs_1.rm)(product.photo, () => {
            console.log("old deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    (0, features_1.invalidateCache)({ product: true, productId: String(product._id), admin: true });
    return res.status(201).json({
        success: true,
        message: "Product updated successfully"
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    const product = await productModel_1.default.findByIdAndDelete(req.params.id);
    if (!product)
        return next(new utility_class_1.default("Product not found", 404));
    (0, fs_1.rm)(product.photo, () => {
        console.log("Product photo deleted");
    });
    (0, features_1.invalidateCache)({ product: true, productId: String(product._id), admin: true });
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
};
exports.deleteProduct = deleteProduct;
const getAllProducts = async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 4;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search,
            $options: "i"
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price)
        };
    if (category)
        baseQuery.category = category;
    const productPromise = productModel_1.default.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [products, filteredOnlyProduct] = await Promise.all([
        productPromise,
        productModel_1.default.find(baseQuery)
    ]);
    // const products = await Product.find(baseQuery)
    // .sort(sort && {price:sort === "asc" ? 1 : -1})
    // .limit(limit) 
    // .skip(skip);
    // const filteredOnlyProduct = await Product.find(baseQuery);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.status(201).json({
        success: true,
        message: products,
        totalPage
    });
};
exports.getAllProducts = getAllProducts;
