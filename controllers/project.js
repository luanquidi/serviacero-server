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

    if (req.files) {
        let arrayImages = [];
        let arrayImagesNormales = [];
        let cont = 0;
        req.files.forEach(async(item, index) => {
            const imgCloudinary = await cloudinary.v2.uploader.upload(item.path, {
                    eager: [
                        { width: 360, height: 240, crop: "pad" },
                    ]

                },
                function(error, result) {});
            arrayImagesNormales.push(imgCloudinary.url);
            arrayImagesNormales.push(imgCloudinary.eager[0].url);
            arrayImages.push(arrayImagesNormales);
            arrayImagesNormales = [];
            cont++;
            if (req.files.length === cont) {
                project.imgUrl = arrayImages;
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
            }
        });
    }


};

async function editProject(req, res) {
    let arrayImagesNormales = [];
    if (req.files) {
        let cont = 0;
        let arrayImages = [];
        req.files.forEach(async(item, index) => {
            const imgCloudinary = await cloudinary.v2.uploader.upload(item.path, {
                    eager: [
                        { width: 360, height: 240, crop: "pad" },
                    ]
                },
                function(error, result) {});
            arrayImagesNormales.push(imgCloudinary.url);
            arrayImagesNormales.push(imgCloudinary.eager[0].url);
            arrayImages.push(arrayImagesNormales);
            arrayImagesNormales = [];
            cont++;
            if (req.files.length === cont) {
                req.body.imgUrl = arrayImages;
                Project.findByIdAndUpdate({ _id: req.body.id }, req.body, (err, projectUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            ok: false,
                            message: "Error del servidor al editar proyecto.",
                        });
                    }

                    if (!projectUpdated) {
                        return res.status(400).send({
                            ok: false,
                            message: "No se ha podido editar el proyecto.",
                        });
                    }

                    return res.status(200).send({
                        ok: true,
                        message: "Se ha editado el proyecto correctamente.",
                        project: projectUpdated,
                    });
                });
            }
        });

    } else {
        Project.findByIdAndUpdate({ _id: req.body.id }, req.body, (err, projectUpdated) => {
            if (err) {
                return res.status(500).send({
                    ok: false,
                    message: "Error del servidor al editar proyecto.",
                });
            }

            if (!projectUpdated) {
                return res.status(400).send({
                    ok: false,
                    message: "No se ha podido editar el proyecto.",
                });
            }

            return res.status(200).send({
                ok: true,
                message: "Se ha editado el proyecto correctamente.",
                project: projectUpdated,
            });
        });
    }





}

// async function editProject(req, res) {
//     if (req.file) {
//         const imgCloudinary = await cloudinary.v2.uploader.upload(req.file.path, {
//                 eager: [
//                     { width: 400, height: 300, crop: "pad" },
//                     { width: 260, height: 200, crop: "crop", gravity: "north" }
//                 ]
//             },
//             function(error, result) {});
//         req.body.imgUrl = imgCloudinary.eager[0].url;
//     }


//     Project.findByIdAndUpdate({ _id: req.body.id }, req.body, (err, projectUpdated) => {
//         if (err) {
//             return res.status(500).send({
//                 ok: false,
//                 message: "Error del servidor al editar proyecto.",
//             });
//         }

//         if (!projectUpdated) {
//             return res.status(400).send({
//                 ok: false,
//                 message: "No se ha podido editar el proyecto.",
//             });
//         }

//         return res.status(200).send({
//             ok: true,
//             message: "Se ha editado el proyecto correctamente.",
//             project: projectUpdated,
//         });
//     });
// }

async function deleteProject(req, res) {
    const id = req.body.idProject;
    Project.findByIdAndRemove({ _id: id }, (err, projectDeleted) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: "Error del servidor al eliminar proyecto.",
            });
        }

        if (!projectDeleted) {
            return res.status(400).send({
                ok: false,
                message: "No se ha podido eliminar el proyecto.",
            });
        }

        return res.status(200).send({
            ok: true,
            message: "Se ha eliminado el proyecto correctamente.",
            post: projectDeleted,
        });
    });
}

async function getProject(req, res) {
    const id = req.query.id;

    Project.findOne({ _id: id }, (err, projectoFounded) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: "Error del servidor al listar proyecto.",
            });
        }

        if (!projectoFounded) {
            return res.status(400).send({
                ok: false,
                message: "No se ha podido listar el proyecto.",
            });
        }

        return res.status(200).send({
            ok: true,
            message: "Se ha listado el proyecto correctamente.",
            project: projectoFounded,
        });
    });
}

module.exports = {
    getProjects,
    addProject,
    editProject,
    deleteProject,
    getProject
};