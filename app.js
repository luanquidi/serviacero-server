const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3977;
const jwt = require('jsonwebtoken');
const User = require("./models/user");
const path = require('path');
const Project = require("./models/project");
// const upload = require('./libs/storage');
const multer = require('multer');
const uuid = require('uuid/v4');
// const fileupload = require('express-fileupload');

const {
    API_VERSION,
    IP_SERVER,
    PORT_DB,
    USER_DB,
    PASSWORD_DB,
} = require("./config");


// =================================================== MONGO ==========================================================
const urlDatabaseProd = `mongodb+srv://${USER_DB}:${PASSWORD_DB}@cluster0-2dg8m.mongodb.net/serviacero?retryWrites=true&w=majority`;
mongoose.set("useFindAndModify", false);

mongoose.connect(
    urlDatabaseProd, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err, res) => {
        if (err) throw err;
        console.log("La conexión a la base de datos es correcta.");
    }
);

// =================================================== MONGO ==========================================================

const app = express();
// app.use(fileupload());
// =================================================== CORS ==========================================================
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});
// =================================================== CORS ==========================================================
// =================================================== BODY-PARSER ==========================================================
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// =================================================== BODY-PARSER ==========================================================
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
})
app.use(multer({ storage }).single('image'));

cloudinary.config({
    cloud_name: 'dxc1pkofx',
    api_key: '338795214563965',
    api_secret: 'DAcYKBN2cgJPAFjhIc1f6YAVm3g'
});
// =================================================== LOGIN ==========================================================

app.get('/api', (req, res) => {
    res.json({
        mensaje: 'NodeJs en JWT'
    })
});

app.post('/api/login', (req, res) => {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    User.findOne({ email }, (err, userFound) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: "Error del servidor, por favor intente más tarde.",
            });
        }

        if (!userFound) {
            return res.status(404).send({ ok: false, message: "Usuario no existe." });
        }

        bcrypt.compare(password, userFound.password, (err, check) => {
            if (err) {
                return res
                    .status(500)
                    .send({ ok: false, message: "Error al comparar credenciales." });
            }
            if (!check) {
                return res
                    .status(404)
                    .send({ ok: false, message: "Credenciales incorrectas." });
            }
            if (!userFound.active) {
                return res
                    .status(404)
                    .send({ ok: false, message: "El usuario no está activo :(" });
            } else {
                jwt.sign({ userFound }, 'secretkey', (err, token) => {
                    return res.json({
                        ok: true,
                        message: "Ingreso correcto!",
                        token
                    });
                });
            }
        });
    });


});
// =================================================== LOGIN ==========================================================

// =================================================== RUTAS ==========================================================
app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                mensaje: 'Post fue creado',
                authData
            });
        }
    });
});

app.post('/api/add-project', verifyToken, async(req, res) => {
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
});

app.get('/api/projects', async(req, res) => {


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
});
// =================================================== RUTAS ==========================================================

// =================================================== VERIFICACIÓN ==========================================================
function verifyToken(req, res, next) {
    // Authorization: Bearer <token>
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}
// =================================================== VERIFICACIÓN ==========================================================





app.listen(port, function() {
    console.log('Aplicación corriendo...', port);
});