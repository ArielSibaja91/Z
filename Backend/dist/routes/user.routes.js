"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_1 = require("../middleware/protectRoute");
const user_controller_1 = require("../controllers/user.controller");
const multer_1 = __importDefault(require("multer"));
// Multer to handle multipart/form-data for file uploads
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.get("/profile/:username", protectRoute_1.protectRoute, user_controller_1.getUserProfile);
router.get("/suggested", protectRoute_1.protectRoute, user_controller_1.getSuggestedUsers);
router.post("/follow/:id", protectRoute_1.protectRoute, user_controller_1.followUnfollowUser);
router.patch("/update", protectRoute_1.protectRoute, upload.none(), user_controller_1.updateUserProfile);
router.delete("/profile/delete-image", protectRoute_1.protectRoute, user_controller_1.deleteProfileImg);
router.delete("/cover/delete-image", protectRoute_1.protectRoute, user_controller_1.deleteCoverImg);
exports.default = router;
