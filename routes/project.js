const express = require("express");
const ProjectController = require("../controllers/project");
const authMiddleware = require('../middlewares/auth');

const api = express.Router();

api.get("/projects", ProjectController.getProjects);
api.post("/add-project", [authMiddleware.verifyToken], ProjectController.addProject);
api.post("/edit-project", [authMiddleware.verifyToken], ProjectController.editProject);
api.post("/delete-project", [authMiddleware.verifyToken], ProjectController.deleteProject);
api.get("/get-project", ProjectController.getProject);


module.exports = api;