"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protectRoute = async (req, res, next) => {
    try {
        // Manual prop validation in req.cookies
        if (!req.cookies || !req.cookies.jwt) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        ;
        const token = req.cookies.jwt;
        // Validates token
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        ;
        // Decodes the token and validates it
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }
        // Seeks the user in the db and excludes the password
        const user = await user_model_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "Unauthorized: User not found" });
        }
        ;
        // Assigns the object 'user' to req.user
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error in protected middleware:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    ;
};
exports.protectRoute = protectRoute;
