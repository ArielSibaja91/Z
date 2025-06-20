import { Request, Response } from "express";
import User from "../models/user.model";
import Notification from "../models/notification.model";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const getUserProfile = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error});
    };
};

export const followUnfollowUser = async (req: any, res: Response) => {
    try {
        // Manual type validation
        if (!req.user || !req.user._id) {
            return res.status(400).json({ error: "Invalid request: Missing user information" });
        };
        const { id } = req.params;
        const userToModidy = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ message: "You can't follow/unfollow yourself" });
        };

        if (!userToModidy || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        };

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow the user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // Follow the user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            // Send notification to the user
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModidy._id,
            });

            await newNotification.save();
            res.status(200).json({ message: "User followed successfully" });
        };

    } catch (error) {
        res.status(500).json({error: error});
    };
};

export const getSuggestedUsers = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;

        const usersFollowed = await User.findById(userId).select("following");

        const users = await User.aggregate([
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
    } catch (error) {
        console.log("Error in suggested users: ", error);
        res.status(500).json({ error: error });
    };
};

export const updateUserProfile = async (req: any, res: Response) => {
    const {fullName, email, username, currentPassword, newPassword, bio, link} = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: "User not found" });
        // Password verifications
        if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return res.status(400).json({ error: "Please provide both current password and new password" });
        };

        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if(!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

            if(newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            };

            user.password = await bcrypt.hash(newPassword, 10);
        };
        // Deletes the current profileImg from cloudinary before uploading the new one
        if(profileImg) {
            if(user.profileImg) {
                const publicId = user.profileImg.split("/").pop()?.split(".")[0];
                if(publicId) {
                    await cloudinary.uploader.destroy(publicId);
                };
            };
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        };
        // Deletes the current profileImg from cloudinary before uploading the new one
        if(coverImg) {
            if(user.coverImg) {
                const publicId = user.coverImg.split("/").pop()?.split(".")[0];
                if(publicId) {
                    await cloudinary.uploader.destroy(publicId);
                };
            };
            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        };

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
    } catch (error) {
        console.log("Error in updateUser: ", error);
		res.status(500).json({ error: error });
    };
};

export const deleteProfileImg = async (req: any, response: Response) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        };
        if (user.profileImg) {
            const publicId = user.profileImg.split("/").pop()?.split(".")[0];
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            };
            user.profileImg = "";
            await user.save();
            return response.status(200).json({ message: "Profile image deleted successfully" });
        } else {
            return response.status(400).json({ error: "No profile image to delete" });
        };
    } catch (error) {
        console.log("Error in deleteProfileImg: ", error);
        response.status(500).json({ error: "Failed to delete profile image" });
    };
};

export const deleteCoverImg = async (req: any, response: Response) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return response.status(404).json({ error: "User not found" });
        };
        if (user.coverImg) {
            const publicId = user.coverImg.split("/").pop()?.split(".")[0];
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            };
            user.coverImg = "";
            await user.save();
            return response.status(200).json({ message: "Cover image deleted successfully" });
        } else {
            return response.status(400).json({ error: "No cover image to delete" });
        };
    } catch (error) {
        console.log("Error in deleteCoverImg: ", error);
        response.status(500).json({ error: "Failed to delete cover image" });
    };
};