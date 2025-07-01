"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.deleteNotifications = exports.getNotifications = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        // Finds the notifications of the current user in the db
        const notifications = await notification_model_1.default.find({ to: userId })
            .populate({
            path: "from",
            select: "username profileImg",
        });
        // Updates all of the notifications and sets the 'read' value to true
        await notification_model_1.default.updateMany({ to: userId }, { read: true });
        res.status(200).json(notifications);
    }
    catch (error) {
        console.log("Error in getNotifications controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
    ;
};
exports.getNotifications = getNotifications;
const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        // Delete all of the user notifications in the db
        await notification_model_1.default.deleteMany({ to: userId });
        res.status(200).json({ message: "Notifications deleted successfully" });
    }
    catch (error) {
        console.log("Error in deleteNotifications controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
    ;
};
exports.deleteNotifications = deleteNotifications;
const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;
        const notification = await notification_model_1.default.findById(notificationId);
        if (!notification)
            return res.status(404).json({ error: "Notification not found" });
        // Compares the notification.to value to the userId string value for validating
        if (notification.to.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not allowed to delete this notification" });
        }
        ;
        // Finds the notification in the db and deletes it
        await notification_model_1.default.findByIdAndDelete(notification);
        res.status(200).json({ message: "Notification deleted successfully" });
    }
    catch (error) {
        console.log("Error in deleteNotification controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
    ;
};
exports.deleteNotification = deleteNotification;
