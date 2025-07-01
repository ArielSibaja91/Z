"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoverImg = exports.deleteProfileImg = exports.updateUserProfile = exports.getSuggestedUsers = exports.followUnfollowUser = exports.getUserProfile = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await user_model_1.default.findOne({ username }).select("-password");
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error });
    }
    ;
};
exports.getUserProfile = getUserProfile;
const followUnfollowUser = async (req, res) => {
    try {
        // Manual type validation
        if (!req.user || !req.user._id) {
            return res.status(400).json({ error: "Invalid request: Missing user information" });
        }
        ;
        const { id } = req.params;
        const userToModidy = await user_model_1.default.findById(id);
        const currentUser = await user_model_1.default.findById(req.user._id);
        if (id === req.user._id.toString()) {
            return res.status(400).json({ message: "You can't follow/unfollow yourself" });
        }
        ;
        if (!userToModidy || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }
        ;
        const isFollowing = currentUser.following.includes(id);
        if (isFollowing) {
            // Unfollow the user
            await user_model_1.default.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await user_model_1.default.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed successfully" });
        }
        else {
            // Follow the user
            await user_model_1.default.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await user_model_1.default.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            // Send notification to the user
            const newNotification = new notification_model_1.default({
                type: "follow",
                from: req.user._id,
                to: userToModidy._id,
            });
            await newNotification.save();
            res.status(200).json({ message: "User followed successfully" });
        }
        ;
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
    ;
};
exports.followUnfollowUser = followUnfollowUser;
const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const usersFollowed = await user_model_1.default.findById(userId).select("following");
        const users = await user_model_1.default.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                },
            },
            { $sample: { size: 10 } },
        ]);
        const filteredUsers = users.filter(user => !usersFollowed?.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);
        suggestedUsers.forEach((user) => (user.password = null));
        res.status(200).json(suggestedUsers);
    }
    catch (error) {
        console.log("Error in suggested users: ", error);
        res.status(500).json({ error: error });
    }
    ;
};
exports.getSuggestedUsers = getSuggestedUsers;
const updateUserProfile = async (req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;
    try {
        let user = await user_model_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Password verifications
        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" });
        }
        ;
        if (currentPassword && newPassword) {
            const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isMatch)
                return res.status(400).json({ error: "Current password is incorrect" });
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }
            ;
            user.password = await bcryptjs_1.default.hash(newPassword, 10);
        }
        ;
        // Deletes the current profileImg from cloudinary before uploading the new one
        if (profileImg) {
            if (user.profileImg) {
                const publicId = user.profileImg.split("/").pop()?.split(".")[0];
                if (publicId) {
                    await cloudinary_1.v2.uploader.destroy(publicId);
                }
                ;
            }
            ;
            const uploadedResponse = await cloudinary_1.v2.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }
        ;
        // Deletes the current profileImg from cloudinary before uploading the new one
        if (coverImg) {
            if (user.coverImg) {
                const publicId = user.coverImg.split("/").pop()?.split(".")[0];
                if (publicId) {
                    await cloudinary_1.v2.uploader.destroy(publicId);
                }
                ;
            }
            ;
            const uploadedResponse = await cloudinary_1.v2.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }
        ;
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;
        user = await user.save();
        // Creates a new User object copy and sets the password to null
        const userResponse = { ...user.toObject(), password: null };
        return res.status(200).json(userResponse);
    }
    catch (error) {
        console.log("Error in updateUser: ", error);
        res.status(500).json({ error: error });
    }
    ;
};
exports.updateUserProfile = updateUserProfile;
const deleteProfileImg = async (req, response) => {
    const userId = req.user._id;
    try {
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }
        ;
        if (user.profileImg) {
            const publicId = user.profileImg.split("/").pop()?.split(".")[0];
            if (publicId) {
                await cloudinary_1.v2.uploader.destroy(publicId);
            }
            ;
            user.profileImg = "";
            await user.save();
            return response.status(200).json({ message: "Profile image deleted successfully" });
        }
        else {
            return response.status(400).json({ error: "No profile image to delete" });
        }
        ;
    }
    catch (error) {
        console.log("Error in deleteProfileImg: ", error);
        response.status(500).json({ error: "Failed to delete profile image" });
    }
    ;
};
exports.deleteProfileImg = deleteProfileImg;
const deleteCoverImg = async (req, response) => {
    const userId = req.user._id;
    try {
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        }
        ;
        if (user.coverImg) {
            const publicId = user.coverImg.split("/").pop()?.split(".")[0];
            if (publicId) {
                await cloudinary_1.v2.uploader.destroy(publicId);
            }
            ;
            user.coverImg = "";
            await user.save();
            return response.status(200).json({ message: "Cover image deleted successfully" });
        }
        else {
            return response.status(400).json({ error: "No cover image to delete" });
        }
        ;
    }
    catch (error) {
        console.log("Error in deleteCoverImg: ", error);
        response.status(500).json({ error: "Failed to delete cover image" });
    }
    ;
};
exports.deleteCoverImg = deleteCoverImg;
