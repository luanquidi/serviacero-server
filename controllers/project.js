const Project = require("../models/project");
const cloudinary = require("cloudinary");

async function getProjects(req, res) {
    Project.find({}, (err, projectsStored) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: "Error del servidor al listar proyectos.",
            });
        }

        if (!projectsStored) {
            return res.status(400).send({
                ok: false,
                message: "No se han podido listar los proyectos.",
            });
        }

        return res.status(200).send({
            ok: true,
            message: "Se han listado los proyectos correctamente.",
            projects: projectsStored,
        });
    });
}

async function addProject(req, res) {
    const { name, description, createdAt } = req.body;
    const project = new Project();
    project.name = name;
    project.description = description;
    project.createdAt = createdAt;


    const imgCloudinary = await cloudinary.v2.uploader.upload(req.file.path, {
            eager: [
                { width: 400, height: 300, crop: "pad" },
                { width: 260, height: 200, crop: "crop", gravity: "north" }
            ]
        },
        function(error, result) {});
    project.imgUrl = imgCloudinary.eager[0].url;

    project.save((err, projectSaved) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: "Error del servidor al crear proyecto.",
            });
        }

        if (!projectSaved) {
            return res.status(400).send({
                ok: false,
                message: "No se ha podido crear el proyecto.",
            });
        }

        return res.status(200).send({
            ok: true,
            message: "Se ha creado el proyecto correctamente.",
            project: projectSaved,
        });
    });
};

module.exports = {
    getProjects,
    addProject
};