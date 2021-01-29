const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ContactSchema = Schema({
    mail: String,
    asunto: String,
    mensaje: String,
    cel: String
});

module.exports = mongoose.model('Contacto', ContactSchema);