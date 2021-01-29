const Contacto = require("../models/contacto");

async function getContacts(req, res) {
    Contacto.find({}, (err, contactosEncontrados) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: "Error del servidor al listar contactos.",
            });
        }

        if (!contactosEncontrados) {
            return res.status(400).send({
                ok: false,
                message: "No se han podido listar los contactos.",
            });
        }

        return res.status(200).send({
            ok: true,
            message: "Se han listado los contactos correctamente.",
            contacts: contactosEncontrados,
        });
    });
}

async function addContact(req, res) {
    let contacto = new Contacto();
    console.log(req.body);
    contacto.mail = req.body.correo.mail;
    contacto.cel = req.body.correo.cel;
    contacto.asunto = req.body.correo.asunto;
    contacto.mensaje = req.body.correo.mensaje;

    contacto.save((err, contactSaved) => {
        if (err) {
            return res.status(500).send({
                ok: false,
                message: "Error del servidor al crear contacto.",
            });
        }

        if (!contactSaved) {
            return res.status(400).send({
                ok: false,
                message: "No se ha podido crear el contacto.",
            });
        }

        return res.status(200).send({
            ok: true,
            message: "Se han registrado tus datos, te contactaremos!.",
            contact: contactSaved,
        });
    });
};
module.exports = {
    getContacts,
    addContact
}