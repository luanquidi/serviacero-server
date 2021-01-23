const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt-nodejs");


async function login(req, res) {
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


};


module.exports = {
    login
}