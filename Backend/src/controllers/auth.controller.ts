import { generateTokenAndSetCookie } from "../lib/utils/generateToken";
import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullName, username, email, password } = req.body;
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        };
        // Verifies if username & email already exist
        const [existingUser, existingEmail] = await Promise.all([
            User.findOne({ username }),
            User.findOne({ email })
        ]);
        // Email & Username validation
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" })
        };
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already on use" })
        };
        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be 6 characters long" })
        };
        // Password hash
        const hashedPassword = await bcrypt.hash(password, 10);
        // New User instance
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });
        // The user is stored in the db and it generates a token and a cookie
        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);
        // Response sent succesfully
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
        });
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ error: "Internal server error" });
    };
};

export const login = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({ username });
        const validPassword = await bcrypt.compare(password, user?.password || "");
        // Validates the user and password
        if(!user || !validPassword) {
            return res.status(400).json({ error: "Invalid user or email" });
        };
        // Generates the token
        generateTokenAndSetCookie(user._id, res);
        // Send a response with the user data
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        // Sets the cookie age to 0, expiring
        res.cookie("jwt", "" ,{ maxAge: 0});
        res.status(200).json({message: "Logged out succesfully"});
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ error: "Internal server error" });
    };
};

export const authCheck = async (req: any, res: Response) => {
    try {
        // Manual type validation
        if (!req.user || !req.user._id) {
            return res.status(400).json({ error: "Invalid request: Missing user information" });
        };
        // Awaits the protectRoute middleware to find if the user is logged in
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in authCheck controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};