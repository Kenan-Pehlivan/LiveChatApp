import express from"express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";

//Alle Enviroment Variablen sind somit in Prosses.env (.env)
dotenv.config();

//Alle variblen holen
const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

// Um die Kommunikation zwischen mehrere Servern zu erlauben, durch RestAPI methoden
app.use(
  cors({
    origin:[process.env.ORIGIN],
    methods:["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
})
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);

//Jedes mal das der Server gestartet wird, gebe diese Meldung
const server = app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})

//Um mmit den Datenbank zu verbinden, inkl. einer Fehlermeldung bei falsch eingaben
mongoose.connect(databaseURL).then(() => console.log("DB Connection erfolgreich.")).catch(err=>console.log(err.message));