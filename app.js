const express = require('express');
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3977;
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');


// Rutas
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const contactsRoutes = require("./routes/contacts");

const {
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


// =================================================== CLOUDINARY ==========================================================
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
});

// app.use(multer({ storage }).array('image'));

cloudinary.config({
    cloud_name: 'dxc1pkofx',
    api_key: '338795214563965',
    api_secret: 'DAcYKBN2cgJPAFjhIc1f6YAVm3g'
});
// =================================================== CLOUDINARY ==========================================================

// =================================================== RUTAS ==========================================================
app.use(`/api/login`, authRoutes);
app.use(`/api/project`, projectRoutes);
app.use(`/api/contacts`, contactsRoutes);
// =================================================== RUTAS ==========================================================




app.listen(port, function() {
    console.log('Aplicación corriendo...', port);
});