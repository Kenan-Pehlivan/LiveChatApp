/*  Veränderungsdatum: 21.03.2025 
    Diese Datei ist dir Hauptserver-datei für die Contact-service.
    Sie konfiguriert, startet und verbindet den Server mit MongoDB.
*/

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import contactsRoutes from "./routes/ContactRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 7001;

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use("/api/contacts", contactsRoutes);

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Contact DB connected"))
    .catch(err => console.log(err));

app.listen(port, () => console.log(`Contact Service läuft auf Port ${port}`));