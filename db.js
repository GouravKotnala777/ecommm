"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = (uri) => {
    mongoose_1.default.connect(uri, {
        dbName: "ecomm1"
    })
        .then(() => console.log("database...."))
        .catch((error) => console.log(error));
};
exports.default = connectDatabase;
