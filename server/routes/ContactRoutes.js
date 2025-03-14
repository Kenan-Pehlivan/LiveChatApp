import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactsforDMList, searchContacts } from "../controllers/ContactsController.js";


//Route für Kontakte 
const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsforDMList);
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts)

export default contactsRoutes;