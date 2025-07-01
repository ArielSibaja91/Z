"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoConection_1 = __importDefault(require("./database/mongoConection"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '..', '.env') });
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json({ limit: "5mb" })); // Parsing req.body
// This limit value shouldn't be so high to prevent DOS attacks
app.use((0, cookie_parser_1.default)()); // Uses cookie-parser
app.use(express_1.default.urlencoded({ extended: true })); // Parsing form data
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/posts", post_routes_1.default);
app.use("/api/notifications", notification_routes_1.default);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '..', '..', 'Frontend', 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '..', '..', 'Frontend', 'dist', 'index.html'));
    });
}
;
app.listen(PORT, () => {
    console.log(`Server is running in port: http://localhost:${PORT}`);
    (0, mongoConection_1.default)();
});
