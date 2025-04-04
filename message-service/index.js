/*  Veränderungsdatum: 21.03.2025 
    Diese Datei ist dir Hauptserver-datei für die Message-service.
    Sie konfiguriert, startet und verbindet den Server mit MongoDB.
*/

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import messagesRoutes from "./routes/MessagesRoutes.js";


dotenv.config();
const app = express();
const port = process.env.PORT || 7001;

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use("/api/messages", messagesRoutes);

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Message DB connected"))
    .catch(err => console.log(err));

app.listen(port, () => console.log(`Message Service läuft auf Port ${port}`));