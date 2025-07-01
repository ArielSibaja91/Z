"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.commentPost = exports.likePost = exports.createPost = exports.getUserPosts = exports.getFollowingPosts = exports.getLikedPosts = exports.getAllPosts = void 0;
const post_model_1 = __importDefault(require("../models/post.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const notification_model_1 = __importDefault(require("../models/notification.model"));
const cloudinary_1 = require("cloudinary");
const getAllPosts = async (req, res) => {
    try {
        // Gets all the lastest post at the top
        const posts = await post_model_1.default.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password",
        })
            .populate({
            path: "comments.user",
            select: "-password",
        });
        // Verifies if there are any posts
        if (posts.length === 0) {
            return res.status(200).json([]);
        }
        ;
        res.status(200).json(posts);
    }
    catch (error) {
        console.log("Error in getPosts controller", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.getAllPosts = getAllPosts;
const getLikedPosts = async (req, res) => {
    // Gets the user from the params
    const userId = req.params.id;
    try {
        const user = await user_model_1.default.findById(userId);
        // User validation
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Finds the post in the db and uses the $in operator to find all the posts that user has given like
        const likedPosts = await post_model_1.default.find({ _id: { $in: user.likedPosts } })
            // Select the password and remove it from the populate in both cases
            .populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });
        res.status(200).json(likedPosts);
    }
    catch (error) {
        console.log("Error in getLikedPosts controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    ;
};
exports.getLikedPosts = getLikedPosts;
const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await user_model_1.default.findById(userId);
        // User validation
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Gets the following array from the user
        const following = user.following;
        // Gets al the posts of the users that are currently followed
        const feedPosts = await post_model_1.default.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });
        res.status(200).json(feedPosts);
    }
    catch (error) {
        console.log("Error in getFollowingPosts controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    ;
};
exports.getFollowingPosts = getFollowingPosts;
const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        // Finds the user in the db by the username given in the params
        const user = await user_model_1.default.findOne({ username });
        // User validation
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Gets all the posts from the specified user
        const Posts = await post_model_1.default.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });
        res.status(200).json(Posts);
    }
    catch (error) {
        console.log("Error in getUserPosts controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    ;
};
exports.getUserPosts = getUserPosts;
const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();
        const user = await user_model_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // A post must have at least a text or an image
        if (!text && !img) {
            return res.status(400).json({ error: "Post must have text or image" });
        }
        ;
        // Uploads the image to cloudinary
        if (img) {
            const uploadedResponse = await cloudinary_1.v2.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }
        ;
        // creates a new Post instance
        const newPost = new post_model_1.default({
            user: userId,
            text,
            img,
        });
        // Saves the post in the db
        await newPost.save();
        // Populates the response so the frontend can reach the user properties
        const populatedPost = await newPost.populate({
            path: "user",
            select: "fullName username profileImg",
        });
        res.status(201).json(populatedPost);
    }
    catch (error) {
        console.log("Error in createPost controller", error);
        return res.status(500).json({ error: "Internal server error" });
    }
    ;
};
exports.createPost = createPost;
const likePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;
        const post = await post_model_1.default.findById(postId);
        // Post validation
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        ;
        // Verifies if the user already liked the post
        const userLikedPost = post.likes.includes(userId);
        // If so, unlike it
        if (userLikedPost) {
            // Unlikes the post
            await post_model_1.default.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await user_model_1.default.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
            res.status(200).json({ message: "Post unliked successfully" });
        }
        else {
            // Likes the post and saves it in the db
            post.likes.push(userId);
            await post.save();
            await user_model_1.default.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            // Creates a new Notification instance
            const notification = new notification_model_1.default({
                from: userId,
                to: post.user,
                type: "like",
            });
            // Saves the notification in the db
            await notification.save();
            res.status(200).json({ message: "Post liked succesfully" });
        }
        ;
    }
    catch (error) {
        console.log("Error in like/unlike Post controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    ;
};
exports.likePost = likePost;
const commentPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        // Verifies if there is text in the post
        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }
        ;
        const post = await post_model_1.default.findById(postId);
        // Validates post existance
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        ;
        // Creates a new comment with the respective user and text fields
        const comment = { user: userId, text };
        // Pushes a comment into the comments array of the post model
        post.comments.push(comment);
        // Saves the post into the db
        await post.save();
        res.status(200).json(post);
    }
    catch (error) {
        console.log("Error in comment Post controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    ;
};
exports.commentPost = commentPost;
const deletePost = async (req, res) => {
    try {
        const post = await post_model_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        ;
        // Validates if the user is authorized to delete the post
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }
        ;
        // Destroys the image in cloudinary
        if (post.img) {
            const imgId = post.img.split("/").pop()?.split(".")[0];
            if (imgId) {
                await cloudinary_1.v2.uploader.destroy(imgId);
            }
            ;
        }
        ;
        // Finds the post and delete it
        await post_model_1.default.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        console.log("Error in deletePost controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    ;
};
exports.deletePost = deletePost;
