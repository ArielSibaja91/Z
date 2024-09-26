import { Response, NextFunction  } from "express";
import User from "../models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";

export const protectRoute = async (req: any, res: Response, next: NextFunction) => {
    try {
        // Manual prop validation in req.cookies
        if (!req.cookies || !req.cookies.jwt) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        };
        const token = req.cookies.jwt;
        // Validates token
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        };
        // Decodes the token and validates it
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }
        // Seeks the user in the db and excludes the password
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "Unauthorized: User not found" });
        };
        // Assigns the object 'user' to req.user
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protected middleware:", error);
        res.status(500).json({ error: "Internal Server Error" });
    };
};