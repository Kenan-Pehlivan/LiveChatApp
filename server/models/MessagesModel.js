/*  Veränderungsdatum: 21.03.2025 
    Diese Datei enthält das Mongoose-Datenmodell für Nachrichten, einschließlich Sender, Empfänger, Nachrichtentyp und Inhalt.
*/
import mongoose, { mongo } from "mongoose";

// Definiert das Schema für Nachrichten in der Datenbank
const messageSchema = new mongoose.Schema({
    // Der Benutzer, der die Nachricht sendet (Pflichtfeld, verweist auf "Users")
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    // Der Benutzer, der die Nachricht empfängt (optional, verweist auf "Users")
    recipient: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: false,
    
    },
    // Der Typ der Nachricht: entweder "text" oder "file" (Pflichtfeld)
    messageType:{
        	type:String,
            enum:["text","file"],
            required:true,

    },
    // Der Inhalt der Nachricht (Pflichtfeld, wenn Nachrichtentyp "text" ist)
    content:{
        type:String,
        required:function() {
            return this.messageType ==="text";
        },
    },

    // Die URL der Datei (Pflichtfeld, wenn Nachrichtentyp "file" ist)
    fileUrl:{
        type:String,
        required: function() {
            return this.messageType ==="file";

        },
    },
    // Der Zeitstempel, wann die Nachricht gesendet wurde (Standardwert: aktuelles Datum)
    timestamp:{
        type:Date,
        default: Date.now,
    },
    
});

// Erstellt das Nachrichtenmodell basierend auf dem Schema
const Message = mongoose.model("Messages", messageSchema);

export default Message;