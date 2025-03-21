/*  Veränderungsdatum: 21.03.2025 
    Diese Datei enthält die Routen für die Verwaltung von Kanälen, einschließlich der Erstellung von Kanälen, des Abrufens von Kanälen und Nachrichten.
*/

import { Router } from "express";
import { createChannel, getChannelMessages, getUserChannels } from "../controllers/ChannelController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js"


const channelRoutes = Router();

// Initialisiert die Kanäle-Routen und die Authentifizierungsmiddleware

// Route für die Erstellung eines neuen Kanals, nur für authentifizierte Benutzer
channelRoutes.post("/create-channel", verifyToken, createChannel);

// Route für das Abrufen aller Kanäle eines Benutzers, nur für authentifizierte Benutzer
channelRoutes.get("/get-user-channels", verifyToken, getUserChannels);

// Route für das Abrufen aller Nachrichten eines Kanals, nur für authentifizierte Benutzer
channelRoutes.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);

export default channelRoutes;