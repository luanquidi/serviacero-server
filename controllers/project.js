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
    console.log(req.body)


    if (req.files && req.files.length > 0) {
        let arrayImages = [];
        let arrayImagesNormales = [];
        let cont = 0;

        req.files.forEach(async (item, index) => {
            const imgCloudinary = await cloudinary.v2.uploader.upload(item.path, {
                eager: [
                    { width: 720, height: 480 },
                ],
                folder: 'indumet'
            },
                function (error, result) { });
            // arrayImagesNormales.push(imgCloudinary.url);
            // arrayImagesNormales.push(imgCloudinary.eager[0].url);
            arrayImages.push(imgCloudinary.eager[0].url);
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
    } else {
        project.imgUrl = ['https://res.cloudinary.com/dxc1pkofx/image/upload/v1714596849/indumet/NoImage_vnmjj9.jpg']
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


};

async function editProject(req, res) {
    let arrayImagesNormales = [];
    if (req.files.length > 0) {
        let cont = 0;
        let arrayImages = [];

        // console.log(req.body)
        let project = await Project.findById({ _id: req.body._id });
        let listaImagenesAEliminar = []
        let imagenImg = false;

        if (typeof req.body.imgPrev != 'string') {
            req.body.imgPrev = req.body.imgPrev.filter((img) => !img.includes('data:'))
            project.imgUrl.map((imgFind) => {
                let existe = false
                req.body.imgPrev.map((imgPre) => {
                    if (imgFind.toString() == imgPre.toString()) existe = true;
                })
                if (!existe) listaImagenesAEliminar.push(imgFind)
            });

           imagenImg = req.body.imgPrev.some((x) => x == 'https://res.cloudinary.com/dxc1pkofx/image/upload/v1714596849/indumet/NoImage_vnmjj9.jpg')
        } else imagenImg = req.body.imgPrev == 'https://res.cloudinary.com/dxc1pkofx/image/upload/v1714596849/indumet/NoImage_vnmjj9.jpg'

        listaImagenesAEliminar.map(async imgDelete => {
            let url = imgDelete.split('/')
            url = url[url.length - 1].split('.')
            if (!url[0].includes('NoImage')) {
                let respuesta = await cloudinary.v2.uploader.destroy(`indumet/${url[0]}`)
                console.log(respuesta)
            }
        })

        let imgNoImage = project.imgUrl.some((x) => x == 'https://res.cloudinary.com/dxc1pkofx/image/upload/v1714596849/indumet/NoImage_vnmjj9.jpg')
        if(imgNoImage && !imagenImg) project.imgUrl = project.imgUrl.filter((x) => x != 'https://res.cloudinary.com/dxc1pkofx/image/upload/v1714596849/indumet/NoImage_vnmjj9.jpg')

        arrayImagesNormales = project.imgUrl;
        console.log(project.imgUrl)
        req.files.forEach(async (item, index) => {
            const imgCloudinary = await cloudinary.v2.uploader.upload(item.path, {
                eager: [
                    { width: 360, height: 240, crop: "pad" },
                ],
                folder: 'indumet'
            },
                function (error, result) { });
            arrayImagesNormales.push(imgCloudinary.eager[0].url);
            cont++;
            if (req.files.length === cont) {
                req.body.imgUrl = arrayImagesNormales;
                Project.findByIdAndUpdate({ _id: req.body._id }, req.body, (err, projectUpdated) => {
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
        let project = await Project.findById({ _id: req.body._id });
        let listaImagenesAEliminar = []
        let imagenImg = false;

        // console.log(project)
        // console.log(req.body)

        if (typeof req.body.imgPrev != 'string') {
            req.body.imgPrev = req.body.imgPrev.filter((img) => !img.includes('data:'))
            project.imgUrl.map((imgFind) => {
                let existe = false
                req.body.imgPrev.map((imgPre) => {
                    if (imgFind.toString() == imgPre.toString()) existe = true;
                })
                if (!existe) listaImagenesAEliminar.push(imgFind)
            });

           imagenImg = req.body.imgPrev.some((x) => x == 'https://res.cloudinary.com/dxc1pkofx/image/upload/v1714596849/indumet/NoImage_vnmjj9.jpg')
        } else imagenImg = req.body.imgPrev == 'https://res.cloudinary.com/dxc1pkofx/image/upload/v1714596849/indumet/NoImage_vnmjj9.jpg'

        listaImagenesAEliminar.map(async imgDelete => {
            let url = imgDelete.split('/')
            url = url[url.length - 1].split('.')
            if (!url[0].includes('NoImage')) {
                console.log(`indumet/${url[0]}`)
                let respuesta = await cloudinary.v2.uploader.destroy(`indumet/${url[0]}`)
                console.log(respuesta)
            }
        })

        let imgNoImage = project.imgUrl.some((x) => x == 'https://res.cloudinary.com/dxc1pkofx/image/upload/v1714596849/indumet/NoImage_vnmjj9.jpg')
        if(imgNoImage && !imagenImg) project.imgUrl = project.imgUrl.filter((x) => x != 'https://res.cloudinary.com/dxc1pkofx/image/upload/v1714596849/indumet/NoImage_vnmjj9.jpg')
        arrayImagesNormales = project.imgUrl;

        req.body.imgUrl = typeof req.body.imgPrev == 'string' ? [req.body.imgPrev] : req.body.imgPrev

        Project.findByIdAndUpdate({ _id: req.body._id }, req.body, (err, projectUpdated) => {
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

    let project = await Project.findById({ _id: id });

    project.imgUrl.map(async (item) => {
        let url = item.split('/')
        url = url[url.length - 1].split('.')
        if (!url[0].includes('NoImage')) {
            console.log(`indumet/${url[0]}`)
            let respuesta = await cloudinary.v2.uploader.destroy(`indumet/${url[0]}`)
        }
    })

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