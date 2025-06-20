import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUserProfile, deleteProfileImg, deleteCoverImg } from "../controllers/user.controller";
import multer from "multer";
// Multer to handle multipart/form-data for file uploads
const upload = multer();
const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.patch("/update", protectRoute, upload.none(), updateUserProfile);
router.delete("/profile/delete-image", protectRoute, deleteProfileImg);
router.delete("/cover/delete-image", protectRoute, deleteCoverImg);

export default router;