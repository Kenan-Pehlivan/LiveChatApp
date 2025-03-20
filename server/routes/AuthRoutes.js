import { Router } from "express";
import { getUserInfo, login, signup, updateProfile, addProfileImage, removeProfileImage, logout } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";
import rateLimit from "express-rate-limit";
import RateLimitRedisStore from "rate-limit-redis";
import { redisPubClient } from "../socket.js"; // Falls nur das Senden von Nachrichten benötigt wird

//Route für Register und Login Seite, 
const authRoutes = Router();
const upload = multer({dest:"uploads/profiles/"});


// Eigene RedisStore-Instanz für Login
const loginLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 Minuten
    max: 3,
    message: "Zu viele Login-Versuche. Bitte versuche es später erneut.",
    store: new RateLimitRedisStore({
        sendCommand: (...args) => redisPubClient.call(...args),
        prefix: "login_limit:", // Einzigartiger Präfix für Login
    }),
});




authRoutes.post("/signup", signup);
authRoutes.post("/login", loginLimiter,login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/add-profile-image",verifyToken,upload.single("profile-image"), addProfileImage);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.post("/logout", logout);

export default authRoutes; 