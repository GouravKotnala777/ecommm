"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => {
    err.message || (err.message = "Internal Server Error....");
    err.statusCode || (err.statusCode = 500);
    if (err.name === "CastError")
        err.message = "Invalid ProductId";
    console.log("===============");
    console.log(err.message);
    console.log(err.statusCode);
    console.log("===============");
    return res.status(err.statusCode).json({ success: true, message: err.message });
};
exports.errorMiddleware = errorMiddleware;
// export const errorMiddleware = (error:ErrorHandler, req:Request, res:Response, next:NextFunction) => {
//     error.message ||= "Internal Server Error....";
//     error.statusCode ||= 500;
//     return res.status(error.statusCode).json({success:false, error:error.message})
// };
