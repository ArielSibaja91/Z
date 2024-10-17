import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Types } from 'mongoose';

export const generateTokenAndSetCookie = (userId: Types.ObjectId, res: Response) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET!, {
        expiresIn: '15d'
    });
    
    res.cookie("jwt", token, {
        maxAge: 15*24*60*1000, //MS
        httpOnly: true, // Prevent XSS attacks cross-site scripting attacks
        sameSite: true, // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });
};