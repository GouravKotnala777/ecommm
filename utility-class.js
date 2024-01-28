"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
    ;
}
exports.default = ErrorHandler;
// class ErrorHandler extends Error{
//     constructor(public message:string, public statusCode:number){
//         super(message);
//         this.statusCode = statusCode;
//     }
// };
// export default ErrorHandler;
