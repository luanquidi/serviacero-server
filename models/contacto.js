const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ContactSchema = Schema({
    email: String,
    subject: String,
    message: String,
    telefono: String
});

module.exports = mongoose.model('Contacto', ContactSchema);