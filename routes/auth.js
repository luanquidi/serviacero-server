const express = require("express");
const auth = require('../auth/auth');
const authMiddleware = require('../middlewares/auth');

const api = express.Router();

api.post("/login-user", auth.login);
api.post("/registroAdmin", [authMiddleware.verifyToken], auth.registroAdmin);



module.exports = api;