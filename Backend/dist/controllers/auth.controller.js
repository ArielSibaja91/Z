"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheck = exports.logout = exports.login = exports.signup = void 0;
const generateToken_1 = require("../lib/utils/generateToken");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        ;
        // Verifies if username & email already exist
        const [existingUser, existingEmail] = await Promise.all([
            user_model_1.default.findOne({ username }),
            user_model_1.default.findOne({ email })
        ]);
        // Email & Username validation
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }
        ;
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already on use" });
        }
        ;
        // Password validation
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be 6 characters long" });
        }
        ;
        // Password hash
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // New User instance
        const newUser = new user_model_1.default({
            fullName,
            username,
            email,
            password: hashedPassword
        });
        // The user is stored in the db and it generates a token and a cookie
        await newUser.save();
        (0, generateToken_1.generateTokenAndSetCookie)(newUser._id, res);
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
    }
    catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
    ;
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await user_model_1.default.findOne({ username });
        const validPassword = await bcryptjs_1.default.compare(password, user?.password || "");
        // Validates the user and password
        if (!user || !validPassword) {
            return res.status(400).json({ error: "Invalid user or email" });
        }
        ;
        // Generates the token
        (0, generateToken_1.generateTokenAndSetCookie)(user._id, res);
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
    }
    catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        // Sets the cookie age to 0, expiring
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out succesfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
    ;
};
exports.logout = logout;
const authCheck = async (req, res) => {
    try {
        // Manual type validation
        if (!req.user || !req.user._id) {
            return res.status(400).json({ error: "Invalid request: Missing user information" });
        }
        ;
        // Awaits the protectRoute middleware to find if the user is logged in
        const user = await user_model_1.default.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log("Error in authCheck controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.authCheck = authCheck;
