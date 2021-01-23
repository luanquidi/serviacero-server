const express = require("express");
const auth = require('../auth/auth');

const api = express.Router();

api.post("/login-user", auth.login);


module.exports = api;