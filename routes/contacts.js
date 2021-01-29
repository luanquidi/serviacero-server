const express = require("express");
const authMiddleware = require('../middlewares/auth');
const ContactController = require("../controllers/contacto");

const api = express.Router();

api.get("/contacts", ContactController.getContacts);
api.post("/add-contact", [authMiddleware.verifyToken], ContactController.addContact);


module.exports = api;