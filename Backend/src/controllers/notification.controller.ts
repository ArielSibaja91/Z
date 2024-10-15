import { Response } from "express"
import Notification from "../models/notification.model";

export const getNotifications = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        // Finds the notifications of the current user in the db
        const notifications = await Notification.find({ to: userId })
            .populate({
                path: "from",
                select: "user profileImg",
            });
        // Updates all of the notifications and sets the 'read' value to true
        await Notification.updateMany({ to: userId }, { read: true });
        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications controller", error);
        res.status(500).json({ error: "Internal server error" });
    };
};

export const deleteNotifications = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        // Delete all of the user notifications in the db
        await Notification.deleteMany({ to: userId });
        res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotifications controller", error);
        res.status(500).json({ error: "Internal server error" });
    };
};

export const deleteNotification = async (req: any, res: Response) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;
        const notification = await Notification.findById(notificationId);
        if (!notification) return res.status(404).json({ error: "Notification not found" });
        // Compares the notification.to value to the userId string value for validating
        if (notification.to.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not allowed to delete this notification" });
        };
        // Finds the notification in the db and deletes it
        await Notification.findByIdAndDelete(notification);
        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotification controller", error);
        res.status(500).json({ error: "Internal server error" });
    };
};