const express = require("express");
const ProjectController = require("../controllers/project");
const authMiddleware = require('../middlewares/auth');

const api = express.Router();

api.get("/projects", ProjectController.getProjects);
api.post("/add-project", [authMiddleware.verifyToken], ProjectController.addProject);


module.exports = api;