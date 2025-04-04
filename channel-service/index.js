/*  Veränderungsdatum: 29.03.2025 
    Diese Datei ist dir Hauptserver-datei für die Channel-service.
    Sie konfiguriert, startet und verbindet den Server mit MongoDB.
*/

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 6001;

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/channel", channelRoutes);

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Channel DB connected"))
    .catch(err => console.log(err));

app.listen(port, () => console.log(`Channel Service läuft auf Port ${port}`))