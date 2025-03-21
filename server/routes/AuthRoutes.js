/*  Veränderungsdatum: 21.03.2025 
    Diese Datei enthält die Routen und Logik für die Benutzer-Authentifizierung, einschließlich Registrierung, Login, Profilaktualisierung und Logout.
*/

import { Router } from "express";
import { getUserInfo, login, signup, updateProfile, addProfileImage, removeProfileImage, logout } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";
import rateLimit from "express-rate-limit";
import RateLimitRedisStore from "rate-limit-redis";
import { redisPubClient } from "../socket.js"; // Falls nur das Senden von Nachrichten benötigt wird

// Initialisiert die Authentifizierungsrouten und Middleware
const authRoutes = Router();

// Definiert die Konfiguration für das Hochladen von Profilbildern mit Multer
const upload = multer({dest:"uploads/profiles/"});

// Definiert die Rate-Limitierung für den Login-Versuch (maximal 3 Versuche alle 15 Minuten)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 3,
    message: "Zu viele Login-Versuche. Bitte versuche es später erneut.",
    store: new RateLimitRedisStore({
        sendCommand: (...args) => redisPubClient.call(...args),
        prefix: "login_limit:", // Einzigartiger Präfix für Login
    }),
});

// Route für die Benutzerregistrierung
authRoutes.post("/signup", signup);
// Route für den Login mit einer Rate-Limitierung
authRoutes.post("/login", loginLimiter, login);
// Route für das Abrufen von Benutzerdaten, nur für authentifizierte Benutzer
authRoutes.get("/user-info", verifyToken, getUserInfo);
// Route für das Aktualisieren von Benutzerprofilinformationen
authRoutes.post("/update-profile", verifyToken, updateProfile);
// Route für das Hinzufügen eines Profilbildes
authRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
// Route für das Entfernen eines Profilbildes
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
// Route für das Benutzer-Logout
authRoutes.post("/logout", logout);

export default authRoutes;